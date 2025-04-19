import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "./chakraui/file-upload";

type FileUploadProps = {
  onFileUpload: (file: File) => void;
};

export const FileUploadField = ({ onFileUpload }: FileUploadProps) => {
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
    </FileUploadRoot>
  );
};
