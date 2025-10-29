import {
  Button,
  ButtonIcon,
  Center,
  Heading,
  HStack,
  VStack,
  Text,
  Card,
} from '@gluestack-ui/themed';
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
    <VStack
      flex={1}
      justifyContent="flex-start"
      backgroundColor="$trueGray900"
      gap="$2"
    >
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <VStack height="$64" bgColor="$trueGray800" px="$2" py="$2">
        {fotosList && fotosList.length > 0 ? (
          <SliderMainPage photos={fotosList} />
        ) : (
          <Center height="$full">
            <Heading size="md" color="$trueGray100">
              Nenhuma foto encontrada
            </Heading>
          </Center>
        )}
      </VStack>
      <VStack px="$2" gap="$2" flex={1}>
        <Card backgroundColor="$trueGray800" height="$72" px="$4" py="$2">
          <Heading size="sm" color="$white" mb="$2" px="$4">
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
              <Center mt="$1">
                <Heading size="md" color="$trueGray100">
                  Nenhum pedido encontrado
                </Heading>
              </Center>
            )}
          />
        </Card>
      </VStack>

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
          onPress={handleBack}
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
          onPress={handleSaleNew}
          gap="$1"
        >
          <ButtonIcon as={Plus} size="xl" />
          <Text color="$trueGray100" size="xs">
            Pedido
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
