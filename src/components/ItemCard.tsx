import {
  Heading,
  HStack,
  VStack,
  Text,
  Icon,
  Divider,
  Button,
} from '@gluestack-ui/themed';
import { type TouchableOpacityProps } from 'react-native';
import { Edit, Trash } from 'lucide-react-native';
import { type SaleItemModel } from '../models/SaleItemModel';

type Props = TouchableOpacityProps & {
  data: SaleItemModel;
  handleSelectCustomer: () => void;
};

export function ItemCard({ data, handleSelectCustomer, ...rest }: Props) {
  return (
    <VStack onPress={handleSelectCustomer} {...rest}>
      <HStack
        bg="$trueGray600"
        alignItems="center"
        p="$2"
        px="$4"
        rounded="$md"
        mb="$3"
        w="$full"
        justifyContent="space-between"
      >
        <VStack flex={1}>
          <Heading size="xs" color="$trueGray100">
            {`Cód.: ${data.id} - Desc. ${data.product} - Un: ${data.unity}`}
          </Heading>
          <HStack justifyContent="space-between" w="$full">
            <Text color="$trueGray400">
              {data.quantity} x{' '}
              {data.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            <Text color="$trueGray400">
              Total:{' '}
              {data.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </HStack>
          <Divider my="$0.5" bgColor="$trueGray500" mb="$2" />
          <HStack justifyContent="flex-end" w="$full" gap="$2">
            <Button variant="solid" w="$16" bg={'$green600'}>
              <Icon as={Edit} color="$trueGray800" />
            </Button>
            <Button variant="solid" w="$16" bg="$red500">
              <Icon as={Trash} color="$trueGray800" />
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
