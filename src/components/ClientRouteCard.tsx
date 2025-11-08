import { Button, ButtonIcon } from '@ui/button';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { type TouchableOpacityProps } from 'react-native';
import { type ClientModel } from '@models/ClientModel';
import { HandTap, ShoppingCart } from 'phosphor-react-native';
import { useAppSelector } from '@store/store';

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
      <HStack className="bg-trueGray-700 items-center p-4 pr-4 rounded-md mb-3 w-full justify-between relative">
        <VStack className="flex-1">
          <Text size="sm" className="text-trueGray-100">
            {data.companyName}
          </Text>
          <Text size="xs" className="text-trueGray-400">
            {`${data.streetName}, ${data.streetNumber}`}
          </Text>
          <Text
            size="xs"
            className="text-trueGray-400"
          >{`Bairro: ${data.neighborhood}`}</Text>
          <Text
            size="xs"
            className="text-trueGray-400"
          >{`${data.city} - ${data.state}`}</Text>
        </VStack>
        <VStack className="items-center justify-center w-[40px] h-[40px] rounded-md absolute top-1 right-1">
          <Button
            onPress={() => {
              handleAddNewSale(data);
            }}
            className="w-10 h-10 rounded-md bg-blue-500  active:bg-blue-500"
          >
            <ButtonIcon as={ShoppingCart} size="xl" />
          </Button>
        </VStack>
        {canChangeRouteEdit && (
          <Button
            onPress={() => {
              handleSelectCustomer(data);
            }}
            className={` ${data.isSelected ? 'bg-green-700' : 'bg-blueGray-600'} w-10 h-10 rounded-md  active:bg-green-500 absolute bottom-1 right-1 `}
          >
            <ButtonIcon as={HandTap} size="xl" />
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
