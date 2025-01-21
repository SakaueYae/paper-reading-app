import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/chakraui/button";
import { IoAddOutline } from "react-icons/io5";

type ChatHistory = {
  id: string;
  date: string;
  title: string;
};

type SidebarProps = {
  chats: ChatHistory[];
  onClick: (id: string) => void;
};

export const Sidebar = ({ chats, onClick }: SidebarProps) => {
  return (
    <Box
      as="nav"
      h={"100%"}
      w={"1/5"}
      bg={"gray.100"}
      px={3}
      py={8}
      display={"flex"}
      flexDir={"column"}
    >
      <Logo />
      <VStack gap={1} alignItems={"start"} mt={4} flex={1}>
        {chats.map(({ id, date, title }) => (
          <Box
            borderRadius={"10px"}
            w={"100%"}
            p={2}
            cursor={"pointer"}
            _hover={{
              bgColor: "gray.200",
            }}
            onClick={() => onClick(id)}
          >
            <Heading as="h3" size="md">
              {date}
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
      >
        <IoAddOutline />
        Start new Chat
      </Button>
    </Box>
  );
};
