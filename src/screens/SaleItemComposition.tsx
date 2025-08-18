import {
  Button,
  ButtonIcon,
  Center,
  Heading,
  HStack,
  VStack,
  Text,
} from '@gluestack-ui/themed';
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
    <VStack flex={1}>
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Heading size="lg" mx="$2" mt="$4" color="$trueGray100">
        {`${travelClientOrderItemEdit.description} - ${totalComposition?.toLocaleString(
          'pt-BR',
          { style: 'currency', currency: 'BRL' },
        )}`}
      </Heading>
      <Center mt="$4" mx="$2" flex={1}>
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
      <HStack
        justifyContent="space-between"
        position="absolute"
        bottom="$0"
        left="$0"
        backgroundColor="$trueGray900"
        width="100%"
        height="$24"
        padding="$2"
      >
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$blue500"
          $active-bg="$blue700"
          onPress={() => {
            navigation.goBack();
          }}
          gap="$1"
        >
          <ButtonIcon as={ChevronLeft} size="xl" />
          <Text color="$trueGray100" size="xs">
            Voltar
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
