import { FileUpload } from "@chakra-ui/react";
import { Button } from "./chakraui/button";
import { HiUpload } from "react-icons/hi";

type FileUploadButtonPropr = {
  onFileUpload: (file: File) => void;
};

export const FileUploadButton = ({ onFileUpload }: FileUploadButtonPropr) => {
  return (
    <FileUpload.Root
      accept={["application/pdf"]}
      onFileAccept={(details) => onFileUpload(details.files[0])}
    >
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
    </FileUpload.Root>
  );
};
