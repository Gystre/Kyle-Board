import { mixed, object, string } from "yup";

/*
    used in Post table: determines the type of file that is attached with
    maybe add Mixed file type or smthn later for posts with multiple videos and images
*/
export enum FileType {
    Unknown, // used during validation if can't figure out what file type it is
    Image,
    Video,
}

export enum PermissionLevel {
    User = 0,
    Admin,
}

export enum SocketCmds {
    SendMessage = "SendMessage",
    DeleteMessage = "DeleteMessage",
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
    captchaToken: string().required("Captcha is not complete!"),
});

export const createLoginSchema = object().shape({
    usernameOrEmail: string()
        .min(3, "Too short!")
        .max(255, "Too long!")
        .required(),
    password: string().min(3).max(255).required(),
});

export const MAX_FILE_SIZE_MB = 15;
const SUPPORTED_FORMATS: { [key: string]: FileType } = {
    image: FileType.Image,
    video: FileType.Video,
};

// for the html input tag on frontend
export const INPUT_SUPPORTED_FORMATS = "image/*, video/*";

// this is probably the most pointless piece code in the entire codebase but wutever it works lol
// used to get the FileType of a string
// str = image/png or video/mp4
export const getFileType = (str: string) => {
    for (var type in SUPPORTED_FORMATS) {
        if (str.includes(type)) {
            return SUPPORTED_FORMATS[type];
        }
    }
    return FileType.Unknown;
};

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
            "File must be an image or video",
            (value: File | undefined) => {
                if (!value) return true;

                return getFileType(value.type) != FileType.Unknown;
            }
        ),
});

// this one is used on the backend
export const createS3Schema = object().shape({
    fileName: string().min(1).max(255).required(),
    fileType: string()
        .min(1)
        .test("FILE_TYPE", "File must be an image or video", (value) => {
            if (!value) return true;

            return getFileType(value) != FileType.Unknown;
        })
        .required(),
});
