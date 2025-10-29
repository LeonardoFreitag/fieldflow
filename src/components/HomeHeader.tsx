import {
  HStack,
  Text,
  Heading,
  VStack,
  Icon,
  Center,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { UserPhoto } from './UserPhoto';
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { User } from 'phosphor-react-native';

export function HomeHeader() {
  const { user } = useAuth();

  const navigation = useNavigation();

  function handleSignOut() {
    navigation.navigate('AuthRoutes', { screen: 'SignIn' });
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
      {user?.user.avatarUrl && (
        <UserPhoto
          source={{ uri: user.user.avatarUrl }}
          h="$16"
          w="$16"
          alt="photo"
        />
      )}
      {!user?.user.avatarUrl && (
        <Center
          h="$16"
          w="$16"
          bg="$trueGray600"
          borderRadius="$full"
          borderWidth={1}
          borderColor="$trueGray500"
        >
          <User color="#fff" />
        </Center>
      )}
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
