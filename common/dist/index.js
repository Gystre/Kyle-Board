"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createS3Schema = exports.createPostSchema = exports.MAX_FILE_SIZE_MB = exports.createLoginSchema = exports.createRegisterSchema = exports.SocketCmds = exports.PermissionLevel = void 0;
var yup_1 = require("yup");
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
    captchaToken: (0, yup_1.string)().test("length", "Captcha is not complete!", function (value) {
        return (value === null || value === void 0 ? void 0 : value.length) > 0;
    }),
});
exports.createLoginSchema = (0, yup_1.object)().shape({
    usernameOrEmail: (0, yup_1.string)()
        .min(3, "Too short!")
        .max(255, "Too long!")
        .required(),
    password: (0, yup_1.string)().min(3).max(255).required(),
});
exports.MAX_FILE_SIZE_MB = 10;
var SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
exports.createPostSchema = (0, yup_1.object)().shape({
    text: (0, yup_1.string)().min(1, "Too short!").max(300, "Too long!").required(),
    // only used on frontend :/
    file: (0, yup_1.mixed)()
        .nullable()
        .test("FILE_SIZE", "File can't be bigger than ".concat(exports.MAX_FILE_SIZE_MB, "mb"), function (value) {
        return !value || (value && value.size < exports.MAX_FILE_SIZE_MB * 1000000);
    })
        .test("FILE_TYPE", "File must be a jpg, jpeg, png, or gif", function (value) {
        return !value || (value && SUPPORTED_FORMATS.includes(value === null || value === void 0 ? void 0 : value.type));
    }),
});
exports.createS3Schema = (0, yup_1.object)().shape({
    fileName: (0, yup_1.string)().min(1).max(255).required(),
    fileType: (0, yup_1.string)()
        .min(1)
        .test("FILE_TYPE", "File must be a jpg, jpeg, png, or gif", function (value) { return SUPPORTED_FORMATS.includes(value || ""); } // how can string possibly ever be undefined here???
    )
        .required(),
});
//# sourceMappingURL=index.js.map