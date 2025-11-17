import { ButtonIcon, Button } from '@ui/button';
import { Badge, BadgeText, BadgeIcon } from '@ui/badge';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { CircleDollarSign, Hand, HandCoins } from 'lucide-react-native';
import { CurrencyDollar, HandTap } from 'phosphor-react-native';
import { type ReceberModel } from '@models/ReceberModel';
import { useMemo } from 'react';
import { Center } from '@ui/center';

interface ReceberCardProps {
  data: ReceberModel;
  handleSelectReceber: (data: ReceberModel) => void;
}

const colorForStatus = (status: string) => {
  switch (status) {
    case 'A':
      return 'info-500';
    case 'P':
      return 'tertiary-500';
    case 'R':
      return 'info-500';
    default:
      return 'typography-700';
  }
};

export function ReceberCard({ data, handleSelectReceber }: ReceberCardProps) {
  return (
    <>
      <HStack className="bg-background-200 items-center p-2 pr-4 rounded-md mb-3 w-full justify-between relative">
        <VStack className="flex-1">
          <HStack className="w-full justify-between mb-1">
            <BadgeStatus status={data.status} />
          </HStack>
          {/* <HStack width="$full" justifyContent="space-between" mb="$1"> */}
          <Text className="text-typography-700">{`Pedido: ${data.travelClientOrdersNumber.padStart(
            6,
            '0',
          )}`}</Text>
          <Text className="text-typography-700">
            {`Nota fiscal: ${data.notaFiscal?.padStart(6, '0')}`}
          </Text>
          {/* </HStack> */}
          <VStack className="w-full justify-between">
            <Text size="sm" className="text-typography-700">
              {data.Client?.companyName}
            </Text>
            <Text size="sm" className="text-typography-700">
              {`${data.Client?.streetName}, ${data.Client?.streetNumber}`}
            </Text>
            <Text size="sm" className="text-typography-700">
              {`${data.Client?.neighborhood}`}
            </Text>
            <Text size="sm" className="text-typography-700">
              {`${data.Client?.city} - ${data.Client?.state}, ${data.Client?.zipCode}`}
            </Text>
          </VStack>
        </VStack>
        <Button
          onPress={() => {
            handleSelectReceber(data);
          }}
          className={` ${data.selected ? 'bg-success-400' : 'bg-background-0'} w-12 h-12 rounded-md  active:bg-success-500 absolute bottom-2 right-2 `}
        >
          <ButtonIcon as={Hand} size="xl" className="text-typography-700" />
        </Button>
        <Center className="absolute top-2 right-2 w-96 h-20">
          <ShowCalculatedValues data={data} />
        </Center>
      </HStack>
    </>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const color =
    status === 'A'
      ? 'error-300'
      : status === 'P'
        ? 'tertiary-300'
        : 'success-300';

  return (
    <Badge
      size="md"
      variant="solid"
      action="muted"
      className={` bg-${color} w-32 justify-between `}
    >
      <BadgeText>
        {status === 'A' ? 'Atrasado' : status === 'P' ? 'Parcial' : 'Recebido'}
      </BadgeText>
      {status === 'R' && <BadgeIcon as={CurrencyDollar} />}
      {status === 'P' && <BadgeIcon as={HandCoins} />}
      {status === 'A' && <BadgeIcon as={CircleDollarSign} />}
    </Badge>
  );
}

function ShowCalculatedValues({ data }: { data: ReceberModel }) {
  const receivedValue = useMemo(() => {
    return data.ReceberParcial?.reduce((total, parcial) => {
      return Number(total) + (Number(parcial.valorRecebido) || 0);
    }, 0);
  }, [data.ReceberParcial]);

  const balance = useMemo(() => {
    return Number(data.valorDuplicata) - Number(receivedValue);
  }, [data.valorDuplicata, receivedValue]);

  return (
    <VStack className=" mb-2 mt-4 border border-error-400 items-end absolute right-1 -top-3 z-1 bg-error-0 p-1 rounded-md w-1/3 justify-between">
      <Text
        size="xs"
        className={` color-${colorForStatus(data.status)} font-bold `}
      >
        {Number(data.valorDuplicata).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
      <Text size="xs" className="text-success-600 font-bold">
        {Number(receivedValue).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
      <Text size="xs" className="text-tertiary-600 font-bold">
        {Number(balance).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
    </VStack>
  );
}
