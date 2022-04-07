import {
    createPostSchema,
    createS3Schema,
    PermissionLevel,
    SocketCmds,
} from "@kyle/common";
import B2 from "backblaze-b2";
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
import { io } from "../../";
import { safeUserSelect } from "../../constants";
import { isAuth } from "../../middleware/IsAuth";
import { MyContext } from "../../types";
import { createValidateFileUrlSchema } from "../../utils/createValidateFileUrlSchema";
import { formatYupError } from "../../utils/formatYupError";
import { yyyymmdd } from "../../utils/yyyymmdd";
import { User } from "../user/UserEntity";
import { B2Response } from "./B2Response";
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
        @Arg("limit", () => Int)
        limit: number,

        @Arg("cursor", () => String, { nullable: true })
        cursor: string | null,

        @Arg("creatorId", () => Int, { nullable: true })
        creatorId: number | null
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);

        //add one to the amount of posts we're getting, if that 1 extra post exists then there is more data
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (creatorId) replacements.push(creatorId);

        //passed in a cursor? then take all posts after the timestamp
        if (cursor) {
            const date = new Date(parseInt(cursor));
            if (date instanceof Date && !isNaN(date.valueOf()))
                replacements.push(new Date(parseInt(cursor)));
        }

        /*
            $1 = limit + 1
            $2 = cursor or creatorId
            $3 = cursor
        */

        // there's gotta be a smarter way to do this :/
        var sql = "";
        if (cursor && creatorId) {
            sql = `
            select *
            from post
            where "createdAt" < $3 and "creatorId" = $2
            order by "createdAt" DESC
            limit $1`;
        } else if (creatorId && !cursor) {
            sql = `
            select *
            from post
            where "creatorId" = $2
            order by "createdAt" DESC
            limit $1`;
        } else if (cursor && !creatorId) {
            sql = `
            select *
            from post
            where "createdAt" < $2
            order by "createdAt" DESC
            limit $1
            `;
        } else {
            sql = `
            select *
            from post
            order by "createdAt" DESC
            limit $1`;
        }

        const posts = await getConnection().query(sql, replacements);

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
        @Arg("newFileName", { nullable: true }) newFileName: string,
        @Ctx() { req }: MyContext
    ): Promise<PostResponse> {
        try {
            await createPostSchema.validate({ text }, { abortEarly: false });

            if (newFileName)
                await createValidateFileUrlSchema.validate({
                    newFileName,
                });
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
            fileUrl: newFileName
                ? "https://" +
                  process.env.B2_BUCKET +
                  "." +
                  process.env.B2_ENDPOINT_URL +
                  "/" +
                  newFileName
                : undefined, // null in postgres but undefined in js??????
        }).save();

        // tell the connected people that something new was posted
        io.emit(SocketCmds.SendMessage, post);

        return { post };
    }

    @Mutation(() => B2Response)
    @UseMiddleware(isAuth)
    async signB2(
        @Arg("fileName") fileName: string,
        @Arg("fileType") fileType: string
    ): Promise<B2Response> {
        try {
            await createS3Schema.validate(
                { fileName, fileType },
                { abortEarly: false }
            );
        } catch (err) {
            return formatYupError(err);
        }

        // generate safe file name
        const date = yyyymmdd();
        const randomString = Math.random().toString(36).substring(2, 7);
        const cleanFileName = fileName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const newName = `images/${date}-${randomString}-${cleanFileName}`;

        // get signed backblaze url
        const b2 = new B2({
            applicationKeyId: process.env.B2_KEY_ID,
            applicationKey: process.env.B2_APPLICATION_KEY,
        });

        await b2.authorize();

        const url = await b2.getUploadUrl({
            bucketId: process.env.B2_BUCKET_ID,
        });

        if (url.status != "200") {
            return {
                errors: [
                    {
                        field: "getUploadUrl",
                        message: "Failed and returned " + url.status,
                    },
                ],
            };
        }

        type UrlData = {
            authorizationToken: string;
            bucketId: string;
            uploadUrl: string;
        };

        const data: UrlData = url.data;

        return {
            uploadUrl: data.uploadUrl,
            authorizationToken: data.authorizationToken,
            fileName: newName,
        };
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

        // only admins or owner of post can delete
        if (
            user?.permissionLevel != PermissionLevel.Admin &&
            creatorId != req.session.userId
        ) {
            return false;
        }

        await Post.delete({ id, creatorId });

        // tell everyone we deleted a post
        io.emit(SocketCmds.DeleteMessage, id);

        // TODO: delete image here

        return true;
    }

    @Query(() => [Post])
    async searchPost(
        @Arg("query", () => String) query: string
    ): Promise<Post[]> {
        return getConnection()
            .createQueryBuilder(Post, "p")
            .select()
            .where("post_document @@ plainto_tsquery(:query)", {
                query,
            })
            .orderBy("ts_rank(post_document, plainto_tsquery(:query))", "DESC")
            .getMany();
    }
}
