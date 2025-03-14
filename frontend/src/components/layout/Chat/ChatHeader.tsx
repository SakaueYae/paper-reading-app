import { ColorModeButton } from "@/components/ui/chakraui/color-mode";
import { Box, HStack } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/chakraui/menu";
import { Avatar } from "@/components/ui/Avatar";

type ChatHeaderProps = {
  name: string;
};

export const ChatHeader = ({ name }: ChatHeaderProps) => {
  return (
    <HStack justifyContent={"end"}>
      <Box>
        <MenuRoot
          positioning={{
            placement: "bottom",
          }}
        >
          <MenuTrigger asChild>
            <div>
              <Avatar name={name} />
            </div>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="mypage">Mypage</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
          </MenuContent>
        </MenuRoot>
      </Box>
      <ColorModeButton />
    </HStack>
  );
};
