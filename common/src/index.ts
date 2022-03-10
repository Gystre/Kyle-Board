import { object, string } from "yup";

export enum PermissionLevel {
    User = 0,
    Admin,
}

export enum SocketCmds {
    SendMessage = "SendMessage",
}

export const createRegisterSchema = object().shape({
    email: string().email().max(255).required(),
    username: string()
        .matches(
            /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/,
            "Can't use special characters or spaces"
        ) // https://stackoverflow.com/questions/1221985/how-to-validate-a-user-name-with-regex#37658211
        .min(3, "Too short!")
        .max(30, "Too long!")
        .required(),
    password: string().min(3).max(255).required(),
});

export const createLoginSchema = object().shape({
    usernameOrEmail: string()
        .min(3, "Too short!")
        .max(255, "Too long!")
        .required(),
    password: string().min(3).max(255).required(),
});

export const createPostSchema = object().shape({
    text: string().min(1, "Too short!").max(300, "Too long!").required(),
});
