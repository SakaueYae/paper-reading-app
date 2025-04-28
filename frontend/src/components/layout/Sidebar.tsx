import { Box, Heading, Text, VStack, BoxProps } from "@chakra-ui/react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/chakraui/button";
import { IoAddOutline } from "react-icons/io5";
import { FC } from "react";
import { ChatSession } from "../page/home/Home";

export type SidebarProps = {
  chats: ChatSession[];
  onChatClick: (id: string) => void;
  onStartNewChat: () => void;
};

export const Sidebar: FC<SidebarProps & BoxProps> = ({
  chats,
  onChatClick,
  onStartNewChat,
  ...props
}) => {
  return (
    <Box
      as="nav"
      h={"100%"}
      bg={"gray.100"}
      px={3}
      py={8}
      display={"flex"}
      flexDir={"column"}
      {...props}
    >
      <Logo type="sidebar" />
      <VStack gap={1} alignItems={"start"} mt={4} flex={1} overflow={"auto"}>
        {chats.map(({ id, created_at, title }) => (
          <Box
            borderRadius={"10px"}
            w={"100%"}
            p={2}
            cursor={"pointer"}
            _hover={{
              bgColor: "gray.200",
            }}
            onClick={() => onChatClick(id)}
          >
            <Heading as="h3" size="md">
              {created_at}
            </Heading>
            <Text>{title}</Text>
          </Box>
        ))}
      </VStack>
      <Button
        variant={"outline"}
        w={"100%"}
        size={"lg"}
        _hover={{
          bgColor: "gray.200",
        }}
        onClick={onStartNewChat}
      >
        <IoAddOutline />
        Start new Chat
      </Button>
    </Box>
  );
};
