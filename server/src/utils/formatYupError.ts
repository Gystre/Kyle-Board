import { FieldError } from "./Response";

export const formatYupError = (err: any) => {
    console.log(err);

    const errors: FieldError[] = [];
    err.inner.forEach((e: any) => {
        errors.push({
            field: e.path,
            message: e.message,
        });
    });

    return { errors };
};
