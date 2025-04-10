import { HStack, Image, Text } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <HStack w={"100%"} gap={2} justifyContent={"center"}>
      <Image src="src/assets/icon.png" w={"50px"} />
      <Text fontSize="3xl" fontWeight="bold">
        paperAI
      </Text>
    </HStack>
  );
};
