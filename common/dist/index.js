"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createS3Schema = exports.createPostSchema = exports.getFileType = exports.INPUT_SUPPORTED_FORMATS = exports.MAX_FILE_SIZE_MB = exports.createLoginSchema = exports.createRegisterSchema = exports.SocketCmds = exports.PermissionLevel = exports.FileType = void 0;
var yup_1 = require("yup");
/*
    used in Post table: determines the type of file that is attached with
    maybe add Mixed file type or smthn later for posts with multiple videos and images
*/
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["Image"] = 1] = "Image";
    FileType[FileType["Video"] = 2] = "Video";
})(FileType = exports.FileType || (exports.FileType = {}));
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel[PermissionLevel["User"] = 0] = "User";
    PermissionLevel[PermissionLevel["Admin"] = 1] = "Admin";
})(PermissionLevel = exports.PermissionLevel || (exports.PermissionLevel = {}));
var SocketCmds;
(function (SocketCmds) {
    SocketCmds["SendMessage"] = "SendMessage";
    SocketCmds["DeleteMessage"] = "DeleteMessage";
})(SocketCmds = exports.SocketCmds || (exports.SocketCmds = {}));
exports.createRegisterSchema = (0, yup_1.object)().shape({
    email: (0, yup_1.string)().email().max(255).required(),
    username: (0, yup_1.string)()
        .matches(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/, "Can't use special characters or spaces") // https://stackoverflow.com/questions/1221985/how-to-validate-a-user-name-with-regex#37658211
        .min(3, "Too short!")
        .max(30, "Too long!")
        .required(),
    password: (0, yup_1.string)().min(3).max(255).required(),
    captchaToken: (0, yup_1.string)().required("Captcha is not complete!"),
});
exports.createLoginSchema = (0, yup_1.object)().shape({
    usernameOrEmail: (0, yup_1.string)()
        .min(3, "Too short!")
        .max(255, "Too long!")
        .required(),
    password: (0, yup_1.string)().min(3).max(255).required(),
});
exports.MAX_FILE_SIZE_MB = 15;
var SUPPORTED_FORMATS = {
    image: FileType.Image,
    video: FileType.Video,
};
// for the html input tag on frontend
exports.INPUT_SUPPORTED_FORMATS = "image/*, video/*";
// this is probably the most pointless piece code in the entire codebase but wutever it works lol
// used to get the FileType of a string
// str = image/png or video/mp4
var getFileType = function (str) {
    for (var type in SUPPORTED_FORMATS) {
        if (str.includes(type)) {
            return SUPPORTED_FORMATS[type];
        }
    }
    return FileType.Unknown;
};
exports.getFileType = getFileType;
exports.createPostSchema = (0, yup_1.object)().shape({
    text: (0, yup_1.string)().min(1, "Too short!").max(300, "Too long!").required(),
    // only used on frontend :/
    file: (0, yup_1.mixed)()
        .nullable()
        .test("FILE_SIZE", "File can't be bigger than ".concat(exports.MAX_FILE_SIZE_MB, "mb"), function (value) {
        return !value || (value && value.size < exports.MAX_FILE_SIZE_MB * 1000000);
    })
        .test("FILE_TYPE", "File must be an image or video", function (value) {
        if (!value)
            return true;
        return (0, exports.getFileType)(value.type) != FileType.Unknown;
    }),
});
// this one is used on the backend
exports.createS3Schema = (0, yup_1.object)().shape({
    fileName: (0, yup_1.string)().min(1).max(255).required(),
    fileType: (0, yup_1.string)()
        .min(1)
        .test("FILE_TYPE", "File must be an image or video", function (value) {
        if (!value)
            return true;
        return (0, exports.getFileType)(value) != FileType.Unknown;
    })
        .required(),
});
//# sourceMappingURL=index.js.map