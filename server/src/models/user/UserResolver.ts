import {
    createLoginSchema,
    createRegisterSchema,
    PermissionLevel,
} from "@kyle/common";
import argon2 from "argon2";
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
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX, __prod__ } from "../../constants";
import { MyContext } from "../../types";
import { formatYupError } from "../../utils/formatYupError";
import { FieldError } from "../../utils/Response";
import { sendEmail } from "../../utils/sendEmail";
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

    //email the user a link they can click to reset their password
    //contains a uuid that is good for one time
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            //email not in db
            //returning true and doing nothing to prevent people from phishing through website for valid emails
            return true;
        }

        //create unique one time use token
        const token = v4();

        //store the token in redis
        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            user.id,
            "ex",
            1000 * 60 * 60 * 24 * 3 //good for up to 3 days
        );

        const domain = __prod__
            ? "https://kylegodly.com"
            : process.env.CORS_ORIGIN;
        await sendEmail(
            email,
            `
            <div>haha imagine forgetting ur password</div>
            <div>Here's the reset link for ur forgotten password</div>
            <a href="${domain}/change-password/${token}">reset password</a>
            `
        );
        return true;
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length < 3) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "length must be greater than 3",
                    },
                ],
            };
        }

        const key = FORGET_PASSWORD_PREFIX + token;

        //make sure the token is valid
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    },
                ],
            };
        }

        //find the user according to their id
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }

        //save the new password to the db
        User.update(
            { id: userIdNum },
            { password: await argon2.hash(newPassword) }
        );

        //remove the key from redis so it can't be used anymore
        await redis.del(key);

        //login user after changing the password
        req.session.userId = user.id;

        return { user };
    }
}
