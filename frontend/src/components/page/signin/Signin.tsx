import { VStack } from "@chakra-ui/react";
import { Logo } from "@/components/ui/Logo";
import { Form } from "@/components/layout/Form";

export const Signin = () => {
  return (
    <VStack color={"gray.800"} h={"100%"} p={30}>
      <Logo type={"heading"} />
      <Form type="signin" />
    </VStack>
  );
};
