import { Dialog, Portal } from "@chakra-ui/react";
import { Button } from "./chakraui/button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  body: string;
  right?: string;
  left?: string;
  onButtonClick: (isOpen: boolean) => void;
};

export const Modal = ({
  isOpen,
  title,
  body,
  right,
  left,
  onButtonClick,
}: ModalProps) => {
  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      role="alertdialog"
      open={isOpen}
      onOpenChange={(details) => onButtonClick(details.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>{body}</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => onButtonClick(false)}>
                {left || "No"}
              </Button>
              <Button onClick={() => onButtonClick(true)}>
                {right || "Yes"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
