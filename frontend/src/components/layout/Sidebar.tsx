import { Box, VStack, BoxProps } from "@chakra-ui/react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/chakraui/button";
import { IoAddOutline } from "react-icons/io5";
import { FC, useState } from "react";
import { ChatSession } from "../page/home/Home";
import { ChatList } from "../ui/ChatList";
import { Modal } from "../ui/Modal";
import { useColorModeValue } from "../ui/chakraui/color-mode";

export type SidebarProps = {
  currentSession: string | null;
  chats: ChatSession[];
  onChatClick: (id: string) => void;
  onStartNewChat: () => void;
  onDeleteClick: (id: string) => void;
};

const initialState = {
  isOpen: false,
  resolve: () => {},
};

export const Sidebar: FC<SidebarProps & BoxProps> = ({
  currentSession,
  chats,
  onChatClick,
  onStartNewChat,
  onDeleteClick,
  ...props
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const hoverColor = useColorModeValue("gray.200", "gray.700");

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    resolve: (ok: boolean) => void;
  }>(initialState);
  const handleDeleteModal = async (id: string) => {
    const ok = await new Promise((resolve) => {
      setModalState({ isOpen: true, resolve });
    });
    if (ok) {
      onDeleteClick(id);
      setModalState(initialState);
    } else {
      setModalState(initialState);
    }
  };

  return (
    <Box
      as="nav"
      h={"100%"}
      bg={bgColor}
      px={3}
      py={8}
      display={"flex"}
      flexDir={"column"}
      {...props}
    >
      <Logo type="sidebar" />
      <VStack
        gap={1}
        alignItems={"start"}
        mt={4}
        mb={4}
        flex={1}
        overflow={"auto"}
      >
        {chats.map(({ id, created_at, title }) => (
          <ChatList
            key={id}
            isSelected={currentSession === id}
            created_at={created_at}
            title={title}
            onChatClick={() => onChatClick(id)}
            onDeleteClick={() => {
              handleDeleteModal(id);
            }}
          />
        ))}
      </VStack>
      <Button
        variant={"outline"}
        w={"100%"}
        size={"lg"}
        _hover={{
          bgColor: hoverColor,
        }}
        onClick={onStartNewChat}
      >
        <IoAddOutline />
        Start new Chat
      </Button>
      <Modal
        isOpen={modalState.isOpen}
        title="Delete Session"
        body="Are you sure to delete this session?"
        onButtonClick={modalState.resolve}
      />
    </Box>
  );
};
