import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
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
    <VStack className="flex-1">
      <CustomerHeader data={customerList[0] as any} />
      <Center className="mt-4 mx-2">
        <SaleCardDetail
          data={salesList[0]}
          handleSelectCustomer={handleSaleSelect}
        />
      </Center>
      <Box className="mt-4 mx-2">
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
        className="rounded-full absolute bottom-6 right-6 w-16 h-16 bg-green-700  active:bg-green-500">
        <ButtonIcon as={Plus} />
      </Button>
    </VStack>
  );
}
