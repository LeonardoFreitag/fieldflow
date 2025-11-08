import { Button, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { type TouchableOpacityProps } from 'react-native';
import { type ClientModel } from '@models/ClientModel';
import { HandTap, ImageBroken, Images } from 'phosphor-react-native';
import { useAppSelector } from '@store/store';

type Props = TouchableOpacityProps & {
  data: ClientModel;
  handleSelectCustomer: (item: ClientModel) => void;
};

export function ClientCard({ data, handleSelectCustomer, ...rest }: Props) {
  const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);

  return (
    <VStack {...rest}>
      <HStack className="bg-trueGray-700 items-center p-4 pr-4 rounded-md mb-3 w-full justify-between relative">
        <VStack className="flex-1">
          <Text size="xs" className="text-trueGray-100 font-bold">
            {data.companyName}
          </Text>
          <Text
            size="xs"
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-trueGray-400"
          >
            {`${data.streetName}, ${data.streetNumber}`}
          </Text>
          <Text
            size="xs"
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-trueGray-400"
          >
            {`Bairro: ${data.neighborhood}`}
          </Text>
          <Text
            size="xs"
            className="text-trueGray-400"
          >{`${data.city} - ${data.state}`}</Text>
          {/* {data.latitude &&
            data.longitude &&
            data.latitude !== 0 &&
            data.longitude !== 0 &&
            data.latitude !== null &&
            data.longitude !== null && (
              <Text
                color="$trueGray400"
                size="xs"
              >{`Lat. ${data.latitude} | Long. ${data.longitude}`}</Text>
            )}
          {!data.latitude && !data.longitude && (
            <Text color="$red400">{`Lat. - |   Long. -`}</Text>
          )} */}
          {data.dataFrom === 'manual' ? (
            <Text size="xs" className="text-blue-500">
              {`Adicionado manualmente`}
            </Text>
          ) : (
            <Text size="xs" className="text-green-500">
              {`Rota do dia`}
            </Text>
          )}
        </VStack>
        <VStack className="items-center justify-center w-[40px] h-[40px] rounded-md absolute top-1 right-1">
          {data.ClientPhotos && data.ClientPhotos.length > 0 ? (
            <Images color="white" />
          ) : (
            <ImageBroken
              size={40}
              color="#EF4444" // vermelho do tailwind/red-500
            />
          )}
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
