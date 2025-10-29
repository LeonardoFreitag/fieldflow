import {
  VStack,
  // Image,
  Center,
  Heading,
  Text,
  ScrollView,
  Switch,
  HStack,
} from '@gluestack-ui/themed';
// import BackgroundImage from '@assets/background.png';
import { Input } from '@components/Input';
import { CurrencyCircleDollar } from 'phosphor-react-native';
import { Button } from '@components/Button';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { AppError } from '@utils/AppError';
import { loginGet } from '@storage/login/loginGet';
import { loginCreate } from '@storage/login/loginCreate';
import { loginDelete } from '@storage/login/loginDelete';
import { type LoginModel } from '@models/LoginModel';

const SignInSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
});

interface LoginFormData {
  email: string;
  password: string;
}

export function SignIn() {
  const navigation = useNavigation();
  const [remember, setRemember] = useState(false);

  const { signIn, user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    const { email, password } = data;

    try {
      const isAuth = await signIn(email, password);
      if (!isAuth) {
        return;
      }

      // Salva ou apaga o login conforme o estado do Switch
      if (remember) {
        const dataLogin: LoginModel = {
          email,
          password,
          rememberMe: true,
        };
        await loginCreate(dataLogin);
      } else {
        await loginDelete();
      }

      navigation.navigate('AppRoutes', { screen: 'MenuRoutes' });
    } catch (error) {
      const isApperror = error instanceof AppError;
      if (isApperror) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Não foi possível realizar o login');
      }
    }
  };

  useEffect(() => {
    const tryLoadLogin = async () => {
      const dataLogin = await loginGet();
      if (dataLogin.email && dataLogin.password) {
        setValue('email', dataLogin.email);
        setValue('password', dataLogin.password);
        setRemember(dataLogin.rememberMe);
      }
    };
    tryLoadLogin();
  }, [user, navigation, setValue]);

  const handleSwitchRemember = (value: boolean) => {
    setRemember(value);
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
              AutoMax GO
            </Heading>
            <Text color="$trueGray100">Vendas, Entrega e Cobrança</Text>
          </Center>
          <VStack flex={1} px="$10" pb="$16">
            <Center w={'$full'} gap="$2" mt="$1/5">
              <Heading size="sm" color="$trueGray400">
                Acesse a conta
              </Heading>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="E-Mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    // error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Senha"
                    secureTextEntry
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    // error={errors.password?.message}
                  />
                )}
              />
              <HStack
                w="$full"
                justifyContent="flex-start"
                alignItems="center"
                mt="$2"
                mb="$4"
                gap="$2"
              >
                <Switch
                  size="md"
                  isDisabled={false}
                  onValueChange={handleSwitchRemember}
                  value={remember}
                  bgColor="$trueGray600"
                />
                <Text color="$white">Lembrar login</Text>
              </HStack>
              <Button title="Acessar" onPress={handleSubmit(handleLogin)} />
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
