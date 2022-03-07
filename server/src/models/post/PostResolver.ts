import { MyContext } from "src/types";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { User } from "../user/UserEntity";
import { Post } from "./PostEntity";

@Resolver(Post)
export class PostResolver {
    //will always fetch the creator
    @FieldResolver(() => User)
    creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
        //batch all sql requests into a single one using dataloader
        return userLoader.load(post.creatorId);
    }
}
