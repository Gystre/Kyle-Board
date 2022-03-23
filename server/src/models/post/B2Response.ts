import { Field, ObjectType } from "type-graphql";
import { Response } from "../../utils/Response";

@ObjectType()
export class B2Response extends Response {
    @Field(() => String, { nullable: true })
    authorizationToken?: string;

    @Field(() => String, { nullable: true })
    uploadUrl?: string;

    @Field(() => String, { nullable: true })
    fileName?: string;
}
