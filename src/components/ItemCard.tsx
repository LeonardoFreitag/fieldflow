import { Button } from '@ui/button';
import { Divider } from '@ui/divider';
import { Icon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
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
      <HStack className="bg-trueGray-600 items-center p-2 px-4 rounded-md mb-3 w-full justify-between">
        <VStack className="flex-1">
          <Heading size="xs" className="text-trueGray-100">
            {`Cód.: ${data.id} - Desc. ${data.product} - Un: ${data.unity}`}
          </Heading>
          <HStack className="justify-between w-full">
            <Text className="text-trueGray-400">
              {data.quantity} x{' '}
              {data.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            <Text className="text-trueGray-400">
              Total:{' '}
              {data.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          </HStack>
          <Divider className="my-0.5 bg-trueGray-500 mb-2" />
          <HStack className="justify-end w-full gap-2">
            <Button variant="solid" className="w-16 bg-green-600">
              <Icon as={Edit} className="text-trueGray-800" />
            </Button>
            <Button variant="solid" className="w-16 bg-red-500">
              <Icon as={Trash} className="text-trueGray-800" />
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
