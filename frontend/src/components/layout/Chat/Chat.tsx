import { Box, Button, Input, BoxProps } from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { InputGroup } from "../../ui/chakraui/input-group";
import { Field } from "../../ui/chakraui/field";
import { LuSearch } from "react-icons/lu";
import { IoSend } from "react-icons/io5";
import { ChatHeader } from "./ChatHeader";
import { ChatContent, MessageList } from "./ChatContent";
import { useAuthContext } from "@/components/context/AuthProvider";
import { FileUploadField } from "@/components/ui/FileUploadField";

type ChatProps = {
  isFirst?: boolean;
  messages: MessageList[];
  onClick: (value: string) => void;
  onFileUpload: (file: File) => void;
  signOut: () => void;
};

export const Chat: FC<ChatProps & BoxProps> = ({
  isFirst,
  messages,
  onClick,
  onFileUpload,
  signOut,
  ...props
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const user = useAuthContext();
  const email = user.user?.email ?? "";
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
        <ChatHeader name={email} signOut={signOut} />

        {isFirst ? (
          <Box
            flex={1}
            overflow={"auto"}
            display={"flex"}
            alignItems={"center"}
          >
            <FileUploadField onFileUpload={onFileUpload} />
          </Box>
        ) : (
          <>
            <Box flex={1} overflow={"auto"}>
              <ChatContent name={email} messages={messages} />
            </Box>
            <Field invalid={isError} errorText={"テキストを入力してください。"}>
              <InputGroup
                startElement={<LuSearch />}
                endElement={
                  <SendButton onClick={() => handleClick(ref.current?.value)} />
                }
                w={"100%"}
              >
                <Input
                  placeholder="Input something to ask or upload pdf file"
                  ref={ref}
                />
              </InputGroup>
            </Field>
          </>
        )}
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
