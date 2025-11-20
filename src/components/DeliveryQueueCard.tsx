import { Button, ButtonIcon } from '@ui/button';
import { Badge, BadgeText, BadgeIcon } from '@ui/badge';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Hand, Truck } from 'lucide-react-native';
import { type DeliveryQueueModel } from '@models/DeliveryQueueModel';

interface Props {
  data: DeliveryQueueModel;
  handleSelectDeliveryQueue: (item: DeliveryQueueModel) => void;
}

export function DeliveryQueueCard({ data, handleSelectDeliveryQueue }: Props) {
  return (
    <>
      {data.Client && (
        <HStack className="bg-background-200 items-center p-2 rounded-md mb-3 w-full justify-between relative">
          <VStack className="flex-1">
            <BadgeStatus status={data.status} />
            <HStack className="w-full justify-between">
              <Heading size="sm" className="text-typography-700">
                {data.Client.companyName}
              </Heading>
            </HStack>
            <Text
              size="xs"
              className="text-typography-700"
            >{`${data.Client.streetName}, ${data.Client.streetNumber}, ${data.Client.neighborhood}`}</Text>
            <Text
              size="xs"
              className="text-typography-700"
            >{`${data.Client.city}, ${data.Client.zipCode} - Fone: ${data.Client.cellphone}`}</Text>
            <HStack className="justify-start gap-2">
              <Text
                size="xs"
                className="text-typography-700"
              >{`Pedido: ${String(data.orderNumber).padStart(8, '0')}`}</Text>
              <Text
                size="xs"
                className="text-typography-700"
              >{`Nf-e: ${String(data.nfeNumber).padStart(8, '0')}`}</Text>
            </HStack>
            <Text
              size="xs"
              className="text-typography-700"
            >{`Lt: ${data.Client.latitude} Lng: ${data.Client.longitude}`}</Text>
            <Text
              size="xs"
              className="text-typography-700"
            >{`Rota: ${data.routeId}`}</Text>
            {data.status === 'pending' && (
              <Button
                onPress={() => {
                  handleSelectDeliveryQueue(data);
                }}
                className={` ${data.isSelected ? 'bg-success-300' : 'bg-background-0'} w-12 h-12 rounded-md  active:bg-success-400 absolute bottom-1 right-1 `}
              >
                <ButtonIcon
                  as={Hand}
                  size="xl"
                  className="text-typography-700"
                />
              </Button>
            )}
          </VStack>
        </HStack>
      )}
    </>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const getButtonStatusColor = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'delivered':
        return 'success';
      case 'canceled':
        return 'error';
      case 'charged':
        return 'info';
      case 'pending':
        return 'warning';
      case 'not_delivered':
        return 'error';
      default:
        return 'info';
    }
  };

  const getButtonStatus = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case 'delivered':
        return 'Entregue';
      case 'canceled':
        return 'Cancelado';
      case 'charged':
        return 'Carregado';
      case 'pending':
        return 'Aguardando';
      case 'not_delivered':
        return 'Não entregue';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Badge
      size="md"
      variant="solid"
      action={getButtonStatusColor(status)}
      className={`w-32 justify-between mb-2 `}
    >
      <BadgeText>{getButtonStatus(status)}</BadgeText>
      <BadgeIcon as={Truck} />
    </Badge>
  );
}
