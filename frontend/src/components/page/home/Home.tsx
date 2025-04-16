import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";
import { Box } from "@chakra-ui/react";
import { Chat } from "@/components/layout/Chat/Chat";
import { useEffect } from "react";
import axios from "axios";
import { signOut } from "./models/signOut";
import { supabase } from "@/utils/supabase";

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
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;
    const refreshToken = session.data.session?.refresh_token;
    if (!accessToken || !refreshToken) {
      alert("ログインしていません");
      return;
    }

    const formData = new FormData();
    formData.append(file.name, file);
    const text = await axios.post("/api/pdf", formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
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
        signOut={signOut}
        isFirst
        flex={4}
      />
      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </Box>
  );
};
