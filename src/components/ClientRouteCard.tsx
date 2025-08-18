import {
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  ButtonIcon,
} from '@gluestack-ui/themed';
import { type TouchableOpacityProps } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { type ClientModel } from '@models/ClientModel';
import { HandTap, ImageBroken, Images } from 'phosphor-react-native';
import { useAppSelector } from '@store/store';

type Props = TouchableOpacityProps & {
  data: ClientModel;
  handleSelectCustomer: (item: ClientModel) => void;
};

export function ClientRouteCard({
  data,
  handleSelectCustomer,
  ...rest
}: Props) {
  const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);

  return (
    <VStack {...rest}>
      <HStack
        bg="$trueGray700"
        alignItems="center"
        p="$4"
        pr="$4"
        rounded="$md"
        mb="$3"
        w="$full"
        justifyContent="space-between"
        position="relative"
      >
        <VStack flex={1}>
          <Heading size="sm" color="$trueGray100">
            {data.companyName}
          </Heading>
          <Text
            color="$trueGray400"
            size="xs"
          >{`${data.streetName}, ${data.streetNumber} - ${data.neighborhood}`}</Text>
          <Text
            color="$trueGray400"
            size="xs"
          >{`${data.city} - ${data.state}`}</Text>
          {data.latitude &&
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
          )}
        </VStack>
        <VStack
          alignItems="center"
          justifyContent="center"
          width={40}
          height={40}
          borderRadius="$md"
          position="absolute"
          top="$1"
          right="$1"
        >
          {data.ClientPhotos && data.ClientPhotos.length > 0 ? (
            <Images size={40} color="$trueGray400" />
          ) : (
            <ImageBroken
              size={40}
              color="#EF4444" // vermelho do tailwind/red-500
            />
          )}
        </VStack>
        {canChangeRouteEdit && (
          <Button
            width="$10"
            height="$10"
            rounded="$md"
            backgroundColor={data.isSelected ? '$green700' : '$blueGray600'}
            $active-bg="$green500"
            onPress={() => {
              handleSelectCustomer(data);
            }}
            position="absolute"
            bottom="$1"
            right="$1"
          >
            <ButtonIcon as={HandTap} size="xl" />
            {/* {data.isSelected && <ButtonIcon as={CheckCheck} size="xl" />} */}
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
