import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import { Chat } from "@/components/layout/Chat/Chat";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { uploadFile } from "./models/uploadFile";
import { useAuthContext } from "@/components/context/AuthProvider";
import { getChatSessions } from "./models/getChatSessions";
import { getMessages } from "./models/getMessages";
import { FileMessageList } from "@/components/layout/Chat/FileChatContent";
import { Message } from "@/components/layout/Chat/ChatContent";
import { sendMessage } from "./models/sentMessage";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const Home = () => {
  const [fileMessageList, setFileMessageList] = useState<FileMessageList>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleColorMode } = useColorMode();
  const mockArray = [
    {
      id: "1",
      date: "2024-12-20",
      title: "研究",
    },
  ];
  const { user, accessToken, refreshToken, signOut } = useAuthContext();

  const handleGetChatSessions = async () => {
    if (!(accessToken && refreshToken)) return;
    const sessions = await getChatSessions(accessToken, refreshToken);
    setSessions(sessions ?? null);
    // 初回ロード時に最新のセッションがあれば選択
    if (sessions.length > 0 && !currentSession) {
      setCurrentSession(sessions[0].id);
      handleGetMessages(sessions[0].id);
    }
  };

  const handleGetMessages = async (id: string) => {
    if (!(accessToken && refreshToken)) return;
    const data = await getMessages(id, accessToken, refreshToken);
    if (typeof data === "string") return;
    setMessages(data);
    // setTimeout(() => {
    //   scrollToBottom();
    // }, 100);
  };

  const handleSendMessage = async (message: string) => {
    // ユーザーメッセージをUIに追加
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: message,
      role: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    // scrollToBottom();
    setIsLoading(true);

    try {
      if (!(accessToken && refreshToken)) return;

      const sessionId = await sendMessage(
        userMessage.content,
        currentSession,
        accessToken,
        refreshToken
      );

      if (sessionId) {
        // 新しいセッションの場合、セッションIDを更新
        if (!currentSession) {
          setCurrentSession(sessionId);
          handleGetChatSessions(); // セッション一覧を更新
        }

        console.log(sessionId);

        // サーバーから最新のメッセージを取得
        handleGetMessages(sessionId);
      }
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
      // エラーメッセージを表示
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "メッセージの送信に失敗しました。もう一度お試しください。",
        role: "system",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // scrollToBottom();
    }
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
    setFileMessageList(data);
  };

  // 初回ロード時にセッション一覧を取得
  useEffect(() => {
    (async () => {
      handleGetChatSessions();
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
      <Box flex={4} h={"100%"}>
        <Chat
          onSubmit={handleSendMessage}
          onFileUpload={handleFileUpload}
          signOut={signOut}
          fileMessageList={fileMessageList}
          messages={messages}
        />
      </Box>

      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
