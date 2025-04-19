import { Avatar } from "@/components/ui/Avatar";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";
import { FileData } from "@/components/ui/PDFIcon";

type Message = {
  id: string;
  message?: string;
  file?: FileData;
};

export type MessageList = {
  sentMessage: Message;
  contents: Message[];
};

type ChatContentProps = {
  name: string;
  messages: MessageList[];
};

export const ChatContent = ({ name, messages }: ChatContentProps) => {
  return messages.map(({ sentMessage, contents }) => (
    <Box>
      <Flex justifyContent={"end"} gap={8}>
        <SpeechBubble message={sentMessage.message} file={sentMessage.file} />
        <Avatar name={name} />
      </Flex>
      <Flex justifyContent={"start"} gap={8}>
        <Avatar />
        <VStack alignItems={"start"}>
          {contents.map(({ id, message, file }, i) =>
            i === 0 ? (
              <SpeechBubble key={id} message={message} isLeft file={file} />
            ) : (
              message && <ChatBox message={message} />
            )
          )}
        </VStack>
      </Flex>
    </Box>
  ));
};
