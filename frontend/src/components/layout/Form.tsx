import { useForm } from "react-hook-form";
import {
  Stack,
  Field,
  Input,
  Button,
  For,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";

type FormValues = {
  username: string;
  password: string;
};

type FormProps = {
  type: "signup" | "signin";
};

const formTextMap = {
  signup: {
    heading: "Sign Up",
    button: "signup",
    footer: "Have an account?",
    link: "signin",
  },
  signin: {
    heading: "Sign In",
    button: "signin",
    footer: "No account?",
    link: "signup",
  },
} as const;

export const Form = ({ type }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const formValuesArray: (keyof FormValues)[] = ["username", "password"];
  const onSubmit = handleSubmit((data) => console.log(data));
  const text = formTextMap[type];

  return (
    <form onSubmit={onSubmit} style={{ width: "100%", height: "100%" }}>
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
                  type={item === "password" ? "password" : "text"}
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
        <Button type="submit" size={"xl"} colorPalette={"blue"}>
          {type === "signup" ? "signup" : "signin"}
        </Button>
      </Stack>
    </form>
  );
};
