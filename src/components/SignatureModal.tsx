import {
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
  Icon,
  CloseIcon,
} from '@gluestack-ui/themed';
import { useRef } from 'react';
import SignatureScreen, {
  type SignatureViewRef,
} from 'react-native-signature-canvas';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOK: (signature: string) => void;
}

export function SignatureModal({ isOpen, onClose, onOK }: SignatureModalProps) {
  const ref = useRef<SignatureViewRef>(null);

  const handleOK = (signature: string) => {
    onOK(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    console.log('clear success!');
  };

  const handleEnd = () => {
    if (ref.current) {
      ref.current.readSignature();
    }
  };

  const handleData = (data: string) => {
    console.log(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent w="$full">
        <ModalHeader>
          <ModalCloseButton>
            <Icon as={CloseIcon} size="xl" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody scrollEnabled={false} h="$3/6">
          <VStack
            p="$1"
            alignItems="center"
            justifyContent="center"
            height={400}
          >
            <Heading size="lg" color="$trueGray500">
              Assinatura
            </Heading>

            <SignatureScreen
              ref={ref}
              // onEnd={handleEnd}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                borderStyle: 'solid',
                borderWidth: 0.5,
                borderRadius: 5,
                borderColor: '#696b6c',
              }}
              onOK={handleOK}
              onEmpty={handleEmpty}
              onClear={handleClear}
              onGetData={handleData}
              autoClear={true}
              descriptionText={'Assine aqui'}
            />
          </VStack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
