// components/ClientListHeader.tsx
import React from 'react';
import { TouchableOpacity, TextInput } from 'react-native';
import { HStack } from '@ui/hstack';
import { Button } from '@ui/button';
import { Text } from '@ui/text';

export type FilterType = 'suggested' | 'all';

interface Props {
  selectedFilter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
  search?: string;
  onChangeSearch?: (text: string) => void;
}

export const ClientListHeader: React.FC<Props> = ({
  selectedFilter,
  onChangeFilter,
  search,
  onChangeSearch,
}) => {
  return (
    <HStack className="w-full px-2">
      <Button
        onPress={() => {
          onChangeFilter('suggested');
        }}
        className={`flex-1 ml-1 py-2 rounded-2xl items-center ${
          selectedFilter === 'suggested'
            ? 'bg-info-300'
            : 'bg-background-200 border border-background-200'
        }`}
      >
        <Text
          size="sm"
          className={`${
            selectedFilter === 'suggested'
              ? 'text-typography-900'
              : 'text-typography-600'
          }`}
        >
          Sugeridos da semana
        </Text>
      </Button>

      <Button
        onPress={() => {
          onChangeFilter('all');
        }}
        className={`flex-1 ml-1 py-2 rounded-2xl items-center ${
          selectedFilter === 'all'
            ? 'bg-info-300'
            : 'bg-background-200 border border-background-200'
        }`}
      >
        <Text
          size="sm"
          className={`${
            selectedFilter === 'all'
              ? 'text-typography-900'
              : 'text-typography-600'
          }`}
        >
          Todos os clientes
        </Text>
      </Button>
    </HStack>
  );
};
