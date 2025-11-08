import { Button, ButtonIcon } from '@ui/button';
import { Badge, BadgeText, BadgeIcon } from '@ui/badge';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Truck } from 'lucide-react-native';
import { type DeliveryQueueModel } from '@models/DeliveryQueueModel';
import { HandTap } from 'phosphor-react-native';

interface Props {
  data: DeliveryQueueModel;
  handleSelectDeliveryQueue: (item: DeliveryQueueModel) => void;
}

export function DeliveryQueueCard({ data, handleSelectDeliveryQueue }: Props) {
  return (
    <HStack className="bg-trueGray-700 items-center p-2 rounded-md mb-3 w-full justify-between relative">
      <VStack className="flex-1">
        <BadgeStatus status={data.status} />
        <HStack className="w-full justify-between">
          <Heading size="sm" className="text-green-500 mb-1">
            {data.Client.companyName}
          </Heading>
        </HStack>
        <Text
          size="xs"
          className="text-trueGray-100"
        >{`${data.Client.streetName}, ${data.Client.streetNumber}, ${data.Client.neighborhood}`}</Text>
        <Text
          size="xs"
          className="text-trueGray-100"
        >{`${data.Client.city}, ${data.Client.zipCode} - Fone: ${data.Client.cellphone}`}</Text>
        <HStack className="justify-start gap-2">
          <Text
            size="xs"
            className="text-trueGray-100"
          >{`Pedido: ${String(data.orderNumber).padStart(8, '0')}`}</Text>
          <Text
            size="xs"
            className="text-trueGray-100"
          >{`Nf-e: ${String(data.nfeNumber).padStart(8, '0')}`}</Text>
        </HStack>
        <Text
          size="xs"
          className="text-trueGray-100"
        >{`Lt: ${data.Client.latitude} Lng: ${data.Client.longitude}`}</Text>
        <Text
          size="xs"
          className="text-trueGray-100"
        >{`Rota: ${data.routeId}`}</Text>
        <Button
          onPress={() => {
            handleSelectDeliveryQueue(data);
          }}
          className={` ${data.isSelected ? 'bg-green-700' : 'bg-blueGray-600'} w-12 h-12 rounded-md  active:bg-green-500 absolute bottom-1 right-1 `}
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
      className={` bgColor-${color} w-32 justify-between mb-2 `}
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
