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
import { CalendarOff, ChevronLeft, Plus, X } from 'lucide-react-native';
import { FlatList } from 'react-native';
import { salesList as saleListData } from '@utils/SaleData';
import { SaleCard } from '@components/SaleCard';
import { useDispatch } from 'react-redux';
import { addSaleEdit } from '../store/slice/sale/saleEditSlice';
import { useAppSelector } from '@store/store';
import { useEffect } from 'react';
import { loadSaleList } from '@store/slice/sale/saleListSlice';
import { type SaleModel } from '@models/SaleModel';

export function SaleList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const saleList = useAppSelector(state => state.saleList);

  function handleSaleSelect(sale: SaleModel) {
    dispatch(addSaleEdit(sale));
    navigation.navigate('SaleNew');
  }

  function handleNavigateSaleBreak() {
    navigation.navigate('SaleBreak');
  }

  function handleSaleNew() {
    dispatch(addSaleEdit(saleList[0]));
    navigation.navigate('SaleNew');
  }

  useEffect(() => {
    dispatch(loadSaleList(saleListData));
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <VStack flex={1}>
      <CustomerHeader data={customerList[0]} showBackButton={false} />
      <Center mt="$4" mx="$2">
        <Heading size="lg" color="$trueGray100">
          Últimos pedidos
        </Heading>
        <FlatList
          data={saleList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SaleCard
              data={item}
              handleSelectCustomer={() => {
                handleSaleSelect(item);
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
        onPress={handleSaleNew}
      >
        <ButtonIcon as={Plus} size="xl" />
      </Button>
      <Button
        size="lg"
        rounded="$full"
        position="absolute"
        top="$16"
        right="$6"
        w="$16"
        h="$16"
        backgroundColor="$red700"
        $active-bg="$red500"
        onPress={handleNavigateSaleBreak}
      >
        <ButtonIcon as={CalendarOff} size="xl" />
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
        onPress={handleBack}
      >
        <ButtonIcon as={ChevronLeft} size="xl" />
      </Button>
    </VStack>
  );
}
