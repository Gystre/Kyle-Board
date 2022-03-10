import {
    createLoginSchema,
    createRegisterSchema,
    PermissionLevel,
} from "@kyle/common";
import argon2 from "argon2";
import { FieldError } from "src/utils/Response";
import {
    Arg,
    Ctx,
    FieldResolver,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { COOKIE_NAME } from "../../constants";
import { MyContext } from "../../types";
import { formatYupError } from "../../utils/formatYupError";
import { User } from "./UserEntity";
import { UserResponse } from "./UserResponse";
const md5 = require("md5");

@Resolver(User)
export class UserResolver {
    //a field level resolver will run whenever a graphql query is made
    //make sure other users can't see other people's emails
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        //make sure user can only see their email and not anyone else's
        if (req.session.userId === user.id) {
            return user.email;
        }

        return "";
    }

    //NEED CHANGE PASSWORD
    //NEED FORGOT PASSWORD

    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
        //not logged in
        if (!req.session.userId) {
            return null;
        }
        return User.findOne(req.session.userId);
    }

    @Query(() => User, { nullable: true })
    findById(@Arg("id", () => Int) id: number) {
        return User.findOne(id);
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("email") email: string,

        @Arg("username") username: string,

        @Arg("password") password: string,

        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        try {
            await createRegisterSchema.validate(
                { email, username, password },
                { abortEarly: false }
            );
        } catch (err) {
            return formatYupError(err);
        }

        //add the user
        //hash password and create the object in the User table
        const hashedPassword = await argon2.hash(password);
        let user;
        try {
            //use default profile pictures from gravatar
            const imageUrl =
                "https://gravatar.com/avatar/" + md5(email) + "?d=retro";

            user = await User.create({
                username,
                email,
                password: hashedPassword,
                imageUrl,
                permissionLevel: PermissionLevel.User,
            }).save();

            //store uid session
            //set a cookie on the user and keep them logged in
            req.session.userId = user.id;
        } catch (err) {
            //duplicate username error
            if (err.code === "23505" || err.detail.includes("already exists")) {
                var errors: FieldError[] = [];
                if (err.detail.includes("email")) {
                    errors.push({
                        field: "username",
                        message: "Username has already been taken",
                    });
                }

                if (err.detail.includes("email")) {
                    errors.push({
                        field: "email",
                        message: "That email is already in use",
                    });
                }
                return {
                    errors,
                };
            }
        }

        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        try {
            await createLoginSchema.validate(
                { usernameOrEmail, password },
                { abortEarly: false }
            );
        } catch (err) {
            return formatYupError(err);
        }

        //find the user in the database
        const user = await User.findOne(
            usernameOrEmail.includes("@")
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } }
        );

        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }

        //check password
        const valid = await argon2.verify(user.password as string, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        /*
            VULNERABILITY
            Can spam logins and create infinite sessions
            Maybe limit user to maximum 5 sessions or smthn
        */

        //adds a userId field onto the session's cookie
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        //remove session from redis
        //wait for destroy to finsh with a promise
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                //clear the cookie on the response so the client doesn't have it anymore
                //destroy the cookie even if we couldn't destroy the session
                res.clearCookie(COOKIE_NAME);

                if (err) {
                    console.log(err);

                    //respond false
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }
}
