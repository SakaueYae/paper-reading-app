import { Box, Icon, Link } from "@chakra-ui/react";
import { FaRegFilePdf } from "react-icons/fa";

export type FileData = {
  name: string;
  link?: string;
};

type PDFIconProps = {
  file: FileData;
};

export const PDFIcon = ({ file }: PDFIconProps) => {
  return (
    <Box textAlign={"center"} width={"fit-content"}>
      <Link
        display={"block"}
        width={"fit-content"}
        p={2}
        borderRadius={"md"}
        bgColor={"blue.300"}
        href={file.link}
        m={"0 auto"}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Icon size={"2xl"}>
          <FaRegFilePdf />
        </Icon>
      </Link>
      {file.name}
    </Box>
  );
};
