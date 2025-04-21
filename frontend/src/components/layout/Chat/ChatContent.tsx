import { Avatar } from "@/components/ui/Avatar";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  created_at: string;
}

type ChatContentProps = {
  name: string;
  messages: Message[];
};

export const ChatContent = ({ name, messages }: ChatContentProps) => {
  return messages.map(({ id, content, role }, i) => (
    <Box>
      {role === "user" ? (
        <Flex justifyContent={"end"} gap={8}>
          <SpeechBubble message={content} />
          <Avatar name={name} />
        </Flex>
      ) : role === "assistant" ? (
        <Flex justifyContent={"start"} gap={8}>
          <Avatar />
          <VStack alignItems={"start"}>
            {messages[i - 1].role !== "assistant" ? (
              <SpeechBubble key={id} message={content} isLeft />
            ) : (
              <ChatBox message={content} />
            )}
          </VStack>
        </Flex>
      ) : (
        <div></div>
      )}
    </Box>
  ));
};
