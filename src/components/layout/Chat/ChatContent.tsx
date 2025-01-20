import { Avatar } from "@/components/ui/Avatar";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";

type Message = {
  id: string;
  message: string;
  file?: string;
};

type ChatContentProps = {
  name: string;
  sentMessage: Message;
  contents: Message[];
};

export const ChatContent = ({
  name,
  sentMessage,
  contents,
}: ChatContentProps) => {
  return (
    <Box>
      <Flex justifyContent={"end"} gap={8}>
        <SpeechBubble message={sentMessage.message} />
        <Avatar name={name} />
      </Flex>
      <Flex justifyContent={"start"} gap={8}>
        <Avatar />
        <VStack alignItems={"start"}>
          {contents.map(({ id, message }, i) =>
            i === 0 ? (
              <SpeechBubble key={id} message={message} isLeft />
            ) : (
              <ChatBox message={message} />
            )
          )}
        </VStack>
      </Flex>
    </Box>
  );
};
