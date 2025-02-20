import {
  VStack,
  // Image,
  Center,
  Heading,
  Text,
  ScrollView,
} from '@gluestack-ui/themed';
// import BackgroundImage from '@assets/background.png';
import { Input } from '@components/Input';
import { CurrencyCircleDollar } from 'phosphor-react-native';
import { Button } from '@components/Button';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function SignIn() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('AppRoutes', { screen: 'MenuRoutes' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1}>
          <Center w={'$full'} mt={'$1/2'}>
            <CurrencyCircleDollar size={52} weight="fill" color="green" />
            <Heading size="2xl" color="$trueGray100">
              FieldFlow
            </Heading>
            <Text color="$trueGray100">Vendas, Entrega e Cobrança</Text>
          </Center>
          <VStack flex={1} px="$10" pb="$16">
            <Center w={'$full'} gap="$2" mt="$1/5">
              <Heading size="sm" color="$trueGray400">
                Acesse a conta
              </Heading>
              <Input
                placeholder="E-Mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
              />
              <Button title="Acessar" onPress={handleLogin} />
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
