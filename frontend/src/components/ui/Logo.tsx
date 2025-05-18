import { HStack, Image, Text } from "@chakra-ui/react";
import icon from "@/assets/icon.png";

type LogoProps = {
  type: "heading" | "sidebar";
};

export const Logo = ({ type }: LogoProps) => {
  return (
    <HStack w={"100%"} gap={2} justifyContent={"center"} alignItems={"center"}>
      <Image src={icon} w={type === "heading" ? "100px" : "50px"} />
      <Text
        fontSize={type === "heading" ? "6xl" : "3xl"}
        fontWeight="bold"
        as={"h1"}
      >
        paperAI
      </Text>
    </HStack>
  );
};
