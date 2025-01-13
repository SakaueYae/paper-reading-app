import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { InputGroup } from "../ui/chakraui/input-group";
import { Field } from "../ui/chakraui/field";
import { LuSearch } from "react-icons/lu";
import { IoSend } from "react-icons/io5";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "../ui/chakraui/file-upload";

type ChatContentProps = {
  onClick: (value: string) => void;
};

export const ChatContent = ({ onClick }: ChatContentProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (value?: string) => {
    if (value) {
      setIsError(false);
      if (ref.current) {
        ref.current.value = "";
      }
      onClick(value);
    } else {
      setIsError(true);
    }
  };

  return (
    <Box w={"4/5"} p={8}>
      <Box
        h={"100%"}
        display={"flex"}
        flexDir={"column"}
        gap={8}
        justifyContent={"space-between"}
      >
        <Box flex={1} overflow={"auto"}>
          <FileUploadRoot
            maxW="xl"
            alignItems="stretch"
            maxFiles={10}
            m={"auto"}
          >
            <FileUploadDropzone
              label="Drag and drop here to upload"
              description=".png, .jpg up to 5MB"
            />
            <FileUploadList />
          </FileUploadRoot>
        </Box>
        <Field invalid={isError} errorText={"テキストを入力してください。"}>
          <InputGroup
            startElement={<LuSearch />}
            endElement={
              <SendButton onClick={() => handleClick(ref.current?.value)} />
            }
            w={"100%"}
          >
            <Input placeholder="Search contacts" ref={ref} />
          </InputGroup>
        </Field>
      </Box>
    </Box>
  );
};

const SendButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button p={1} h={"fit-content"} onClick={onClick}>
      <IoSend />
    </Button>
  );
};
