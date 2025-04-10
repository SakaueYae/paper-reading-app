import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import { Chat } from "@/components/layout/Chat/Chat";
import { useEffect } from "react";
import axios from "axios";
import { Drawer } from "@/components/ui/Drawer";

export const Home = () => {
  const { toggleColorMode } = useColorMode();
  const mockArray = [
    {
      id: "1",
      date: "2024-12-20",
      title: "研究",
    },
  ];

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append(file.name, file);
    const text = await axios.post("/api/pdf", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    console.log(text.data);
  };

  useEffect(() => {
    (async () => {
      const data = await axios.get("/api/data", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log(data);
    })();
  }, []);

  return (
    <Box display={"flex"} h={"100%"} color={"gray.600"}>
      <Sidebar
        chats={mockArray}
        onChatClick={(id) => console.log(id)}
        flex={1}
        maxW={300}
        display={{ base: "none", md: "flex" }}
      />
      <Chat
        onClick={(value) => console.log(value)}
        onFileUpload={uploadFile}
        isFirst
        flex={4}
      />
      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
