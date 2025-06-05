import { Box, Heading, IconButton, Text, HStack } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useColorModeValue } from "./chakraui/color-mode";

interface ChatListProps {
  isSelected?: boolean;
  created_at: string;
  title: string;
  onChatClick: () => void;
  onDeleteClick: () => void;
}

export const ChatList = ({
  isSelected = false,
  created_at,
  title,
  onChatClick,
  onDeleteClick,
}: ChatListProps) => {
  const hoverColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      borderRadius={"10px"}
      w={"100%"}
      p={2}
      cursor={"pointer"}
      _hover={{
        bgColor: hoverColor,
      }}
      bgColor={isSelected ? hoverColor : "inherit"}
      onClick={onChatClick}
      position={"relative"}
      className="group"
    >
      <HStack justifyContent={"space-between"}>
        <Heading as="h3" size="md">
          {created_at}
        </Heading>
        <IconButton
          color={"red.500"}
          visibility={"hidden"}
          justifyContent={"center"}
          size={"md"}
          variant={"ghost"}
          _groupHover={{
            visibility: "visible",
            bgColor: "inherit",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the chat click event
            onDeleteClick();
          }}
        >
          <MdDelete />
        </IconButton>
      </HStack>
      <Text>{title}</Text>
    </Box>
  );
};
