import { ClientCard } from '@components/ClientCard';
import { HomeHeader } from '@components/HomeHeader';
import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { customerList } from '@utils/CustomerData';
import { type CustomerModel } from '../models/CustomerModel';
import { FlatList } from 'react-native';

export function SaleRoute() {
  const navigation = useNavigation();

  function handleSelectCustomer() {
    navigation.navigate('AppRoutes', { screen: 'SaleList' });
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      <VStack flex={1} px="$4" py="$4">
        <HStack gap="$4" justifyContent="space-between" mb="$4">
          <Heading size="sm" color="$trueGray100">
            Sua rota
          </Heading>
          <Text color="$trueGray400">{`${customerList.length} clientes`}</Text>
        </HStack>
        <FlatList
          data={customerList}
          keyExtractor={(item: CustomerModel) => item.id}
          renderItem={({ item }) => (
            <ClientCard
              data={item}
              handleSelectCustomer={handleSelectCustomer}
            />
          )}
        />
      </VStack>
    </VStack>
  );
}
