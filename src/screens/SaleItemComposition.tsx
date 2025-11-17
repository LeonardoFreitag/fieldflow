import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Center } from '@ui/center';
import { Button, ButtonIcon } from '@ui/button';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { ChevronLeft } from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import { FlatList } from 'react-native';
import { SaleItemCompositionCard } from '@components/SaleItemCompositionCard';
import { useMemo } from 'react';

export function SaleItemComposition() {
  const navigation = useNavigation();
  const clientEdit = useAppSelector(state => state.clientEdit);
  const travelClientOrderItemEdit = useAppSelector(
    state => state.travelClientOrderItemEdit,
  );

  const totalComposition = useMemo(() => {
    if (!travelClientOrderItemEdit.TravelClientOrdersItemsComposition) {
      return 0;
    }
    return travelClientOrderItemEdit.TravelClientOrdersItemsComposition.reduce(
      (acc, item) => {
        if (item.removed) return acc;
        return acc + (Number(item.pQuantity) * Number(item.pPrice) || 0);
      },
      0,
    );
  }, [travelClientOrderItemEdit.TravelClientOrdersItemsComposition]);

  return (
    <VStack className="flex-1">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Heading size="lg" className="mx-2 mt-4 text-typography-700">
        {`${travelClientOrderItemEdit.description} - ${totalComposition?.toLocaleString(
          'pt-BR',
          { style: 'currency', currency: 'BRL' },
        )}`}
      </Heading>
      <Center className="mt-4 mx-2 flex-1">
        <FlatList
          data={travelClientOrderItemEdit.TravelClientOrdersItemsComposition}
          keyExtractor={saleItem =>
            saleItem.id?.toString() ?? Math.random().toString()
          }
          renderItem={({ item }) => (
            <SaleItemCompositionCard travelClientOrderItemComposition={item} />
          )}
        />
      </Center>
      <HStack className="justify-between absolute bottom-0 left-0 bg-background-200 w-[100%] h-24 p-2">
        <Button
          size="lg"
          onPress={() => {
            navigation.goBack();
          }}
          className="rounded-md w-24 h-12 bg-info-300  active:bg-info-400 gap-1"
        >
          <ButtonIcon
            as={ChevronLeft}
            size="xl"
            className="text-typography-700"
          />
          <Text size="xs" className="text-typography-700">
            Voltar
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
