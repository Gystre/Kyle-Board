import { createPostSchema, PermissionLevel, SocketCmds } from "@kyle/common";
import {
    Arg,
    Ctx,
    FieldResolver,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { safeUserSelect } from "../../constants";
import { io } from "../../index";
import { isAuth } from "../../middleware/IsAuth";
import { MyContext } from "../../types";
import { formatYupError } from "../../utils/formatYupError";
import { User } from "../user/UserEntity";
import { PaginatedPosts } from "./PaginatedPosts";
import { Post } from "./PostEntity";
import { PostResponse } from "./PostResponse";

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    @FieldResolver(() => User)
    creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
        //batch all sql requests into a single one using dataloader
        return userLoader.load(post.creatorId);
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);

        //add one to the amount of posts we're getting, if that 1 extra post exists then there is more data
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        //passed in a cursor? then take all posts after the timestamp
        if (cursor) {
            const date = new Date(parseInt(cursor));
            if (date instanceof Date && !isNaN(date.valueOf()))
                replacements.push(new Date(parseInt(cursor)));
        }

        //performing a join between 2 queries, one post and one for the post itself
        //first line = reference the post table and select all the fields on it
        //inner join = using public.user b/c we have table conflicts when just using the user table
        const posts = await getConnection().query(
            `
            select *
            from post
            ${cursor ? `where "createdAt" < $2` : ""}
            order by "createdAt" DESC
            limit $1
          `,
            replacements
        );

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => Post, { nullable: true })
    post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
        //need to add creator relation b/c we expect it on the post.graphql in the frontend
        //called "creator" b/c name inside entity
        return Post.findOne(id);
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("text") text: string,

        @Ctx() { req }: MyContext
    ): Promise<PostResponse> {
        try {
            await createPostSchema.validate({ text }, { abortEarly: false });
        } catch (err) {
            return formatYupError(err);
        }

        const creator = await User.findOne(req.session.userId, {
            select: safeUserSelect,
        });

        var post = await Post.create({
            text,
            creatorId: req.session.userId,
            creator,
        }).save();

        console.log(post);

        // tell the connected people that something new was posted
        io.emit(SocketCmds.SendMessage, post);

        return { post };
    }

    @Mutation(() => PostResponse, { nullable: true })
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("text") text: string,
        @Ctx() { req }: MyContext
    ): Promise<PostResponse | null> {
        try {
            await createPostSchema.validate({ text }, { abortEarly: false });
        } catch (err) {
            return formatYupError(err);
        }

        const result = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({
                text,
            })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
            .returning("*")
            .execute();

        //return the newly edited post
        return { post: result.raw[0] };
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Arg("creatorId", () => Int) creatorId: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        // can't delete if not admin or doesn't own post
        const user = await User.findOne(req.session.userId, {
            select: ["permissionLevel"],
        });

        if (
            user?.permissionLevel == PermissionLevel.Admin ||
            creatorId == req.session.userId
        ) {
            await Post.delete({ id, creatorId });
            return true;
        }

        return false;
    }
}
