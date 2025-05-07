import { Box } from "@chakra-ui/react";
import { PDFIcon, FileData } from "./PDFIcon";
import Markdown from "react-markdown";

type SpeechBubbleProps = {
  message?: string;
  isLeft?: boolean;
  file?: FileData;
};

export const SpeechBubble = ({
  message,
  isLeft = false,
  file,
}: SpeechBubbleProps) => {
  return (
    <Box
      borderRadius={"10px"}
      borderWidth={"1px"}
      borderColor={"gray.300"}
      p={2}
      bg={"gray.50"}
      pos={"relative"}
      _after={
        isLeft
          ? {
              content: '""',
              pos: "absolute",
              top: 0,
              right: "calc(100% - 1px)",
              transform: "translate(0,50%)",
              bg: "gray.50",
              w: 5,
              h: 5,
              clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
            }
          : {
              content: '""',
              pos: "absolute",
              top: 0,
              left: "calc(100% - 1px)",
              transform: "translate(0,50%)",
              bg: "gray.50",
              w: 5,
              h: 5,
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            }
      }
    >
      {isLeft ? (
        <Box
          as={"p"}
          content={'""'}
          pos={"absolute"}
          top={"-1px"}
          right={"calc(100%)"}
          transform={"translate(0, 50%)"}
          bg={"gray.300"}
          w={"21px"}
          h={"21px"}
          clipPath={"polygon(100% 0, 100% 100%, 0 50%)"}
        ></Box>
      ) : (
        <Box
          as={"p"}
          content={'""'}
          pos={"absolute"}
          top={"-1px"}
          left={"calc(100%)"}
          transform={"translate(0, 50%)"}
          bg={"gray.300"}
          w={"21px"}
          h={"21px"}
          clipPath={"polygon(0 0, 100% 50%, 0 100%)"}
        ></Box>
      )}
      {file ? <PDFIcon file={file} /> : <Markdown>{message}</Markdown>}
    </Box>
  );
};
