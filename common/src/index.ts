import { mixed, object, string } from "yup";

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

export const MAX_FILE_SIZE_MB = 10;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

export const createPostSchema = object().shape({
    text: string().min(1, "Too short!").max(300, "Too long!").required(),

    // only used on frontend :/
    file: mixed()
        .nullable()
        .test(
            "FILE_SIZE",
            `File can't be bigger than ${MAX_FILE_SIZE_MB}mb`,
            (value) =>
                !value || (value && value.size < MAX_FILE_SIZE_MB * 1000000)
        )
        .test(
            "FILE_TYPE",
            "File must be a jpg, jpeg, png, or gif",
            (value) =>
                !value || (value && SUPPORTED_FORMATS.includes(value?.type))
        ),
});

export const createS3Schema = object().shape({
    fileName: string().min(1).max(255).required(),
    fileType: string()
        .required()
        .min(1)
        .test(
            "FILE_TYPE",
            "File must be a jpg, jpeg, png, or gif",
            (value) => SUPPORTED_FORMATS.includes(value || "") // how can string possibly ever be undefined here???
        )
        .required(),
});
