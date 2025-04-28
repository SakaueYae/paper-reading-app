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

type ChatHeaderProps = {
  name: string;
  chats: ChatSession[];
  signOut: () => void;
  onStartNewChat: () => void;
  onChatClick: (id: string) => void;
};

const initialState = {
  isOpen: false,
  resolve: () => {},
};

export const ChatHeader = ({
  name,
  chats,
  signOut,
  onStartNewChat,
  onChatClick,
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
      <Drawer
        chats={chats}
        onChatClick={onChatClick}
        display={{ md: "none" }}
        onStartNewChat={onStartNewChat}
      />
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
