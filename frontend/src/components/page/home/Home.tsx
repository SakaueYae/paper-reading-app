import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import { Chat } from "@/components/layout/Chat/Chat";
import { useEffect, useState } from "react";
import axios from "axios";
import { uploadFile } from "./models/uploadFile";
import { useAuthContext } from "@/components/context/AuthProvider";
import { getChatSessions } from "./models/getChatSessions";
import { getMessages } from "./models/getMessages";
import { Message } from "@/components/layout/Chat/ChatContent";
import { sendMessage } from "./models/sendMessage";
import { deleteSession } from "./models/deleteSession";

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const defaultValue: Message = {
  messagesHistory: [],
};

export const Home = () => {
  const [messages, setMessages] = useState<Message>(defaultValue);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleColorMode } = useColorMode();
  const { user, accessToken, refreshToken, signOut } = useAuthContext();

  const handleGetChatSessions = async () => {
    if (!(accessToken && refreshToken)) return;
    const sessions = await getChatSessions(accessToken, refreshToken);
    if (!sessions) return;
    setSessions(sessions ?? null);
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
      messagesHistory: [
        {
          id: `temp-${Date.now()}`,
          content: message,
          role: "user",
          created_at: new Date().toISOString(),
        },
      ],
    };

    setMessages((prev) => ({ ...prev, userMessage }));
    // scrollToBottom();
    setIsLoading(true);

    try {
      if (!(accessToken && refreshToken)) return;

      const sessionId = await sendMessage(
        userMessage.messagesHistory[0].content,
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
        messagesHistory: [
          {
            id: `error-${Date.now()}`,
            content: "メッセージの送信に失敗しました。もう一度お試しください。",
            role: "system",
            created_at: new Date().toISOString(),
          },
        ],
      };
      setMessages((prev) => ({ ...prev, errorMessage }));
    } finally {
      setIsLoading(false);
      // scrollToBottom();
    }
  };

  // 新しいセッションを作成
  const createNewSession = () => {
    setCurrentSession(null);
    setMessages(defaultValue);
  };

  const handleFileUpload = async (file: File) => {
    if (!(accessToken && refreshToken)) return;
    setIsLoading(true);
    const data = await uploadFile(file, accessToken, refreshToken);
    setIsLoading(false);
    if (typeof data === "string") return;
    setMessages((prev) => ({ ...prev, file: data.fileMessageList }));
    setCurrentSession(data.sessionId);
  };

  const handleDeleteSession = async (id: string) => {
    if (!(accessToken && refreshToken)) return;
    const res = await deleteSession(id, accessToken, refreshToken);
    if (!res) {
      // TODO:エラーハンドリング
      return;
    }
    if (currentSession === id) setCurrentSession(null);
    handleGetChatSessions();
  };

  // 初回ロード時にセッション一覧を取得
  useEffect(() => {
    (async () => {
      handleGetChatSessions();
    })();
  }, [user, accessToken]);

  useEffect(() => {
    (async () => {
      if (currentSession) {
        handleGetMessages(currentSession);
      } else {
        setMessages(defaultValue);
      }
    })();
  }, [currentSession]);

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
        currentSession={currentSession}
        chats={sessions}
        onChatClick={(id) => setCurrentSession(id)}
        flex={1}
        maxW={300}
        display={{ base: "none", md: "flex" }}
        onStartNewChat={createNewSession}
        onDeleteClick={handleDeleteSession}
      />
      <Box flex={4} h={"100%"}>
        <Chat
          isLoading={isLoading}
          onSubmit={handleSendMessage}
          onFileUpload={handleFileUpload}
          signOut={signOut}
          messages={messages}
          chats={sessions}
          onStartNewChat={createNewSession}
          onChatClick={(id) => setCurrentSession(id)}
        />
      </Box>

      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
