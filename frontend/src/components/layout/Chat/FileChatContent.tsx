import { Avatar } from "@/components/ui/Avatar";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";
import { FileData } from "@/components/ui/PDFIcon";

export type FileNameList = {
  uploadedFile: FileData;
  translatedFile: FileData;
};

type ChatContentProps = {
  name: string;
  messages: FileNameList;
};

const fileUploadText =
  "上記のアイコンをクリックすると、翻訳ファイルをダウンロードできます。（有効期限5分）\n続けてファイル内容についての質問があればテキストボックスに入力して送信してください。";

export const FileChatContent = ({ name, messages }: ChatContentProps) => {
  return (
    <Box mb={8}>
      <Flex justifyContent={"end"} gap={8}>
        <SpeechBubble file={messages.uploadedFile} />
        <Avatar name={name} />
      </Flex>
      <Flex justifyContent={"start"} gap={8}>
        <Avatar />
        <VStack alignItems={"start"}>
          <SpeechBubble isLeft file={messages.translatedFile} />
          <ChatBox message={fileUploadText} />
        </VStack>
      </Flex>
    </Box>
  );
};
