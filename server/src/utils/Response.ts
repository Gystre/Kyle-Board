import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
    @Field()
    field: string; //what field is wrong, ex. email password

    @Field()
    message: string; //msg with what's actually wrong
}

@ObjectType()
export abstract class Response {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
