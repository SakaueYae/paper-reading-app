import { Form, FormType, FormValues } from "@/components/layout/Form";
import { VStack } from "@chakra-ui/react";
import { Logo } from "@/components/ui/Logo";
import { useState } from "react";
import { signIn } from "./models/signIn";
import { signUp } from "./models/signUp";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/components/context/AuthProvider";

export const Signin = ({ type }: { type: FormType }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // ログイン状態だとホーム画面へ遷移
  const { user } = useAuthContext();
  if (user) navigate("/");

  const handleForm = async (values: FormValues) => {
    setIsLoading(true);
    if (type === "signin") {
      const data = await signIn(values);
      setError(data);
      if (!data) navigate("/");
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
