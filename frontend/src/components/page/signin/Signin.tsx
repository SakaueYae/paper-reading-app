import { Form, FormType, FormValues } from "@/components/layout/Form";
import { VStack } from "@chakra-ui/react";
import { Logo } from "@/components/ui/Logo";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/components/context/AuthProvider";

export const Signin = ({ type }: { type: FormType }) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoading, signIn, signUp } = useAuthContext();

  // ログイン状態だとホーム画面へ遷移
  const { user } = useAuthContext();
  if (user) navigate("/");

  const handleForm = async ({ email, password }: FormValues) => {
    try {
      if (type === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch {
      setError("エラーが発生しました。");
    }
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
