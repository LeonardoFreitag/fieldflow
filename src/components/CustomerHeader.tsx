import {
  HStack,
  Text,
  Heading,
  VStack,
  Icon,
  Button,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { UserPhoto } from './UserPhoto';
import { ChevronLeft } from 'lucide-react-native';
import { type CustomerModel } from '../models/CustomerModel';
import { TouchableOpacity } from 'react-native';

interface CustomerHeaderProps {
  data: CustomerModel;
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

  return (
    <TouchableOpacity>
      <HStack
        bg="$trueGray700"
        pt="$16"
        pb="$5"
        px="$8"
        alignItems="center"
        gap="$4"
      >
        <UserPhoto source={{ uri: data.logo }} h="$16" w="$16" alt="photo" />
        <VStack flex={1}>
          <Heading size="sm" color="$trueGray100">
            {data.name}
          </Heading>
          <Text color="$trueGray400">{data.address}</Text>
        </VStack>
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
    </TouchableOpacity>
  );
}
