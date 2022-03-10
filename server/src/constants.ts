import { User } from "./models/user/UserEntity";

export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";
export const FORGET_PASSWORD_PREFIX = "forget-password:";

// safe fields to select on the User table
export const safeUserSelect: (keyof User)[] = [
    "id",
    "username",
    "imageUrl",
    "permissionLevel",
];
