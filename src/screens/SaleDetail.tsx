import { Box, Button, ButtonIcon, Center, VStack } from '@gluestack-ui/themed';
import { CustomerHeader } from '@components/CustomerHeader';
import { customerList } from '@utils/CustomerData';
import { Plus } from 'lucide-react-native';
import { salesList } from '@utils/SaleData';
import { FlatList } from 'react-native';
import { ItemCard } from '@components/ItemCard';
import { SaleCardDetail } from '@components/SaleCardDetail';

export function SaleDetail() {
  const items = salesList[0].saleItems;

  function handleSaleSelect() {
    // navigation.navigate('AppRouter', { screen: 'SaleDetail' });
  }

  return (
    <VStack flex={1}>
      <CustomerHeader data={customerList[0]} />
      <Center mt="$4" mx="$2">
        <SaleCardDetail
          data={salesList[0]}
          handleSelectCustomer={handleSaleSelect}
        />
      </Center>
      <Box mt="$4" mx="$2">
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ItemCard data={item} handleSelectCustomer={handleSaleSelect} />
          )}
        />
      </Box>

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
        <ButtonIcon as={Plus} />
      </Button>
    </VStack>
  );
}
