import {
    Box,
    CloseButton,
    FormControl,
    FormErrorMessage,
    IconButton,
} from "@chakra-ui/react";
import { MAX_FILE_SIZE_MB } from "@kyle/common";
import { useField } from "formik";
import { Dispatch, SetStateAction, useRef } from "react";
import { FiImage } from "react-icons/fi";

type FileUploadProps = {
    fieldName: string;
    accept?: string;
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => void;
    setFieldError: (field: string, message: string | undefined) => void;
    previewSrc: any | null;
    setPreviewSrc: Dispatch<SetStateAction<any | null>>;
};

export const FileUpload: React.FC<FileUploadProps> = ({
    fieldName,
    accept,
    setFieldValue,
    setFieldError,
    previewSrc,
    setPreviewSrc,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [field, { error }] = useField(fieldName);

    return (
        <FormControl isInvalid={!!error}>
            <input
                type={"file"}
                multiple={false}
                hidden
                accept={accept}
                ref={(e) => (inputRef.current = e)}
                onChange={(event) => {
                    const files = event.currentTarget.files as FileList;

                    if (!files[0]) {
                        return;
                    }

                    if (files[0].size > MAX_FILE_SIZE_MB * 1000000) {
                        setFieldError(
                            fieldName,
                            `File can't be bigger than ${MAX_FILE_SIZE_MB}mb`
                        );
                        return;
                    }

                    setFieldValue(fieldName, files[0]);

                    // load a preview of the image
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imgRef.current?.setAttribute(
                            "src",
                            e.target?.result as string
                        );
                        setPreviewSrc(e.target?.result);
                    };
                    reader.readAsDataURL(files[0]);
                }}
            />
            <Box>
                <IconButton
                    onClick={() => {
                        inputRef.current?.click();
                    }}
                    aria-label="upload image"
                    icon={<FiImage />}
                    backgroundColor="transparent"
                />
            </Box>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}

            {previewSrc ? (
                <Box position="relative">
                    <Box position="absolute" left={0} zIndex={5}>
                        <CloseButton
                            backgroundColor="white"
                            margin={2}
                            onClick={() => {
                                setFieldValue(fieldName, null);
                                setPreviewSrc(null);
                            }}
                        />
                    </Box>
                </Box>
            ) : null}
            <img
                ref={(e) => (imgRef.current = e)}
                id="preview-image"
                src={previewSrc ? previewSrc : ""}
            />
        </FormControl>
    );
};
