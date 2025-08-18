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
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect } from 'react';
import { AppError } from '@utils/AppError';

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

  const { signIn, user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInSchema),
    defaultValues: {
      email: 'antoniomelo@htcode.net',
      password: '123',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    const { email, password } = data;

    try {
      const isAuth = await signIn(email, password);
      if (!isAuth) {
        return;
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

  // useEffect(() => {
  //   const checkUser = async () => {
  //     if (user?.user && user.user.id) {
  //       try {
  //         const response = await api.get<CustomerModel>(`/customer/byId`, {
  //           params: {
  //             id: user.customer_id,
  //           },
  //         });

  //         if (response.status !== 200) {
  //           return;
  //         }

  //         dispacth(addCustomerEdit(response.data));

  //         navigation.navigate('AdmMenu');
  //       } catch (error) {
  //         Toast.show({
  //           type: 'info',
  //           text1: 'Login',
  //           text2: 'Você precisa realizar novo login 👋',
  //           position: 'bottom',
  //         });
  //       }
  //     }
  //   };
  //   checkUser();
  // }, [dispacth, navigation, user]);

  // useEffect(() => {
  //   if (user?.user && user.user.id) {
  //     navigation.navigate('AppRoutes', { screen: 'MenuRoutes' });
  //   }
  // }, [navigation, user]);

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
              <Button title="Acessar" onPress={handleSubmit(handleLogin)} />
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
