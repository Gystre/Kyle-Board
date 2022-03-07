import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

//middleware = runs before resolver
//this is useful for reusing code that needs to be run before the resolvers, things like sanity checks for example
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("not authenticated");
    }

    return next();
};
