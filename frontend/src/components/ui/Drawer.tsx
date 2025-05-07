import { Drawer as ChakraDrawer, Icon } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Portal } from "@chakra-ui/react";
import { Sidebar, SidebarProps } from "../layout/Sidebar";
import { FC } from "react";

export const Drawer: FC<SidebarProps> = ({
  currentSession,
  chats,
  onChatClick,
  onStartNewChat,
  onDeleteClick,
}) => {
  return (
    <ChakraDrawer.Root placement={"start"}>
      <ChakraDrawer.Trigger asChild>
        <Icon size={"xl"} visibility={{ md: "hidden" }}>
          <RxHamburgerMenu />
        </Icon>
      </ChakraDrawer.Trigger>
      <Portal>
        <ChakraDrawer.Backdrop />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content>
            <Sidebar
              currentSession={currentSession}
              chats={chats}
              onChatClick={onChatClick}
              onStartNewChat={onStartNewChat}
              onDeleteClick={onDeleteClick}
            />
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
};
