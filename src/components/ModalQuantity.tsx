import {
  Button,
  ButtonIcon,
  Heading,
  HStack,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@gluestack-ui/themed';
// import { useState } from 'react';
import { Input } from './Input';
import { Save, X } from 'lucide-react-native';

interface ModalQuantityProps {
  visible: boolean;
  handleCloseModal: () => void;
  setQtyTyped: (qty: string) => void;
  qtyTyped: string | null;
  handleUpdateQty: () => void;
}

export function ModalQuantity({
  visible,
  handleCloseModal,
  setQtyTyped,
  qtyTyped,
  handleUpdateQty,
}: ModalQuantityProps) {
  // const [qtyTyped, setQtyTyped] = useState(qtyEdit);

  const handleSave = () => {
    handleUpdateQty();
    handleCloseModal();
  };

  return (
    <Modal isOpen={visible}>
      <ModalBackdrop />
      <ModalContent bg="$trueGray600" rounded="$md">
        <ModalHeader />
        <ModalBody>
          <Heading color="$blueGray300">Quantidade</Heading>
          <Input
            autoFocus
            keyboardType="numeric"
            defaultValue={qtyTyped ?? ''}
            value={qtyTyped ?? ''}
            onChangeText={setQtyTyped}
          />
          <HStack mt="$2" justifyContent="flex-end" gap="$2">
            <Button
              width="$20"
              height="$10"
              rounded="$md"
              backgroundColor="$green700"
              $active-bg="$green500"
              onPress={handleSave}
            >
              <ButtonIcon as={Save} size="xl" />
            </Button>
            <Button
              width="$20"
              height="$10"
              rounded="$md"
              backgroundColor="$red700"
              $active-bg="$red500"
              onPress={handleCloseModal}
            >
              <ButtonIcon as={X} size="xl" />
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
