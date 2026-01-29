import { Avatar as ChakraAvatar } from "./chakraui/avatar";

type AvatarProps = {
  name?: string;
  visibility?: string;
};

export const Avatar = ({ name, visibility }: AvatarProps) => {
  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <ChakraAvatar
      name={name}
      visibility={visibility}
      colorPalette={name ? pickPalette(name) : undefined}
    />
  );
};
