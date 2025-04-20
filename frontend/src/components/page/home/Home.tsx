import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import { Chat } from "@/components/layout/Chat/Chat";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageList } from "@/components/layout/Chat/ChatContent";
import { uploadFile } from "./models/uploadFile";
import { useAuthContext } from "@/components/context/AuthProvider";
import { getChatSessions } from "./models/getChatSessions";
import { getMessages } from "./models/getMessages";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const Home = () => {
  const defaultMessages: MessageList = {
    sentMessage: {
      id: "null",
    },
    contents: [
      {
        id: "null",
      },
    ],
  };
  const [messages, setMessages] = useState<MessageList[]>([defaultMessages]);
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleColorMode } = useColorMode();
  const mockArray = [
    {
      id: "1",
      date: "2024-12-20",
      title: "研究",
    },
  ];
  const { user, accessToken, refreshToken, signOut } = useAuthContext();

  const handleGetMessages = async (id: string) => {
    if (!(accessToken && refreshToken)) return;
    const data = await getMessages(id, accessToken, refreshToken);
    if (!data) return;
    setMessages(data);
    // setTimeout(() => {
    //   scrollToBottom();
    // }, 100);
  };

  // 新しいセッションを作成
  const createNewSession = () => {
    setCurrentSession(null);
    setMessages([]);
  };

  const handleFileUpload = async (file: File) => {
    if (!(accessToken && refreshToken)) return;
    const data = await uploadFile(file, accessToken, refreshToken);
    if (typeof data === "string") return;
    setMessages([data]);
  };

  // 初回ロード時にセッション一覧を取得
  useEffect(() => {
    (async () => {
      if (user && accessToken && refreshToken) {
        const sessions = await getChatSessions(accessToken, refreshToken);
        setSessions(sessions ?? null);
        console.log(sessions);
        // 初回ロード時に最新のセッションがあれば選択
        if (sessions.length > 0 && !currentSession) {
          setCurrentSession(sessions[0].id);
          handleGetMessages(sessions[0].id);
        }
      }
    })();
  }, [user, accessToken]);

  useEffect(() => {
    (async () => {
      const data = await axios.get("/api/data", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log(data);
    })();
  }, []);

  return (
    <Box display={"flex"} h={"100%"} color={"gray.600"}>
      <Sidebar
        chats={mockArray}
        onChatClick={(id) => console.log(id)}
        flex={1}
        maxW={300}
        display={{ base: "none", md: "flex" }}
      />
      <Chat
        onClick={(value) => console.log(value)}
        onFileUpload={handleFileUpload}
        signOut={signOut}
        isFirst={messages[0].sentMessage.id === "null"}
        flex={4}
        messages={messages}
      />
      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
