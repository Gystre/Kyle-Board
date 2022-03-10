import { Field, ObjectType } from "type-graphql";
import { Response } from "../../utils/Response";
import { Post } from "./PostEntity";

@ObjectType()
export class PostResponse extends Response {
    @Field(() => Post, { nullable: true })
    post?: Post;
}
