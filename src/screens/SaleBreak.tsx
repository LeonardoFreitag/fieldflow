import { Button, ButtonIcon, Center, VStack } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { customerList } from '@utils/CustomerData';
import { Save, X } from 'lucide-react-native';
import { TextArea } from '@components/TextArea';

export function SaleBreak() {
  const navigation = useNavigation();

  function handleSaveData() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <CustomerHeader data={customerList[0]} showBackButton={false} />
      <Center mt="$4" mx="$2">
        <TextArea placeholder="Informe o motivo da não realização da visita..." />
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
        onPress={handleSaveData}
      >
        <ButtonIcon as={Save} size="xl" />
      </Button>
      <Button
        size="lg"
        rounded="$full"
        position="absolute"
        bottom="$6"
        left="$6"
        w="$16"
        h="$16"
        backgroundColor="$red700"
        $active-bg="$red500"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <ButtonIcon as={X} size="xl" />
      </Button>
    </VStack>
  );
}
