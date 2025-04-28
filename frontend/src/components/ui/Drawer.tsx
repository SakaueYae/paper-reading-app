import {
  Drawer as ChakraDrawer,
  Icon,
  DrawerRootProps,
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Portal } from "@chakra-ui/react";
import { Sidebar, SidebarProps } from "../layout/Sidebar";
import { FC } from "react";

export const Drawer: FC<SidebarProps & DrawerRootProps> = ({
  chats,
  onChatClick,
  onStartNewChat,
  ...props
}) => {
  return (
    <ChakraDrawer.Root placement={"start"} {...props}>
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
              chats={chats}
              onChatClick={onChatClick}
              onStartNewChat={onStartNewChat}
            />
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
};
