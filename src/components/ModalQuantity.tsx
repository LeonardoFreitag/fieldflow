import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@ui/modal';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon } from '@ui/button';
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
      <ModalContent className="bg-trueGray-600 rounded-md">
        <ModalHeader />
        <ModalBody>
          <Heading className="text-blueGray-300">Quantidade</Heading>
          <Input
            autoFocus
            keyboardType="numeric"
            defaultValue={qtyTyped ?? ''}
            value={qtyTyped ?? ''}
            onChangeText={setQtyTyped}
          />
          <HStack className="mt-2 justify-end gap-2">
            <Button
              onPress={handleSave}
              className="w-20 h-10 rounded-md bg-green-700  active:bg-green-500"
            >
              <ButtonIcon as={Save} size="xl" />
            </Button>
            <Button
              onPress={handleCloseModal}
              className="w-20 h-10 rounded-md bg-red-700  active:bg-red-500"
            >
              <ButtonIcon as={X} size="xl" />
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
