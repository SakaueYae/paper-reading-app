import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "./chakraui/color-mode";

type ChatBoxProps = {
  message: string;
};

export const ChatBox = ({ message }: ChatBoxProps) => {
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      borderRadius={"10px"}
      borderWidth={"1px"}
      borderColor={"gray.300"}
      p={2}
      bg={bgColor}
    >
      {message}
    </Box>
  );
};
