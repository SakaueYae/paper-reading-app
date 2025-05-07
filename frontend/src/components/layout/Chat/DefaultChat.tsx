import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { ChatHeader } from "./ChatHeader";
import { useAuthContext } from "@/components/context/AuthProvider";
import { FileUploadField } from "@/components/ui/FileUploadField";
import { SidebarProps } from "../Sidebar";

interface DefaultChatProps extends SidebarProps {
  isLoading: boolean;
  onFileUpload: (file: File) => void;
  signOut: () => void;
}

export const DefaultChat: FC<DefaultChatProps> = ({
  isLoading,
  chats,
  currentSession,
  onFileUpload,
  signOut,
  onStartNewChat,
  onChatClick,
  onDeleteClick,
}) => {
  const user = useAuthContext();
  const email = user.user?.email ?? "";

  return (
    <Box p={8} h={"100%"}>
      <Box
        h={"100%"}
        display={"flex"}
        flexDir={"column"}
        gap={8}
        justifyContent={"space-between"}
      >
        <ChatHeader
          name={email}
          chats={chats}
          currentSession={currentSession}
          signOut={signOut}
          onStartNewChat={onStartNewChat}
          onChatClick={onChatClick}
          onDeleteClick={onDeleteClick}
        />
        <Box flex={1} overflow={"auto"} display={"flex"} alignItems={"center"}>
          <FileUploadField isLoading={isLoading} onFileUpload={onFileUpload} />
        </Box>
      </Box>
    </Box>
  );
};
