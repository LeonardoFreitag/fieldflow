import { HStack } from '@ui/hstack';
import { Switch } from '@ui/switch';
import { ScrollView } from '@ui/scroll-view';
import { Text } from '@ui/text';
import { Heading } from '@ui/heading';
import { Center } from '@ui/center';
import { VStack } from '@ui/vstack';
// import BackgroundImage from '@assets/background.png';
import { Input } from '@components/Input';
import { CurrencyCircleDollar } from 'phosphor-react-native';
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
import { Button, ButtonText } from '@ui/button';

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
        // Se a sua versão de NativeWind suportar, isto ajuda muito:
        // contentContainerClassName="flex-1 justify-center"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <VStack className="flex-1 bg-background-100 px-10 justify-center">
          {/* Header / Logo */}
          <Center className="items-center mb-10">
            <CurrencyCircleDollar size={52} weight="fill" color="green" />
            <Heading size="2xl" className="text-typography-white mt-4">
              AutoMax GO
            </Heading>
            <Text className="text-typography-500 mt-1">
              Vendas, Entrega e Cobrança
            </Text>
          </Center>

          {/* Form */}
          <VStack className="space-y-4">
            <Center className="items-start w-full gap-4">
              <Heading size="sm" className="text-typography-400">
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

              <HStack className="w-full items-center gap-2 mt-2 mb-2">
                <Switch
                  size="md"
                  isDisabled={false}
                  onValueChange={handleSwitchRemember}
                  value={remember}
                  className="bg-trueGray-600"
                />
                <Text className="text-white">Lembrar login</Text>
              </HStack>

              <Button
                onPress={handleSubmit(handleLogin)}
                className="w-full bg-green-600 active:bg-green-700"
              >
                <ButtonText className="text-typography-700">Entrar</ButtonText>
              </Button>
            </Center>
          </VStack>
          {/* Espaço para não colar no fundo quando teclado aparece */}
          <VStack className="h-8" />
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
