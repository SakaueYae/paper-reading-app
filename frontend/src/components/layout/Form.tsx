import { useForm } from "react-hook-form";
import {
  Stack,
  Field,
  Input,
  For,
  Heading,
  Text,
  Link,
  Alert,
} from "@chakra-ui/react";
import { Button } from "../ui/chakraui/button";

export type FormValues = {
  email: string;
  password: string;
};

export type FormType = "signup" | "signin";

export type FormProps = {
  type: FormType;
  error: string | null;
  isLoading: boolean;
  onSubmit: (value: FormValues) => void;
};

const formTextMap = {
  signup: {
    heading: "Sign up",
    button: "Sign up",
    footer: "Have an account?",
    link: "signin",
  },
  signin: {
    heading: "Sign in",
    button: "Sign in",
    footer: "No account?",
    link: "signup",
  },
} as const;

export const Form = ({ type, error, isLoading, onSubmit }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const formValuesArray: (keyof FormValues)[] = ["email", "password"];
  const text = formTextMap[type];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ width: "100%", height: "100%" }}
    >
      <Stack
        h={"100%"}
        w={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={10}
      >
        <Heading size={"4xl"}>{text.heading}</Heading>
        <Stack gap="4" align="flex-start" maxW={"xl"} w={"100%"}>
          <For each={formValuesArray}>
            {(item) => (
              <Field.Root invalid={!!errors[item]}>
                <Field.Label fontSize={{ base: "md", md: "lg" }}>
                  {item.toUpperCase()}
                </Field.Label>
                <Input
                  {...register(item, {
                    required: "この項目を入力してください。",
                  })}
                  type={item === "password" ? "password" : "email"}
                />
                <Field.ErrorText>{errors[item]?.message}</Field.ErrorText>
              </Field.Root>
            )}
          </For>
        </Stack>
        <Text fontSize={{ base: "md", md: "lg" }}>
          {text.footer}{" "}
          <Link variant={"underline"} href={text.link} colorPalette={"blue"}>
            {text.link}
          </Link>
        </Text>
        <Button
          type="submit"
          size={"xl"}
          colorPalette={"blue"}
          loading={isLoading}
        >
          {text.button}
        </Button>
        {error && (
          <Alert.Root status="error" maxW={"xl"}>
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}
      </Stack>
    </form>
  );
};
