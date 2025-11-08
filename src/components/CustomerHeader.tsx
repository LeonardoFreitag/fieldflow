import { Button, ButtonIcon } from '@ui/button';
import { Icon } from '@ui/icon';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import { useNavigation } from '@react-navigation/native';
import { CalendarOff, ChevronLeft } from 'lucide-react-native';
import { type ClientModel } from '@models/ClientModel';

interface CustomerHeaderProps {
  data: ClientModel;
  showBackButton?: boolean;
}

export function CustomerHeader({
  data,
  showBackButton = true,
}: CustomerHeaderProps) {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleNavigateSaleBreak() {
    navigation.navigate('SaleVisitFailure');
  }

  return (
    <HStack className="bg-trueGray-700 pt-16 pb-5 px-8 items-center gap-4 justify-between">
      {/* <UserPhoto source={{ uri: data.logo }} h="$16" w="$16" alt="photo" /> */}
      <VStack className="flex-1">
        <Heading
          size="xs"
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-trueGray-100"
        >
          {data.companyName}
        </Heading>
        <Text
          size="xs"
          className="text-trueGray-400"
        >{`${data.streetName}, ${data.streetNumber}`}</Text>
        <Text
          size="xs"
          className="text-trueGray-400"
        >{`Bairro ${data.neighborhood}, ${data.streetNumber}`}</Text>
        <Text
          size="xs"
          className="text-trueGray-400"
        >{`${data.city} - ${data.state}, ${data.zipCode}`}</Text>
        <Text
          size="xs"
          className="text-trueGray-400"
        >{`Cel. ${data.cellphone ?? '-'}`}</Text>
      </VStack>
      <Button
        size="lg"
        onPress={handleNavigateSaleBreak}
        className="rounded-lg w-16 h-16 bg-red-700  active:bg-red-500"
      >
        <ButtonIcon as={CalendarOff} size="xl" />
      </Button>
      {showBackButton && (
        <Button
          size="lg"
          onPress={handleGoBack}
          variant="outline"
          className="bg-trueGray-700  active:bg-trueGray-700 border-trueGray-400"
        >
          <Icon as={ChevronLeft} size="xl" className="text-trueGray-400" />
        </Button>
      )}
    </HStack>
  );
}
