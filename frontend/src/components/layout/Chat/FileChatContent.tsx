import { Avatar } from "@/components/ui/Avatar";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";
import { FileData } from "@/components/ui/PDFIcon";

type FileMessage = {
  id: string;
  file: FileData;
};

export type FileMessageList = {
  sentMessage: FileMessage;
  contents: FileMessage;
};

type ChatContentProps = {
  name: string;
  messages: FileMessageList;
};

const fileUploadText =
  "上記のアイコンをクリックすると、翻訳ファイルをダウンロードできます。（有効期限5分）\n続けてファイル内容についての質問があればテキストボックスに入力して送信してください。";

export const FileChatContent = ({ name, messages }: ChatContentProps) => {
  return (
    <Box>
      <Flex justifyContent={"end"} gap={8}>
        <SpeechBubble file={messages.sentMessage.file} />
        <Avatar name={name} />
      </Flex>
      <Flex justifyContent={"start"} gap={8}>
        <Avatar />
        <VStack alignItems={"start"}>
          <SpeechBubble isLeft file={messages.contents.file} />
          <ChatBox message={fileUploadText} />
        </VStack>
      </Flex>
    </Box>
  );
};
