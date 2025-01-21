import { Avatar as ChakraAvatar } from "./chakraui/avatar";

type AvatarProps = {
  name?: string;
};

export const Avatar = ({ name }: AvatarProps) => {
  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <ChakraAvatar
      name={name}
      colorPalette={name ? pickPalette(name) : undefined}
    />
  );
};
