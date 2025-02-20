import {
  Button,
  ButtonIcon,
  Center,
  Heading,
  VStack,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { customerList } from '@utils/CustomerData';
import { ChevronLeft, Plus } from 'lucide-react-native';
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
import { produtDataList } from '@utils/ProductData';

export function SaleAddNewItem() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [textTyped, setTextTyped] = React.useState('');
  const produtList = useAppSelector(state => state.productList);

  const filteredProducts = useMemo(() => {
    return produtList.filter(product =>
      product.name.toLowerCase().includes(textTyped.toLowerCase()),
    );
  }, [produtList, textTyped]);

  useEffect(() => {
    dispatch(loadProductList(produtDataList));
  }, []);

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

  const handleUpQty = useCallback((item: ProductModel) => {
    dispatch(
      updateProductList({
        ...item,
        qty: item.qty + 1,
      }),
    );
  }, []);

  const handleDownQty = useCallback((item: ProductModel) => {
    dispatch(
      updateProductList({
        ...item,
        qty: item.qty - 1,
      }),
    );
  }, []);

  return (
    <VStack flex={1}>
      <CustomerHeader data={customerList[0]} showBackButton={false} />
      <Heading size="lg" mx="$2" mt="$4" color="$trueGray100">
        Adicionar produto
      </Heading>
      <Center mt="$4" mx="$2">
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
      <Button
        size="lg"
        rounded="$full"
        position="absolute"
        bottom="$6"
        right="$6"
        w="$16"
        h="$16"
        backgroundColor="$green700"
        $active-bg="$green500"
      >
        <ButtonIcon as={Plus} size="xl" />
      </Button>
      <Button
        size="lg"
        rounded="$full"
        position="absolute"
        bottom="$6"
        left="$6"
        w="$16"
        h="$16"
        backgroundColor="$blue500"
        $active-bg="$blue700"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <ButtonIcon as={ChevronLeft} size="xl" />
      </Button>
    </VStack>
  );
}
