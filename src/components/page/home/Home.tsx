import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import { ChatContent } from "@/components/layout/ChatContent/ChatContent";

export const Home = () => {
  const { toggleColorMode } = useColorMode();
  const mockArray = [
    {
      id: "1",
      date: "2024-12-20",
      title: "研究",
    },
  ];

  return (
    <Box display={"flex"} h={"100%"}>
      <Sidebar chats={mockArray} onClick={(id) => console.log(id)} />
      <ChatContent onClick={(value) => console.log(value)} />
      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
