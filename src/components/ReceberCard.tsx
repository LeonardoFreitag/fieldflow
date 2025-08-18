import {
  HStack,
  VStack,
  Text,
  Badge,
  BadgeText,
  BadgeIcon,
  ButtonIcon,
  Button,
} from '@gluestack-ui/themed';
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
      return total + (parcial.valorRecebido || 0);
    }, 0);
  }, [data.ReceberParcial]);

  const balance = useMemo(() => {
    return data.valorDuplicata - receivedValue;
  }, [data.valorDuplicata, receivedValue]);

  return (
    <>
      <VStack
        mb="$2"
        mt="$4"
        alignItems="flex-end"
        position="absolute"
        right="$1"
        top="-$3"
        zIndex={1}
        backgroundColor="$trueGray800"
        p="$1"
        rounded="$md"
        w="$1/3"
        justifyContent="space-between"
      >
        <Text size="xs" color={colorForStatus(data.status)} fontWeight="bold">
          {Number(data.valorDuplicata).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        <Text size="xs" color="$green300" fontWeight="bold">
          {Number(receivedValue).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        <Text size="xs" color="$orange300" fontWeight="bold">
          {Number(balance).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
      </VStack>
      <HStack
        bg="$trueGray700"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
        w="$full"
        justifyContent="space-between"
        position="relative"
      >
        <VStack flex={1}>
          <HStack width="$full" justifyContent="space-between" mb="$1">
            <BadgeStatus status={data.status} />
          </HStack>
          {/* <HStack width="$full" justifyContent="space-between" mb="$1"> */}
          <Text color="$trueGray100">{`Pedido: ${data.travelClientOrdersNumber.padStart(
            6,
            '0',
          )}`}</Text>
          <Text color="$trueGray100">
            {`Nota fiscal: ${data.notaFiscal?.padStart(6, '0')}`}
          </Text>
          {/* </HStack> */}
          <VStack width="$full" justifyContent="space-between">
            <Text size="sm" color="$trueGray100">
              {data.Client?.companyName}
            </Text>
            <Text size="sm" color="$trueGray400">
              {`${data.Client?.streetName}, ${data.Client?.streetNumber}`}
            </Text>
            <Text size="sm" color="$trueGray400">
              {`${data.Client?.neighborhood}`}
            </Text>
            <Text size="sm" color="$trueGray400">
              {`${data.Client?.city} - ${data.Client?.state}, ${data.Client?.zipCode}`}
            </Text>
          </VStack>
        </VStack>
        <Button
          width="$12"
          height="$12"
          rounded="$md"
          backgroundColor={data.selected ? '$green700' : '$blueGray600'}
          $active-bg="$green500"
          onPress={() => {
            handleSelectReceber(data);
          }}
          position="absolute"
          bottom="$1"
          right="$1"
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
      width="$32"
      bgColor={color}
      justifyContent="space-between"
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
