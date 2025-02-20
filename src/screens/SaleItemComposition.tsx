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
import { ChevronLeft, Save, X } from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import { FlatList } from 'react-native';
import { SaleItemCompositionCard } from '@components/SaleItemCompositionCard';

export function SaleItemComposition() {
  const navigation = useNavigation();
  const saleItemEdit = useAppSelector(state => state.saleItemEdit);

  function handleSaveData() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <CustomerHeader data={customerList[0]} showBackButton={false} />
      <Heading size="lg" mx="$2" mt="$4" color="$trueGray100">
        {`Composição item ${saleItemEdit.product}`}
      </Heading>
      <Center mt="$4" mx="$2">
        <FlatList
          data={saleItemEdit.composition}
          keyExtractor={saleItem => saleItem.id.toString()}
          renderItem={({ item }) => (
            <SaleItemCompositionCard saleItemComposition={item} />
          )}
        />
      </Center>
      {/* <Button
        size="lg"
        rounded="$full"
        position="absolute"
        bottom="$6"
        right="$6"
        w="$16"
        h="$16"
        backgroundColor="$green700"
        $active-bg="$green500"
        onPress={handleSaveData}
      >
        <ButtonIcon as={Save} size="xl" />
      </Button> */}
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
