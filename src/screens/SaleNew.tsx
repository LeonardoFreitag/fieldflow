import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  Heading,
  VStack,
  Text,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { customerList } from '@utils/CustomerData';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { SaleItemCard } from '@components/SaleItemCard';
import { useAppSelector } from '../store/store';
import { FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function SaleNew() {
  const navigation = useNavigation();
  const saleEdit = useAppSelector(state => state.saleEdit);

  function handleAddSaleItem() {
    navigation.navigate('SaleAddNewItem');
  }

  return (
    <VStack flex={1}>
      <CustomerHeader data={customerList[0]} showBackButton={false} />
      <Heading size="lg" mx="$2" mt="$4" color="$trueGray100">
        Novo pedido / Editar pedido
      </Heading>
      <Center mt="$4" mx="$2">
        <FlatList
          data={saleEdit.saleItems}
          keyExtractor={saleItem => saleItem.id.toString()}
          renderItem={({ item }) => <SaleItemCard saleItem={item} />}
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
        onPress={handleAddSaleItem}
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
      {/* <AddNewItem /> */}
    </VStack>
  );
}

const AddNewItem = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
