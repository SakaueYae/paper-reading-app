import { HStack, Image, Text } from "@chakra-ui/react";

type LogoProps = {
  type: "heading" | "sidebar";
};

export const Logo = ({ type }: LogoProps) => {
  return (
    <HStack w={"100%"} gap={2} justifyContent={"center"} alignItems={"center"}>
      <Image
        src="src/assets/icon.png"
        w={type === "heading" ? "100px" : "50px"}
      />
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
