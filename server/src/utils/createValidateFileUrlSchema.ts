import { object, string } from "yup";

export const createValidateFileUrlSchema = object().shape({
    newFileName: string()
        .min(1)
        .required()
        .test("IMAGE_NAME", "Malformed image name", function (value) {
            // some super secure validation happening rn
            // i should probably structure the image workflow better to work around this :/
            return value?.startsWith("images/") as boolean;
        }),
});
