import { Modal, ModalBackdrop, ModalBody, ModalContent } from '@ui/modal';
import { Text } from '@ui/text';
import { Spinner } from '@ui/spinner';
import { Center } from '@ui/center';

interface WorkingProps {
  visible: boolean;
}

export function Working({ visible }: WorkingProps) {
  return (
    <Modal isOpen={visible}>
      <ModalBackdrop />
      <ModalContent className="bg-trueGray-600 rounded-md w-80">
        <ModalBody scrollEnabled={false}>
          <Center className="flex-1 justify-center items-center z-1000 p-4">
            <Spinner
              size="large"
              accessibilityLabel="Carregando"
              className="text-trueGray-300"
            />
            <Text size="lg" className="text-trueGray-100">
              Trabalhando...
            </Text>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
