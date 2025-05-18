// import { useColorMode } from "@/components/ui/chakraui/color-mode";
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
import { useNavigate, useParams } from "react-router";
import { DefaultChat } from "@/components/layout/Chat/DefaultChat";

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
  const [isLoading, setIsLoading] = useState(false);
  // const { toggleColorMode } = useColorMode();
  const { user, accessToken, refreshToken, signOut } = useAuthContext();
  const { session_id } = useParams();
  const navigate = useNavigate();

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
        session_id ?? null,
        accessToken,
        refreshToken
      );

      if (sessionId) {
        // 新しいセッションの場合、セッションIDを更新
        if (!session_id) {
          navigate(`/${sessionId}`);
          // handleGetChatSessions(); // セッション一覧を更新
        }

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
    navigate("/");
    // setMessages(defaultValue);
  };

  const handleFileUpload = async (file: File) => {
    if (!(accessToken && refreshToken)) return;
    setIsLoading(true);
    const data = await uploadFile(file, accessToken, refreshToken);
    setIsLoading(false);
    if (typeof data === "string") return;
    navigate(`/${data.sessionId}`);
  };

  const handleDeleteSession = async (id: string) => {
    if (!(accessToken && refreshToken)) return;
    const res = await deleteSession(id, accessToken, refreshToken);
    if (!res) {
      // TODO:エラーハンドリング
      return;
    }
    if (session_id === id) navigate("/");
    handleGetChatSessions();
  };

  // 初回ロード時にセッション一覧を取得
  useEffect(() => {
    (async () => {
      handleGetChatSessions();
      if (session_id) handleGetMessages(session_id);
    })();
  }, [session_id, user, accessToken]);

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
        currentSession={session_id ?? null}
        chats={sessions}
        onChatClick={(id) => navigate(`/${id}`)}
        flex={1}
        maxW={300}
        hideBelow={"md"}
        display={"flex"}
        onStartNewChat={createNewSession}
        onDeleteClick={handleDeleteSession}
      />
      <Box flex={4} h={"100%"}>
        {session_id ? (
          <Chat
            onSubmit={handleSendMessage}
            signOut={signOut}
            messages={messages}
            chats={sessions}
            currentSession={session_id ?? null}
            onStartNewChat={createNewSession}
            onChatClick={(id) => navigate(`/${id}`)}
            onDeleteClick={handleDeleteSession}
          />
        ) : (
          <DefaultChat
            isLoading={isLoading}
            onFileUpload={handleFileUpload}
            chats={sessions}
            currentSession={session_id ?? null}
            onStartNewChat={createNewSession}
            onChatClick={(id) => navigate(`/${id}`)}
            signOut={signOut}
            onDeleteClick={handleDeleteSession}
          />
        )}
      </Box>

      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
