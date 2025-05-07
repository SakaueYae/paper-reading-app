import { ColorModeButton } from "@/components/ui/chakraui/color-mode";
import { Box, HStack } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/chakraui/menu";
import { Avatar } from "@/components/ui/Avatar";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { ChatSession } from "@/components/page/home/Home";
import { SidebarProps } from "../Sidebar";

interface ChatHeaderProps extends SidebarProps {
  name: string;
  chats: ChatSession[];
  signOut: () => void;
  onStartNewChat: () => void;
  onChatClick: (id: string) => void;
}

const initialState = {
  isOpen: false,
  resolve: () => {},
};

export const ChatHeader = ({
  name,
  chats,
  currentSession,
  signOut,
  onStartNewChat,
  onChatClick,
  onDeleteClick,
}: ChatHeaderProps) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    resolve: (isConfirmed: boolean) => void;
  }>(initialState);

  const handleSignOut = async () => {
    const ok = await new Promise((resolve) => {
      setModalState({ isOpen: true, resolve });
    });
    console.log(ok);
    if (ok) {
      await signOut();
      setModalState(initialState);
    } else {
      setModalState(initialState);
    }
  };

  return (
    <HStack justifyContent={"space-between"}>
      <Box visibility={{ md: "hidden" }}>
        <Drawer
          currentSession={currentSession}
          chats={chats}
          onChatClick={onChatClick}
          onStartNewChat={onStartNewChat}
          onDeleteClick={onDeleteClick}
        />
      </Box>

      <HStack justifyContent={"end"}>
        <Box>
          <MenuRoot
            positioning={{
              placement: "bottom",
            }}
          >
            <MenuTrigger asChild>
              <div>
                <Avatar name={name} />
              </div>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="mypage">Mypage</MenuItem>
              <MenuItem value="logout" onClick={handleSignOut}>
                Sign Out
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>
        <ColorModeButton />
      </HStack>
      <Modal
        isOpen={modalState.isOpen}
        onButtonClick={modalState.resolve}
        title="Sign Out"
        body="Are you sure you want to sign out?"
      />
    </HStack>
  );
};
