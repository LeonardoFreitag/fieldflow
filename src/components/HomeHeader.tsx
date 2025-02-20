import { HStack, Text, Heading, VStack, Icon } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { UserPhoto } from './UserPhoto';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export function HomeHeader() {
  const navigation = useNavigation();

  function handleSignOut() {
    navigation.navigate('SignIn');
  }

  return (
    <HStack
      bg="$trueGray700"
      pt="$16"
      pb="$5"
      px="$8"
      alignItems="center"
      gap="$4"
    >
      <UserPhoto
        source={{ uri: 'https://github.com/leonardofreitag.png' }}
        h="$16"
        w="$16"
        alt="photo"
      />
      <VStack flex={1}>
        <Text color="$trueGray200" fontSize="$sm">
          Olá
        </Text>
        <Heading color="$trueGray100" fontSize="$md">
          Leonardo Freitag
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={LogOut} size="xl" color="$trueGray400" />
      </TouchableOpacity>
    </HStack>
  );
}
