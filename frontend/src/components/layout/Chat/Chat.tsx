import { Box, Button, Input, BoxProps } from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { InputGroup } from "../../ui/chakraui/input-group";
import { Field } from "../../ui/chakraui/field";
import { LuSearch } from "react-icons/lu";
import { IoSend } from "react-icons/io5";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "../../ui/chakraui/file-upload";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { useAuthContext } from "@/components/context/AuthProvider";

type ChatProps = {
  isFirst?: boolean;
  onClick: (value: string) => void;
  onFileUpload: (file: File) => void;
  signOut: () => void;
};

export const Chat: FC<ChatProps & BoxProps> = ({
  isFirst,
  onClick,
  onFileUpload,
  signOut,
  ...props
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const user = useAuthContext();
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
    <Box p={8} {...props}>
      <Box
        h={"100%"}
        display={"flex"}
        flexDir={"column"}
        gap={8}
        justifyContent={"space-between"}
      >
        <ChatHeader name={user.user?.email ?? ""} signOut={signOut} />

        {isFirst ? (
          <Box
            flex={1}
            overflow={"auto"}
            display={"flex"}
            alignItems={"center"}
          >
            <FileUploadRoot
              maxW="xl"
              alignItems="stretch"
              maxFiles={10}
              m={"auto"}
              onFileAccept={(details) => onFileUpload(details.files[0])}
            >
              <FileUploadDropzone
                label="Drag and drop here to upload"
                description=".png, .jpg up to 5MB"
              />
              <FileUploadList />
            </FileUploadRoot>
          </Box>
        ) : (
          <Box flex={1} overflow={"auto"}>
            <ChatContent
              name="Sage Adebayo"
              sentMessage={{
                id: "about hiragana",
                message: "aiueo",
              }}
              contents={[
                {
                  id: "about hiragana",
                  message: "aiueo",
                },
                {
                  id: "about hiragana",
                  message: "kakikukeko",
                },
              ]}
            />
          </Box>
        )}

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
