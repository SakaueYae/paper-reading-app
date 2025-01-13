import { Box, Flex, Button, IconButton, Stack, Link } from "@chakra-ui/react";
import {
  useColorMode,
  useColorModeValue,
} from "@/components/ui/chakraui/color-mode";
import { IoMoonOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { FaBook } from "react-icons/fa";

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "white");

  return (
    <Box w="100%" bg={bgColor} px={4} boxShadow="sm" position="fixed" top={0}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Stack direction="row" gap={4}>
          <IconButton
            size="md"
            aria-label="論文補助ツール"
            variant="ghost"
            color={textColor}
          >
            <FaBook />
          </IconButton>

          <Stack direction="row" gap={4} alignItems="center">
            <Link href="/" color={textColor}>
              ホーム
            </Link>
            <Link href="/mypage" color={textColor}>
              マイページ
            </Link>
          </Stack>
        </Stack>

        <Flex alignItems="center">
          <Stack direction="row" gap={4}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoonOutline /> : <IoSunnyOutline />}
            </Button>
            <Button colorScheme="blue">ログイン</Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};
