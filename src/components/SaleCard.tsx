import {
  Heading,
  HStack,
  VStack,
  Text,
  Icon,
  Button,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonText,
} from '@gluestack-ui/themed';
import { type TouchableOpacityProps } from 'react-native';
import { Repeat } from 'lucide-react-native';
import { useState } from 'react';
import { type TravelClientOrdersModel } from '@models/TravelClientOrdersModel';

type Props = TouchableOpacityProps & {
  data: TravelClientOrdersModel;
  handleSaleRepeat?: () => void;
};

export function SaleCard({ data, handleSaleRepeat, ...rest }: Props) {
  const [showRepeatConfirmDialog, setShowRepeatConfirmDialog] = useState(false);
  const [saleIdForRepeat, setSaleIdForRepeat] = useState<string | null>(null);

  const handleSaleRepeatClick = () => {
    setSaleIdForRepeat(data.id);
    setShowRepeatConfirmDialog(true);
  };

  return (
    <HStack
      bg="$trueGray700"
      alignItems="center"
      p="$2"
      pr="$4"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="space-between"
    >
      <VStack flex={1}>
        <Heading size="xs" color="$trueGray100">
          {`Nro. pedido: ${data.id} - Data: ${data.orderDate.toLocaleDateString('pt-BR')}`}
        </Heading>
        <Text color="$trueGray400">
          {data.total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        {data.TravelClientOrdersPaymentForm &&
          data.TravelClientOrdersPaymentForm.map(payment => (
            <Text key={payment.id} color="$trueGray400">
              {`Forma de pagamento: ${payment.description} - Valor: ${payment.amount.toLocaleString(
                'pt-BR',
                {
                  style: 'currency',
                  currency: 'BRL',
                },
              )}`}
            </Text>
          ))}
      </VStack>
      <Button
        height="$12"
        variant="solid"
        size="sm"
        rounded="$md"
        p="$2"
        bg="$trueGray800"
        onPress={handleSaleRepeatClick}
      >
        <Icon as={Repeat} color="$blue500" />
      </Button>
      <DialogConfirmRepeatSale
        isOpen={showRepeatConfirmDialog}
        onClose={() => {
          setShowRepeatConfirmDialog(false);
        }}
        onConfirm={() => {
          if (saleIdForRepeat) {
            handleSaleRepeat?.();
          }
          setShowRepeatConfirmDialog(false);
        }}
      />
    </HStack>
  );
}

function DialogConfirmRepeatSale({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  // Implement the dialog component here
  // This is a placeholder for the actual dialog implementation
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>Repetir o pedido?</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm">
            O pedido será lançado novamente para o cliente. Confirme para
            continuar.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter justifyContent="space-between">
          <Button
            variant="outline"
            action="secondary"
            onPress={onConfirm}
            size="sm"
          >
            <ButtonText>Confirmar</ButtonText>
          </Button>
          <Button size="sm" onPress={onClose}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
