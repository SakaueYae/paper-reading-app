import { Avatar } from "@/components/ui/chakraui/avatar";
import { ColorModeButton } from "@/components/ui/chakraui/color-mode";
import { Box, HStack } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/chakraui/menu";

type ChatContentHeaderProps = {
  name: string;
};

export const ChatContentHeader = ({ name }: ChatContentHeaderProps) => {
  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

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
              <Avatar name={name} colorPalette={pickPalette(name)} />
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

// <Box>
// <Avatar
//   name={name}
//   colorPalette={pickPalette(name)}
//   onClick={() => setIsOpen(!isOpen)}
// />
// <Card.Root display={isOpen ? "block" : "none"}>
//   <Card.Body p={2}>
//     <Box as={"ul"} listStyleType={"none"}>
//       <li style={{ padding: "5px" }}>Mypage</li>
//       <li>Logout</li>
//       <li></li>
//     </Box>
//   </Card.Body>
// </Card.Root>
// </Box>
