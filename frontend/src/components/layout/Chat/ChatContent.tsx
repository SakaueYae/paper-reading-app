import { Avatar } from "@/components/ui/Avatar";
import { Flex, VStack } from "@chakra-ui/react";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { ChatBox } from "@/components/ui/ChatBox";
import { FileChatContent, FileNameList } from "./FileChatContent";

export interface Message {
  messagesHistory: MessageData[];
  file?: FileNameList;
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
    // チャット間のスペーシング
    <VStack gap={4}>
      {messages.file && (
        <FileChatContent name={name} messages={messages.file} />
      )}
      {messages.messagesHistory.map(({ id, content, role }, i) => (
        <>
          {role === "user" && (
            <Flex justifyContent={"end"} gap={8} w={"100%"}>
              <SpeechBubble message={content} />
              <Avatar name={name} />
            </Flex>
          )}
          {role === "assistant" && (
            <Flex justifyContent={"start"} gap={8} w={"100%"}>
              {/* 連続してAIのチャットが続いているかどうかの判定 */}
              {i !== 0 &&
              messages.messagesHistory[i - 1].role !== "assistant" ? (
                <>
                  <Avatar />
                  <SpeechBubble key={id} message={content} isLeft />
                </>
              ) : (
                <>
                  <Avatar visibility="hidden" />
                  <ChatBox message={content} />
                </>
              )}
            </Flex>
          )}
        </>
      ))}
    </VStack>
  );
};
