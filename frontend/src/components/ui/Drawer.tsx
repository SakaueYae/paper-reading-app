import { Drawer as ChakraDrawer, Icon, BoxProps } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Portal } from "@chakra-ui/react";
import { Sidebar, SidebarProps } from "../layout/Sidebar";
import { FC } from "react";

export const Drawer: FC<SidebarProps & BoxProps> = (
  { chats, onChatClick },
  props
) => {
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
            <Sidebar chats={chats} onChatClick={onChatClick} />
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
};
