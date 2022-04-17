import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config"; //takes vars in .env and makes them environment variables
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import { Server as IoServer, Socket } from "socket.io";
import { buildSchema } from "type-graphql";
import { createConnection, getManager } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./models/post/PostEntity";
import { PostResolver } from "./models/post/PostResolver";
import { User } from "./models/user/UserEntity";
import { UserResolver } from "./models/user/UserResolver";
import { createUserLoader } from "./utils/createUserLoader";

export var io: IoServer;

const main = async () => {
    let retries = 5;
    while (retries) {
        try {
            console.log("heroku pg: " + process.env.DATABASE_URL);

            //create db connection for typeorm
            const connection = await createConnection({
                url: __prod__
                    ? process.env.DATABASE_URL
                    : process.env.LOCAL_DATABASE_URL,
                // for docker stuff
                // database: "kyle-board",
                // username: "postgres",
                // password: __prod__ ? "postgres" : process.env.POSTGRES_PASSWORD,
                // host: __prod__ ? process.env.PROD_DB_HOST : "localhost",

                type: "postgres",
                logging: true,
                // synchronize: true, //create the tables automatically without running a migration (keeping this off cuz deletes indices and ts_vectors)
                migrations: [path.join(__dirname, "./migrations/*")],
                entities: [User, Post], //MAKE SURE TO ADD ANY NEW ENTITIES HERE
            });
            connection.runMigrations();
            break;
        } catch (err) {
            console.log(err);
            retries -= 1;
            console.log("retries left: " + retries);

            // wait for second
            await new Promise((res) => setTimeout(res, 5000));
        }
    }

    //create an instance of express
    const app = express();

    //initialize the redis session (for saving browser cookies and stuff so user can stay logged in after refreshing the page)
    //this needs to come before apollo middle ware b/c we're going to be using this inside of apollo
    const RedisStore = connectRedis(session);
    const redis = new Redis(
        __prod__ ? process.env.REDIS_URL : process.env.LOCAL_REDIS_URL
    );

    //tell express we have a proxy sitting in front so cookies and sessions work
    app.set("trust proxy", 1);

    //apply cors middleware to all routes (pages)
    app.use(
        cors({
            origin: [
                __prod__
                    ? process.env.LOCAL_CORS_ORIGIN
                    : (process.env.CORS_ORIGIN as string),
                "https://studio.apollographql.com",
                "https://kyle-reddit.vercel.app/",
            ],
            methods: ["GET", "POST"],
            credentials: true,
        })
    );

    //create the express session
    const sessionMiddleware = session({
        name: COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTTL: true,
            disableTouch: true, //disables lifecycle of cookies so they last forever
        }),
        cookie: {
            // use these settings so that apollo graphql editor works with express-session
            // figure this out later, will need to fake ssl to get https on front end or use different graphql editor :/
            // https://www.reddit.com/r/graphql/comments/pxhvi7/comment/hkfabxl/?utm_source=share&utm_medium=web2x&context=3
            // secure: true,
            // sameSite: "none",

            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
            httpOnly: true, //make sure cookie only available on serverside
            sameSite: "lax", //protect csrf
            secure: __prod__, //cookie only works in https
            domain: __prod__ ? ".kylegodly.com" : undefined, //need to add domain b/c sometimes server doesn't always forward cookie correctly
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false, //makes sure not continuing to ping redis
    });

    app.use(sessionMiddleware);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
            validate: false,
        }),

        //make the orm object available to all resolvers
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(), //a new userLoader will be created on every request
        }),

        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                    // need this so cookies are created while using graphql playground
                    "request.credentials": "same-origin",
                },
            }),
        ],
    });

    //creates graphql endpoint for us on express
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    //start the server
    const port = __prod__
        ? (process.env.PORT as string)
        : process.env.LOCAL_PORT;
    const httpServer = app.listen(parseInt(port), async () => {
        /*
            Streamline this process by creating helper functions that auto generate these statements for me
            all i need to do is pass the table and indexable columns. Then again there are probs way better solutions
            out there or better approaches to FTS than postgres built in solution
        */
        const documentExists = await getManager().query(
            `SELECT column_name FROM information_schema.columns WHERE table_name='user' and column_name='user_document'`
        );

        if (documentExists.length == 0) {
            // create the index column with gin indices
            // maybe way to define tsvectors and indices more declatively with typeorm?
            await getManager().query(`
                ALTER TABLE post add column post_document tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('english', coalesce(text, '')), 'A')
                ) STORED;

                ALTER TABLE public."user" add column user_document tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('english', coalesce(username, '')), 'A')
                ) STORED;

                CREATE INDEX post_document_idx ON post USING GIN (post_document);
                CREATE INDEX user_document_idx ON public."user" USING GIN (user_document);
            `);

            console.log("created the indices");
        }
        console.log("Kyle Board server started on localhost:" + port);
    });

    //stick on the socket.io stuff
    io = new IoServer(httpServer, {
        cookie: true,
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        //adding the same middleware here allows us to use the same sessionID as the authentication and gives us access to the user id
        let req = socket.request as express.Request;
        let res = req.res as express.Response;
        sessionMiddleware(req, res, next as express.NextFunction);
    });

    io.on("connection", async (socket: Socket) => {
        const req = socket.request as express.Request;
        const sessionId = "sess:" + req.sessionID;

        //check redis for the userId
        if (!(await redis.exists(sessionId))) {
            //not authenticated
            return;
        }

        const userId = JSON.parse(
            (await redis.get(sessionId)) as string
        ).userId;

        console.log("users connected", io.engine.clientsCount);
        console.log("id:", userId, ",", sessionId, "connected");

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
};

main().catch((err) => {
    console.error(err);
});
