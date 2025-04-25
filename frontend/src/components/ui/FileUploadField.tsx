import { Spinner, VStack, Text } from "@chakra-ui/react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "./chakraui/file-upload";

type FileUploadProps = {
  isLoading?: boolean;
  onFileUpload: (file: File) => void;
};

export const FileUploadField = ({
  isLoading = false,
  onFileUpload,
}: FileUploadProps) => {
  return (
    <FileUploadRoot
      maxW="xl"
      alignItems="stretch"
      maxFiles={1}
      m={"auto"}
      onFileAccept={(details) => onFileUpload(details.files[0])}
    >
      <FileUploadDropzone
        label="翻訳したいファイルをアップロードしてください"
        description=".pdf up to 5MB"
      />
      <FileUploadList />
      {isLoading && (
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      )}
    </FileUploadRoot>
  );
};
