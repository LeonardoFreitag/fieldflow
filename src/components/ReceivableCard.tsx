import { HStack, Text } from '@gluestack-ui/themed';
import React from 'react';
import { type ReceivableModel } from '@models/ReceivableModel';

interface ReceivableCardProps {
  receivableAccount: ReceivableModel;
}

export function ReceivableCard({ receivableAccount }: ReceivableCardProps) {
  return (
    <HStack
      bg="$trueGray700"
      alignItems="center"
      p="$2"
      pr="$2"
      rounded="$md"
      mb="$3"
      w="$full"
      justifyContent="flex-end"
      gap="$8"
    >
      <Text size="xs" color="$trueGray100">
        {`${new Date(receivableAccount.dueDate).toLocaleDateString('pt-BR')}`}
      </Text>
      <Text size="sm" color="$trueGray100">
        {receivableAccount.value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
      <Text
        w="$24"
        size="xs"
        color={receivableAccount.status === 'PENDING' ? '$red500' : '$green500'}
      >
        {receivableAccount.status === 'PENDING' ? ' (Pendente)' : ' (Pago)'}
      </Text>
    </HStack>
  );
}
