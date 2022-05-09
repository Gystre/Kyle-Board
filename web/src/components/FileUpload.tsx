import { Box, CloseButton, IconButton, Image, Spinner } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import { FormDecorator, FormDecoratorProps } from "./FormDecorator";

/*
    Component designed for formik which provides an input for file upload as well as a local image preview.
    Requires previewSrc and file state values as well as setFieldValue in the formik form to work.
*/

type FileUploadProps = {
    accept: string;
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => void;
    value_PreviewSrc: string | null; // comes from the values object in the formick form
} & FormDecoratorProps;

enum FileReaderReadyState {
    EMPTY,
    LOADING,
    DONE,
}

export const FileUpload: React.FC<FileUploadProps> = ({
    name,
    accept,
    setFieldValue,
    value_PreviewSrc,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [readyState, setReadyState] = useState<FileReaderReadyState>();

    return (
        <>
            <FormDecorator name={name}>
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

                        setFieldValue(name, files[0]);

                        // load a preview of the image
                        const reader = new FileReader();
                        reader.onloadstart = () =>
                            setReadyState(FileReaderReadyState.LOADING);
                        reader.onloadend = () =>
                            setReadyState(FileReaderReadyState.DONE);
                        reader.onload = function (e) {
                            imgRef.current?.setAttribute(
                                "src",
                                e.target?.result as string
                            );
                            setFieldValue("previewSrc", e.target?.result);
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
            </FormDecorator>

            {readyState == FileReaderReadyState.LOADING ? <Spinner /> : null}

            {value_PreviewSrc ? (
                <Box position="relative">
                    <Box position="absolute" left={0} zIndex={5}>
                        <CloseButton
                            backgroundColor="white"
                            margin={2}
                            onClick={() => {
                                setFieldValue("file", null);
                                setFieldValue("previewSrc", null);
                            }}
                        />
                    </Box>
                </Box>
            ) : null}
            <Image
                ref={(e) => (imgRef.current = e)}
                src={value_PreviewSrc ? value_PreviewSrc : ""}
                alt=""
            />
        </>
    );
};
