import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Center } from '@ui/center';
import { Button, ButtonIcon } from '@ui/button';
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
    return (
      travelClientOrderEdit.TravelClientOrdersItems as unknown as TravelClientOrdersItemsModel[]
    ).reduce((acc: number, saleItem: TravelClientOrdersItemsModel) => {
      let itemPrice = Number(saleItem.price);

      // Se o item tem composições, calcula o preço baseado nelas
      if (
        saleItem.TravelClientOrdersItemsComposition &&
        saleItem.TravelClientOrdersItemsComposition.length > 0
      ) {
        itemPrice = saleItem.TravelClientOrdersItemsComposition.reduce(
          (compAcc: number, composition: any) => {
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
    }, 0);
  }, [travelClientOrderEdit.TravelClientOrdersItems]);

  function handleSaleFinish() {
    navigation.navigate('SaleFinish');
  }

  return (
    <VStack className="flex-1">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Heading size="sm" className="mx-1 mt-1 text-typography-700">
        Novo pedido
      </Heading>
      <HStack className="justify-between">
        <Heading size="sm" className="mx-1 mt-1 text-typography-700">
          {`Itens: ${
            travelClientOrderEdit.TravelClientOrdersItems
              ? travelClientOrderEdit.TravelClientOrdersItems.length
              : 0
          }`}
        </Heading>
        <Heading size="sm" className="mx-1 mt-1 text-success-600">
          {`Total: ${orderTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Heading>
      </HStack>
      <Center className="mt-1 mx-2 flex-1 mb-24">
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
      <HStack className="justify-between absolute bottom-0 left-0 bg-background-100 w-[100%] h-24 p-2">
        <Button
          size="lg"
          onPress={() => {
            navigation.goBack();
          }}
          className="rounded-md w-32 h-12 bg-info-300  active:bg-info-400 gap-1"
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
        <Button
          size="lg"
          onPress={handleSaleFinish}
          className="rounded-md w-32 h-12 bg-success-300  active:bg-success-400 gap-1"
        >
          <ButtonIcon as={Save} size="lg" className="text-typography-700" />
          <Text size="xs" className="text-typography-700">
            Finalizar
          </Text>
        </Button>
        <Button
          size="lg"
          onPress={handleAddSaleItem}
          className="rounded-md w-32 h-12 bg-success-300  active:bg-success-400 gap-1"
        >
          <ButtonIcon as={Plus} size="xl" className="text-typography-700" />
          <Text size="xs" className="text-typography-700">
            Produto
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
