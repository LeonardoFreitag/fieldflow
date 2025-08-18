import {
  HStack,
  Text,
  Heading,
  VStack,
  Icon,
  Button,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { type ClientModel } from '@models/ClientModel';

interface CustomerHeaderProps {
  data: ClientModel;
  showBackButton?: boolean;
}

export function CustomerHeaderDelivery({
  data,
  showBackButton = true,
}: CustomerHeaderProps) {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <HStack
      bg="$trueGray700"
      pt="$16"
      pb="$5"
      px="$8"
      alignItems="center"
      gap="$4"
      justifyContent="space-between"
    >
      {/* <UserPhoto source={{ uri: data.logo }} h="$16" w="$16" alt="photo" /> */}
      <VStack flex={1}>
        <Heading
          size="xs"
          color="$trueGray100"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {data.companyName}
        </Heading>
        <Text
          color="$trueGray400"
          size="xs"
        >{`${data.streetName}, ${data.streetNumber}`}</Text>
        <Text
          color="$trueGray400"
          size="xs"
        >{`Bairro ${data.neighborhood}, ${data.streetNumber}`}</Text>
        <Text
          color="$trueGray400"
          size="xs"
        >{`${data.city} - ${data.state}, ${data.zipCode}`}</Text>
        <Text
          color="$trueGray400"
          size="xs"
        >{`Cel. ${data.cellphone ?? '-'}`}</Text>
      </VStack>
      {/* <Button
        size="lg"
        rounded="$lg"
        // position="absolute"
        // top="$16"
        // right="$6"
        w="$16"
        h="$16"
        backgroundColor="$red700"
        $active-bg="$red500"
        onPress={handleNavigateSaleBreak}
      >
        <ButtonIcon as={CalendarOff} size="xl" />
      </Button> */}
      {showBackButton && (
        <Button
          size="lg"
          backgroundColor="$trueGray700"
          $active-bg="$trueGray700"
          onPress={handleGoBack}
          variant="outline"
          borderColor="$trueGray400"
        >
          <Icon as={ChevronLeft} size="xl" color="$trueGray400" />
        </Button>
      )}
    </HStack>
  );
}
