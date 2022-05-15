import { Box, CloseButton, IconButton, Image, Spinner } from "@chakra-ui/react";
import { FileType, getFileType, INPUT_SUPPORTED_FORMATS } from "@kyle/common";
import { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import { FormDecorator, FormDecoratorProps } from "./FormDecorator";

/*
    Component designed for formik which provides an input for file upload as well as a local image preview.
    
    Using the formik form's values object to contain the state so requires 
    `previewSrc` and `file` state values as well as `setFieldValue` function in the formik form to work.

    THIS COMPONENT JUST GETS MORE AND MORE CLEAN WITH EVERY COMMIT YEAHHHHH
*/

type FileUploadProps = {
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
    setFieldValue,
    value_PreviewSrc,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileType, setFileType] = useState<FileType>(FileType.Unknown);
    const [readyState, setReadyState] = useState<FileReaderReadyState>();

    return (
        <>
            <FormDecorator name={name}>
                <input
                    type={"file"}
                    multiple={false}
                    hidden
                    accept={INPUT_SUPPORTED_FORMATS}
                    ref={(e) => (inputRef.current = e)}
                    onChange={(event) => {
                        const files = event.currentTarget.files as FileList;

                        if (!files[0]) {
                            return;
                        }

                        setFieldValue(name, files[0]);
                        const loadedFileType = getFileType(files[0].type);

                        // load a preview of the image
                        // can get rid of the reader by just doing `URL.createObjectURL(files[0])`
                        // but can't get access to a loading state so UX isn't very good
                        const reader = new FileReader();
                        reader.onloadstart = () =>
                            setReadyState(FileReaderReadyState.LOADING);
                        reader.onloadend = () =>
                            setReadyState(FileReaderReadyState.DONE);
                        reader.onload = function (e) {
                            setFileType(loadedFileType);
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
                <>
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
                    {fileType == FileType.Image ? (
                        <Image
                            src={
                                fileType == FileType.Image && value_PreviewSrc
                                    ? value_PreviewSrc
                                    : ""
                            }
                            alt=""
                        />
                    ) : null}
                    {fileType == FileType.Video ? (
                        <video
                            controls
                            src={
                                fileType == FileType.Video && value_PreviewSrc
                                    ? value_PreviewSrc
                                    : ""
                            }
                        />
                    ) : null}
                </>
            ) : null}
        </>
    );
};
