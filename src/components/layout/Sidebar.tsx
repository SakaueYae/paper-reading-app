import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Logo } from "../ui/Logo";

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
      position="fixed"
      left={0}
      h={"100%"}
      w={"1/5"}
      bg={"gray.100"}
      px={3}
    >
      <Logo />
      <VStack gap={1} alignItems={"start"} mt={4}>
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
    </Box>
  );
};
