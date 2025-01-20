import { Box } from "@chakra-ui/react";

type ChatBoxProps = {
  message: string;
};

export const ChatBox = ({ message }: ChatBoxProps) => {
  return (
    <Box
      borderRadius={"10px"}
      borderWidth={"1px"}
      borderColor={"gray.300"}
      p={2}
      bg={"gray.50"}
    >
      {message}
    </Box>
  );
};
