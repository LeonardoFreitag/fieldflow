import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { CheckCheck, ChevronLeft, X } from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import { FlatList } from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ProductCard } from '@components/ProductCard';
import { useDispatch } from 'react-redux';
import {
  loadProductList,
  updateProductList,
} from '@store/slice/product/productListSlice';
import { type ProductModel } from '@models/ProductModel';
import uuid from 'react-native-uuid';
import { updateTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import { api } from '@services/api';
import { Input } from '@components/Input';

export function SaleAddNewItem() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [textTyped, setTextTyped] = React.useState('');
  const productList = useAppSelector(state => state.productList);
  const clientEdit = useAppSelector(state => state.clientEdit);
  const travelClientOrderEdit = useAppSelector(
    state => state.travelClientOrderEdit,
  );

  const filteredProducts = useMemo(() => {
    return productList.filter(product =>
      product.description.toLowerCase().includes(textTyped.toLowerCase()),
    );
  }, [productList, textTyped]);

  const handleSelectProduct = useCallback(
    (item: ProductModel) => {
      dispatch(
        updateProductList({
          ...item,
          selected: !item.selected,
        }),
      );
    },
    [dispatch],
  );

  const handleUpQty = useCallback(
    (item: ProductModel) => {
      dispatch(
        updateProductList({
          ...item,
          qty: Number(item.qty) + 1,
        }),
      );
    },
    [dispatch],
  );

  const handleDownQty = useCallback(
    (item: ProductModel) => {
      dispatch(
        updateProductList({
          ...item,
          qty: Number(item.qty) - 1,
        }),
      );
    },
    [dispatch],
  );

  const productsSelected = useMemo(() => {
    return productList.filter(product => product.selected);
  }, [productList]);

  const totalProductsSelected = useMemo(() => {
    return productsSelected.reduce(
      (acc, product) => acc + Number(product.qty) * Number(product.price),
      0,
    );
  }, [productsSelected]);

  const handleInsertProducts = useCallback(() => {
    dispatch(
      updateTravelClientOrderEdit({
        ...travelClientOrderEdit,
        TravelClientOrdersItems: [
          ...(travelClientOrderEdit.TravelClientOrdersItems ?? []),
          ...productsSelected.map(product => {
            const travelClientOrderItemId = uuid.v4().toString();
            // const now = new Date().toISOString();
            return {
              id: travelClientOrderItemId,
              travelClientOrderId: travelClientOrderEdit.id ?? '',
              productId: product.id,
              code: product.code,
              reference: product.reference,
              description: product.description,
              unity: product.unity,
              price: product.price ?? 0,
              quantity: product.qty ?? 0,
              amount: Number(product.qty) * Number(product.price ?? 0),
              notes: null,
              isDeleted: false,
              isComposed: product.isComposed,
              tableCode: clientEdit.tableCode ?? '',
              TravelClientOrdersItemsComposition:
                product.ProductComposition?.map(composition => ({
                  id: composition.id ?? uuid.v4().toString(),
                  travelClientOrdersItemsId: travelClientOrderItemId ?? '',
                  productId: composition.productId,
                  stockId: composition.stockId,
                  pCode: composition.pCode,
                  pReference: composition.pReference,
                  pDescription: composition.pDescription,
                  pUnity: composition.pUnity,
                  pQuantity: composition.pQuantity,
                  pPrice: composition.pPrice,
                  pAmount: composition.pAmount,
                  removed: false,
                  tableCode: clientEdit.tableCode ?? '',
                })),
            };
          }),
        ],
      }),
    );
    navigation.goBack();
  }, [
    clientEdit.tableCode,
    dispatch,
    navigation,
    productsSelected,
    travelClientOrderEdit,
  ]);

  useEffect(() => {
    const fechtProducts = async () => {
      try {
        const response = await api.get<ProductModel[]>(
          '/product/listByTablePriceCode',
          {
            params: {
              customerId: clientEdit.customerId,
              tableCode: clientEdit.tableCode,
            },
          },
        );
        const products: ProductModel[] = response.data.map(product => ({
          ...product,
          selected: false,
          price: product.ProductPrice?.[0]?.price ?? 0,
          qty: 1,
        }));
        dispatch(loadProductList(products));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fechtProducts();
  }, [
    clientEdit,
    clientEdit.customerId,
    clientEdit.id,
    clientEdit.tableCode,
    dispatch,
  ]);

  return (
    <VStack className="flex-1">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Heading size="sm" className="mx-1 mt-1 text-trueGray-100">
        Adicionar produto
      </Heading>
      <HStack className="justify-between">
        <Heading size="xs" className="mx-1 mt-1 text-trueGray-100">
          {`Selecionados: ${productsSelected.length}`}
        </Heading>
        <Heading size="xs" className="mx-1 mt-1 text-green-500">
          {`Total: ${totalProductsSelected.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        </Heading>
      </HStack>
      <HStack className="mx-1 mt-1 mb-1 w-full bg-trueGray-600 p-2 rounded-md gap-2">
        <Input
          placeholder="Pesquise por produto..."
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={setTextTyped}
          value={textTyped}
          w="$full"
        />
        <Button
          size="lg"
          onPress={() => {
            setTextTyped('');
          }}
          className="rounded-md w-12 h-12 gap-1">
          <ButtonIcon as={X} size="xl" />
        </Button>
      </HStack>
      <Center className="mt-2 mx-2">
        <FlatList
          data={filteredProducts}
          keyExtractor={prod => prod.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              handleSelectProduct={() => {
                handleSelectProduct(item);
              }}
              handleUpQty={() => {
                handleUpQty(item);
              }}
              handleDownQty={() => {
                handleDownQty(item);
              }}
            />
          )}
        />
      </Center>
      <HStack
        className="justify-between absolute bottom-0 left-0 bg-trueGray-900 w-[100%] h-24 p-2">
        <Button
          size="lg"
          onPress={() => {
            navigation.goBack();
          }}
          className="rounded-md w-24 h-12 bg-blue-500  active:bg-blue-700 gap-1">
          <ButtonIcon as={ChevronLeft} size="xl" />
          <Text size="xs" className="text-trueGray-100">
            Voltar
          </Text>
        </Button>
        <Button
          size="lg"
          onPress={handleInsertProducts}
          className="rounded-md w-24 h-12 bg-green-700  active:bg-green-500 gap-1">
          <ButtonIcon as={CheckCheck} size="xl" />
          <Text size="xs" className="text-trueGray-100">
            Inserir
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
