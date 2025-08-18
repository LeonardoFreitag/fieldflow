import {
  Center,
  Spinner,
  Text,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
} from '@gluestack-ui/themed';

interface WorkingProps {
  visible: boolean;
}

export function Working({ visible }: WorkingProps) {
  return (
    <Modal isOpen={visible}>
      <ModalBackdrop />
      <ModalContent bg="$trueGray600" rounded="$md" width="$80">
        <ModalBody scrollEnabled={false}>
          <Center
            flex={1}
            // bg="$trueGray800"
            justifyContent="center"
            alignItems="center"
            zIndex={1000}
            p="$4"
          >
            <Spinner
              size="large"
              color="$trueGray300"
              accessibilityLabel="Carregando"
            />
            <Text color="$trueGray100" size="lg">
              Trabalhando...
            </Text>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
