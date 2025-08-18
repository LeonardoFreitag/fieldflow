import {
  Button,
  ButtonIcon,
  Center,
  Heading,
  VStack,
  HStack,
  Text,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { ChevronLeft, Plus, Save } from 'lucide-react-native';
import { OrderItemCard } from '@components/OrderItemCard';
import { useAppSelector } from '../store/store';
import { FlatList } from 'react-native';
import React, { useMemo } from 'react';
import { type TravelClientOrdersItemsModel } from '@models/TravelClientOrdersItemsModel';
import { useDispatch } from 'react-redux';
import { addTravelClientOrderItemsEdit } from '@store/slice/travel/travelClientOrderItemEditSlice';

export function SaleNew() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const clientEdit = useAppSelector(state => state.clientEdit);
  const travelClientOrderEdit = useAppSelector(
    state => state.travelClientOrderEdit,
  );

  function handleAddSaleItem() {
    dispatch(addTravelClientOrderItemsEdit({} as TravelClientOrdersItemsModel));
    navigation.navigate('SaleAddNewItem');
  }

  const orderTotal = useMemo(() => {
    if (!travelClientOrderEdit.TravelClientOrdersItems) {
      return 0;
    }
    return travelClientOrderEdit.TravelClientOrdersItems.reduce(
      (acc: number, saleItem: TravelClientOrdersItemsModel) => {
        let itemPrice = Number(saleItem.price);

        // Se o item tem composições, calcula o preço baseado nelas
        if (
          saleItem.TravelClientOrdersItemsComposition &&
          saleItem.TravelClientOrdersItemsComposition.length > 0
        ) {
          itemPrice = saleItem.TravelClientOrdersItemsComposition.reduce(
            (compAcc, composition) => {
              if (composition.removed) return compAcc;
              return (
                compAcc +
                Number(composition.pQuantity) * Number(composition.pPrice)
              );
            },
            0,
          );
        }

        return acc + Number(saleItem.quantity) * itemPrice;
      },
      0,
    );
  }, [travelClientOrderEdit.TravelClientOrdersItems]);

  function handleSaleFinish() {
    navigation.navigate('SaleFinish');
  }

  return (
    <VStack flex={1}>
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Heading size="sm" mx="$1" mt="$1" color="$trueGray100">
        Novo pedido
      </Heading>
      <HStack justifyContent="space-between">
        <Heading size="sm" mx="$1" mt="$1" color="$trueGray100">
          {`Itens: ${
            travelClientOrderEdit.TravelClientOrdersItems
              ? travelClientOrderEdit.TravelClientOrdersItems.length
              : 0
          }`}
        </Heading>
        <Heading size="sm" mx="$1" mt="$1" color="$green500">
          {`Total: ${orderTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Heading>
      </HStack>
      <Center mt="$1" mx="$2" flex={1} mb="$24">
        <FlatList
          data={travelClientOrderEdit.TravelClientOrdersItems}
          keyExtractor={orderItem =>
            orderItem.id !== undefined
              ? orderItem.id.toString()
              : Math.random().toString()
          }
          renderItem={({ item }) => <OrderItemCard productItem={item} />}
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
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$green700"
          $active-bg="$green500"
          onPress={handleSaleFinish}
          gap="$1"
        >
          <ButtonIcon as={Save} size="lg" />
          <Text color="$trueGray100" size="xs">
            Finalizar
          </Text>
        </Button>
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$green700"
          $active-bg="$green500"
          onPress={handleAddSaleItem}
          gap="$1"
        >
          <ButtonIcon as={Plus} size="xl" />
          <Text color="$trueGray100" size="xs">
            Produto
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
