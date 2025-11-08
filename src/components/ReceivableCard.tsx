import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import React from 'react';
import { type ReceivableModel } from '@models/ReceivableModel';

interface ReceivableCardProps {
  receivableAccount: ReceivableModel;
}

export function ReceivableCard({ receivableAccount }: ReceivableCardProps) {
  return (
    <HStack className="bg-trueGray-700 items-center p-2 pr-2 rounded-md mb-3 w-full justify-end gap-8">
      <Text size="xs" className="text-trueGray-100">
        {`${new Date(receivableAccount.dueDate).toLocaleDateString('pt-BR')}`}
      </Text>
      <Text size="sm" className="text-trueGray-100">
        {receivableAccount.value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </Text>
      <Text
        size="xs"
        className={` ${receivableAccount.status === 'PENDING' ? 'text-red-500' : 'text-green-500'} w-24 `}
      >
        {receivableAccount.status === 'PENDING' ? ' (Pendente)' : ' (Pago)'}
      </Text>
    </HStack>
  );
}
