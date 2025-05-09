import { Avatar } from "@/components/ui/Avatar";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { FileData } from "@/components/ui/PDFIcon";

export type FileNameList = {
  uploadedFile: FileData;
  translatedFile: FileData;
};

type ChatContentProps = {
  name: string;
  messages: FileNameList;
};

export const FileChatContent = ({ name, messages }: ChatContentProps) => {
  return (
    <Box mb={8} w={"100%"}>
      <Flex justifyContent={"end"} gap={8}>
        <SpeechBubble file={messages.uploadedFile} />
        <Avatar name={name} />
      </Flex>
      <Flex justifyContent={"start"} gap={8}>
        <Avatar />
        <VStack alignItems={"start"}>
          <SpeechBubble isLeft file={messages.translatedFile} />
        </VStack>
      </Flex>
    </Box>
  );
};
