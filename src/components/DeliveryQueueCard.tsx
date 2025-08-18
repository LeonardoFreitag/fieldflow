import {
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  BadgeText,
  BadgeIcon,
  Button,
  ButtonIcon,
} from '@gluestack-ui/themed';
import { Truck } from 'lucide-react-native';
import { type DeliveryQueueModel } from '@models/DeliveryQueueModel';
import { HandTap } from 'phosphor-react-native';

interface Props {
  data: DeliveryQueueModel;
  handleSelectDeliveryQueue: (item: DeliveryQueueModel) => void;
}

export function DeliveryQueueCard({ data, handleSelectDeliveryQueue }: Props) {
  return (
    <HStack
      bg="$trueGray700"
      alignItems="center"
      p="$2"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="space-between"
      position="relative"
    >
      <VStack flex={1}>
        <BadgeStatus status={data.status} />
        <HStack width="$full" justifyContent="space-between">
          <Heading size="sm" color="$green500" mb="$1">
            {data.Client.companyName}
          </Heading>
        </HStack>
        <Text
          color="$trueGray100"
          size="xs"
        >{`${data.Client.streetName}, ${data.Client.streetNumber}, ${data.Client.neighborhood}`}</Text>
        <Text
          color="$trueGray100"
          size="xs"
        >{`${data.Client.city}, ${data.Client.zipCode} - Fone: ${data.Client.cellphone}`}</Text>
        <HStack justifyContent="flex-start" gap="$2">
          <Text
            color="$trueGray100"
            size="xs"
          >{`Pedido: ${String(data.orderNumber).padStart(8, '0')}`}</Text>
          <Text
            color="$trueGray100"
            size="xs"
          >{`Nf-e: ${String(data.nfeNumber).padStart(8, '0')}`}</Text>
        </HStack>
        <Text
          color="$trueGray100"
          size="xs"
        >{`Lt: ${data.Client.latitude} Lng: ${data.Client.longitude}`}</Text>
        <Text color="$trueGray100" size="xs">{`Rota: ${data.routeId}`}</Text>
        <Button
          width="$12"
          height="$12"
          rounded="$md"
          backgroundColor={data.isSelected ? '$green700' : '$blueGray600'}
          $active-bg="$green500"
          onPress={() => {
            handleSelectDeliveryQueue(data);
          }}
          position="absolute"
          bottom="$1"
          right="$1"
        >
          <ButtonIcon as={HandTap} size="xl" />
        </Button>
      </VStack>
    </HStack>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const color =
    status === 'pending'
      ? '$yellow300'
      : status === 'in_progress'
        ? '$blue500'
        : '$green500';

  return (
    <Badge
      size="md"
      variant="solid"
      action="muted"
      width="$32"
      bgColor={color}
      justifyContent="space-between"
      mb="$2"
    >
      <BadgeText>
        {status === 'pending'
          ? 'Aguardando'
          : status === 'delivered'
            ? 'Entregue'
            : 'Em trânsito'}
      </BadgeText>
      <BadgeIcon as={Truck} />
    </Badge>
  );
}
