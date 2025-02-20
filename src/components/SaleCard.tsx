import {
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Icon,
} from '@gluestack-ui/themed';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { type SaleModel } from '../models/SaleModel';

type Props = TouchableOpacityProps & {
  data: SaleModel;
  handleSelectCustomer: () => void;
};

export function SaleCard({ data, handleSelectCustomer, ...rest }: Props) {
  return (
    <TouchableOpacity onPress={handleSelectCustomer} {...rest}>
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
          <Text color="$trueGray100">{data.paymentForm.name}</Text>
        </VStack>
        <Icon as={CheckCheck} color="$green400" />
      </HStack>
    </TouchableOpacity>
  );
}
