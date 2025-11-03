import { Heading, HStack, VStack, Text } from '@gluestack-ui/themed';
import { type TouchableOpacityProps } from 'react-native';
import { type SaleModel } from '../models/SaleModel';

type Props = TouchableOpacityProps & {
  data: SaleModel;
  handleSelectCustomer: () => void;
};

export function SaleCardDetail({ data, handleSelectCustomer, ...rest }: Props) {
  return (
    <VStack onPress={handleSelectCustomer} {...rest}>
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
            {`Nro. pedido: ${data.id} - Data: ${data.sale_date.toLocaleDateString('pt-BR')}`}
          </Heading>
          <Text color="$trueGray400">
            {data.total.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
          <Text color="$trueGray100">{data.paymentForm.paymentForm}</Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
