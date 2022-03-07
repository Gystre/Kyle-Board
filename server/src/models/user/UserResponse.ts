import { Field, ObjectType } from "type-graphql";
import { Response } from "../../utils/Response";
import { User } from "../user/UserEntity";

//object types are returned from the mutations
//the return response from the mutation, will be optional (?) so that it's one or the other
@ObjectType()
export class UserResponse extends Response {
    @Field(() => User, { nullable: true })
    user?: User;
}
