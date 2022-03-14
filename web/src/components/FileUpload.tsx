import {
    Box,
    CloseButton,
    FormControl,
    FormErrorMessage,
    IconButton,
} from "@chakra-ui/react";
import { MAX_FILE_SIZE_MB } from "@kyle/common";
import { useField } from "formik";
import { useRef, useState } from "react";
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
};

export const FileUpload: React.FC<FileUploadProps> = ({
    fieldName,
    accept,
    setFieldValue,
    setFieldError,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    // this is literally only used to check if we have an image loaded and to force update
    // won't contain the actual src lol
    const [src, setSrc] = useState<string>("");

    const handleClick = () => inputRef.current?.click();
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
                    }

                    setFieldValue(fieldName, files[0]);

                    // load a preview of the image
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imgRef.current?.setAttribute(
                            "src",
                            e.target?.result as any
                        );
                        setSrc("something");
                    };
                    reader.readAsDataURL(files[0]);
                }}
            />
            <Box>
                <IconButton
                    onClick={handleClick}
                    aria-label="upload image"
                    icon={<FiImage />}
                    backgroundColor="transparent"
                />
            </Box>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}

            {src != "" ? (
                <Box position="relative">
                    <Box position="absolute" left={0} zIndex={5}>
                        <CloseButton
                            backgroundColor="white"
                            variant="solid"
                            margin={2}
                            onClick={() => {
                                setFieldValue(fieldName, null);
                                imgRef.current?.setAttribute("src", "");
                                setSrc("");
                            }}
                        />
                    </Box>
                </Box>
            ) : null}
            <img ref={(e) => (imgRef.current = e)} id="preview-image" src="" />
        </FormControl>
    );
};
