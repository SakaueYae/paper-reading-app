import { Avatar } from "@/components/ui/Avatar";
import { Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";
import { FileChatContent, FileMessageList } from "./FileChatContent";

export interface Message {
  messagesHistory: MessageData[];
  file?: FileMessageList;
}

interface MessageData {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  created_at: string;
}

type ChatContentProps = {
  name: string;
  messages: Message;
};

export const ChatContent = ({ name, messages }: ChatContentProps) => {
  return (
    <VStack gap={4}>
      {messages.file && (
        <FileChatContent name={name} messages={messages.file} />
      )}
      {messages.messagesHistory.map(({ id, content, role }, i) => (
        <>
          {role === "user" ? (
            <Flex justifyContent={"end"} gap={8} w={"100%"}>
              <SpeechBubble message={content} />
              <Avatar name={name} />
            </Flex>
          ) : role === "assistant" ? (
            <Flex justifyContent={"start"} gap={8} w={"100%"}>
              <Avatar />
              <VStack alignItems={"start"}>
                {/* 連続してAIのチャットが続いているかどうかの判定 */}
                {messages.messagesHistory[i - 1].role !== "assistant" ? (
                  <SpeechBubble key={id} message={content} isLeft />
                ) : (
                  <ChatBox message={content} />
                )}
              </VStack>
            </Flex>
          ) : (
            <div></div>
          )}
        </>
      ))}
    </VStack>
  );
};
