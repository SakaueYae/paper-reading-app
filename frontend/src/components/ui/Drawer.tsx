import { Drawer as ChakraDrawer } from "@chakra-ui/react";

export const Drawer = () => {
  return (
    <ChakraDrawer.Root>
      <ChakraDrawer.Backdrop />
      <ChakraDrawer.Trigger />
      <ChakraDrawer.Positioner>
        <ChakraDrawer.Content>
          <ChakraDrawer.CloseTrigger />
          <ChakraDrawer.Header>
            <ChakraDrawer.Title>Title</ChakraDrawer.Title>
          </ChakraDrawer.Header>
          <ChakraDrawer.Body>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit,
            deleniti asperiores, libero harum deserunt nulla laborum quia
            magnam, animi reiciendis tempora maxime exercitationem alias!
            Distinctio ducimus nostrum excepturi doloremque commodi!
          </ChakraDrawer.Body>
          <ChakraDrawer.Footer />
        </ChakraDrawer.Content>
      </ChakraDrawer.Positioner>
    </ChakraDrawer.Root>
  );
};
