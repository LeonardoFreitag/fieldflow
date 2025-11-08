import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@ui/alert-dialog';

import { Button, ButtonText } from '@ui/button';
import { Icon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
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
    if (!data.id) {
      return;
    }
    setSaleIdForRepeat(data.id);
    setShowRepeatConfirmDialog(true);
  };

  return (
    <HStack className="bg-trueGray-700 items-center p-2 pr-4 rounded-md mb-3 w-full justify-between">
      <VStack className="flex-1">
        <Heading size="xs" className="text-trueGray-100">
          {`Nro. pedido: ${data.id} - Data: ${data.orderDate.toLocaleDateString('pt-BR')}`}
        </Heading>
        <Text className="text-trueGray-400">
          {data.total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        {data.TravelClientOrdersPaymentForm &&
          data.TravelClientOrdersPaymentForm.map(payment => (
            <Text key={payment.id} className="text-trueGray-400">
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
        variant="solid"
        size="sm"
        onPress={handleSaleRepeatClick}
        className="h-12 rounded-md p-2 bg-trueGray-800"
      >
        <Icon as={Repeat} className="text-blue-500" />
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
        <AlertDialogFooter className="justify-between">
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
