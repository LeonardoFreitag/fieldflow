import { Center } from '@ui/center';
import { Icon } from '@ui/icon';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
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
    <HStack className="bg-background-200 pt-16 pb-5 px-8 items-center gap-4">
      {user?.user.avatarUrl && (
        <UserPhoto
          source={{ uri: user.user.avatarUrl }}
          className="h-16 w-16 border-outline-100"
          alt="photo"
        />
      )}
      {!user?.user.avatarUrl && (
        <Center className="h-16 w-16 bg-background-300 rounded-full border border-outline-500">
          <User color="#fff" />
        </Center>
      )}
      <VStack className="flex-1">
        <Text className="text-typography-700 text-sm">Olá</Text>
        <Heading className="text-typography-700 text-md">
          Leonardo Freitag
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={LogOut} size="xl" className="text-primary-50" />
      </TouchableOpacity>
    </HStack>
  );
}
