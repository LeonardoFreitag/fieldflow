import { ButtonIcon, Button } from '@ui/button';
import { Badge, BadgeText, BadgeIcon } from '@ui/badge';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { CircleDollarSign, HandCoins } from 'lucide-react-native';
import { CurrencyDollar, HandTap } from 'phosphor-react-native';
import { type ReceberModel } from '@models/ReceberModel';
import { useMemo } from 'react';

interface ReceberCardProps {
  data: ReceberModel;
  handleSelectReceber: (data: ReceberModel) => void;
}

export function ReceberCard({ data, handleSelectReceber }: ReceberCardProps) {
  const colorForStatus = (status: string) => {
    switch (status) {
      case 'A':
        return '$red300';
      case 'P':
        return '$yellow500';
      case 'R':
        return '$green500';
      default:
        return '$trueGray500';
    }
  };

  const receivedValue = useMemo(() => {
    return data.ReceberParcial?.reduce((total, parcial) => {
      return Number(total) + (Number(parcial.valorRecebido) || 0);
    }, 0);
  }, [data.ReceberParcial]);

  const balance = useMemo(() => {
    return Number(data.valorDuplicata) - Number(receivedValue);
  }, [data.valorDuplicata, receivedValue]);

  return (
    <>
      <VStack className="mb-2 mt-4 items-end absolute right-1 -top-3 z-1 bg-trueGray-800 p-1 rounded-md w-1/3 justify-between">
        <Text
          size="xs"
          className={` color-${colorForStatus(data.status)} font-bold `}
        >
          {Number(data.valorDuplicata).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        <Text size="xs" className="text-green-300 font-bold">
          {Number(receivedValue).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        <Text size="xs" className="text-orange-300 font-bold">
          {Number(balance).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
      </VStack>
      <HStack className="bg-trueGray-700 items-center p-2 pr-4 rounded-md mb-3 w-full justify-between relative">
        <VStack className="flex-1">
          <HStack className="w-full justify-between mb-1">
            <BadgeStatus status={data.status} />
          </HStack>
          {/* <HStack width="$full" justifyContent="space-between" mb="$1"> */}
          <Text className="text-trueGray-100">{`Pedido: ${data.travelClientOrdersNumber.padStart(
            6,
            '0',
          )}`}</Text>
          <Text className="text-trueGray-100">
            {`Nota fiscal: ${data.notaFiscal?.padStart(6, '0')}`}
          </Text>
          {/* </HStack> */}
          <VStack className="w-full justify-between">
            <Text size="sm" className="text-trueGray-100">
              {data.Client?.companyName}
            </Text>
            <Text size="sm" className="text-trueGray-400">
              {`${data.Client?.streetName}, ${data.Client?.streetNumber}`}
            </Text>
            <Text size="sm" className="text-trueGray-400">
              {`${data.Client?.neighborhood}`}
            </Text>
            <Text size="sm" className="text-trueGray-400">
              {`${data.Client?.city} - ${data.Client?.state}, ${data.Client?.zipCode}`}
            </Text>
          </VStack>
        </VStack>
        <Button
          onPress={() => {
            handleSelectReceber(data);
          }}
          className={` ${data.selected ? 'bg-green-700' : 'bg-blueGray-600'} w-12 h-12 rounded-md  active:bg-green-500 absolute bottom-1 right-1 `}
        >
          <ButtonIcon as={HandTap} size="xl" />
        </Button>
      </HStack>
    </>
  );
}

function BadgeStatus({ status }: { status: string }) {
  const color =
    status === 'A' ? '$red300' : status === 'P' ? '$yellow500' : '$green500';

  return (
    <Badge
      size="md"
      variant="solid"
      action="muted"
      className={` bgColor-${color} w-32 justify-between `}
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
