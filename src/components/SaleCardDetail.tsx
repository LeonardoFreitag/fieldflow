import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { type TouchableOpacityProps } from 'react-native';
import { type SaleModel } from '../models/SaleModel';

type Props = TouchableOpacityProps & {
  data: SaleModel;
  handleSelectCustomer: () => void;
};

export function SaleCardDetail({ data, handleSelectCustomer, ...rest }: Props) {
  return (
    <VStack onPress={handleSelectCustomer} {...rest}>
      <HStack className="bg-trueGray-700 items-center p-2 pr-4 rounded-md mb-3 w-full justify-between">
        <VStack className="flex-1">
          <Heading size="xs" className="text-trueGray-100">
            {`Nro. pedido: ${data.id} - Data: ${data.sale_date.toLocaleDateString('pt-BR')}`}
          </Heading>
          <Text className="text-trueGray-400">
            {data.total.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
          <Text className="text-trueGray-100">
            {data.paymentForm.paymentForm}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
