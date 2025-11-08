import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { FlatList } from 'react-native';
import { SaleCard } from '@components/SaleCard';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@store/store';
import { useMemo } from 'react';
import { SliderMainPage } from '@components/SliderMainPage';
import { type TravelClientOrdersModel } from '@models/TravelClientOrdersModel';
import { addTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import uuid from 'react-native-uuid';

export function SaleCheckIn() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const travelClientEdit = useAppSelector(state => state.travelClientEdit);
  const clientEdit = useAppSelector(state => state.clientEdit);

  function handleSaleSelect(editOrder: TravelClientOrdersModel) {
    dispatch(addTravelClientOrderEdit(editOrder));
    navigation.navigate('SaleNew');
  }

  function handleSaleNew() {
    dispatch(
      addTravelClientOrderEdit({
        id: uuid.v4(),
        travelClientId: travelClientEdit.id,
      } as TravelClientOrdersModel),
    );
    navigation.navigate('SaleNew');
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const fotosList: string[] = useMemo(() => {
    return clientEdit.ClientPhotos?.map(photo => {
      return photo.fileUrl || '';
    });
  }, [clientEdit.ClientPhotos]);

  return (
    <VStack className="flex-1 justify-start bg-trueGray-900 gap-2">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <VStack className="h-64 bg-trueGray-800 px-2 py-2">
        {fotosList && fotosList.length > 0 ? (
          <SliderMainPage photos={fotosList} />
        ) : (
          <Center className="h-full">
            <Heading size="md" className="text-trueGray-100">
              Nenhuma foto encontrada
            </Heading>
          </Center>
        )}
      </VStack>
      <VStack className="px-2 gap-2 flex-1">
        <Card className="bg-trueGray-800 h-72 px-4 py-2">
          <Heading size="sm" className="text-white mb-2 px-4">
            Pedidos anteriores
          </Heading>
          <FlatList
            data={clientEdit.LastOrders}
            keyExtractor={item =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            renderItem={({ item }) => (
              <SaleCard
                data={item}
                handleSaleRepeat={() => {
                  handleSaleSelect(item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center className="mt-1">
                <Heading size="md" className="text-trueGray-100">
                  Nenhum pedido encontrado
                </Heading>
              </Center>
            )}
          />
        </Card>
      </VStack>
      <HStack
        className="justify-between absolute bottom-0 left-0 bg-trueGray-900 w-[100%] h-24 p-2">
        <Button
          size="lg"
          onPress={handleBack}
          className="rounded-md w-24 h-12 bg-blue-500  active:bg-blue-700 gap-1">
          <ButtonIcon as={ChevronLeft} size="xl" />
          <Text size="xs" className="text-trueGray-100">
            Voltar
          </Text>
        </Button>
        <Button
          size="lg"
          onPress={handleSaleNew}
          className="rounded-md w-24 h-12 bg-green-700  active:bg-green-500 gap-1">
          <ButtonIcon as={Plus} size="xl" />
          <Text size="xs" className="text-trueGray-100">
            Pedido
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
