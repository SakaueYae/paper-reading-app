import { Form, FormType, FormValues } from "@/components/layout/Form";
import { VStack } from "@chakra-ui/react";
import { Logo } from "@/components/ui/Logo";
import { useState } from "react";
import { signIn } from "./models/signIn";
import { signUp } from "./models/signUp";
import { useNavigate } from "react-router";

export const Signin = ({ type }: { type: FormType }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleForm = async (values: FormValues) => {
    setIsLoading(true);
    if (type === "signin") {
      const data = await signIn(values);
      setError(data);
      if (!data) navigate("/home");
    } else {
      const data = await signUp(values);
      setError(data);
    }
    setIsLoading(false);
  };

  return (
    <VStack color={"gray.800"} h={"100%"} p={30}>
      <Logo type={"heading"} />
      <Form
        type={type}
        error={error}
        isLoading={isLoading}
        onSubmit={handleForm}
      />
    </VStack>
  );
};
