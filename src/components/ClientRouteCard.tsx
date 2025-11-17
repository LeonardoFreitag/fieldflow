import { Button, ButtonIcon } from '@ui/button';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { type TouchableOpacityProps } from 'react-native';
import { type ClientModel } from '@models/ClientModel';
import { useAppSelector } from '@store/store';
import { HandIcon, ShoppingCart } from 'lucide-react-native';

type Props = TouchableOpacityProps & {
  data: ClientModel;
  handleSelectCustomer: (item: ClientModel) => void;
  handleAddNewSale: (client: ClientModel) => Promise<void>;
};

export function ClientRouteCard({
  data,
  handleSelectCustomer,
  handleAddNewSale,
  ...rest
}: Props) {
  const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);

  return (
    <VStack {...rest}>
      <HStack className="bg-background-200 items-center p-4 pr-4 rounded-md mb-3 w-full justify-between relative">
        <VStack className="flex-1">
          <Text className="text-typography-700 font-bold" size="md">
            {data.companyName}
          </Text>
          <Text className="text-typography-700" size="sm">
            {`${data.streetName}, ${data.streetNumber}`}
          </Text>
          <Text
            className="text-typography-700"
            size="sm"
          >{`Bairro: ${data.neighborhood}`}</Text>
          <Text
            size="sm"
            className="text-typography-700"
          >{`${data.city} - ${data.state}`}</Text>
        </VStack>
        <VStack className="items-center justify-center w-[40px] h-[40px] rounded-md absolute top-1 right-1">
          <Button
            className="rounded-md w-11 h-11 bg-secondary-50  active:bg-success-700"
            onPress={() => {
              handleAddNewSale(data);
            }}
          >
            <ButtonIcon as={ShoppingCart} className="text-typography-700" />
          </Button>
        </VStack>
        {canChangeRouteEdit && (
          <Button
            onPress={() => {
              handleSelectCustomer(data);
            }}
            className={` ${data.isSelected ? 'bg-success-400' : 'bg-secondary-50'} w-11 h-11 rounded-md  active:bg-success-500 absolute bottom-1 right-1`}
          >
            <ButtonIcon as={HandIcon} className="text-typography-700" />
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
