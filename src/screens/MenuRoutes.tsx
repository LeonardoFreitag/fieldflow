import { HomeHeader } from '@components/HomeHeader';
import {
  Button,
  ButtonIcon,
  Heading,
  SafeAreaView,
  VStack,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { HandCoins, ShoppingCart, Truck } from 'lucide-react-native';

export function MenuRoutes() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <VStack px="$4" py="$4" gap="$12" height="$full" justifyContent="center">
        <Button
          variant="outline"
          borderColor="$trueGray300"
          $active-bg="$trueGray800"
          gap="$8"
          height="$20"
          onPress={() => {
            navigation.navigate('SaleRoute');
          }}
        >
          <ButtonIcon as={ShoppingCart} size="xl" color="$trueGray300" />
          <Heading size="md" color="$trueGray300">
            Vendas
          </Heading>
        </Button>
        <Button
          variant="outline"
          borderColor="$trueGray300"
          $active-bg="$trueGray800"
          gap="$8"
          height="$20"
        >
          <ButtonIcon as={Truck} size="xl" color="$trueGray300" />
          <Heading size="md" color="$trueGray300">
            Entrega
          </Heading>
        </Button>
        <Button
          variant="outline"
          borderColor="$trueGray300"
          $active-bg="$trueGray800"
          gap="$8"
          height="$20"
        >
          <ButtonIcon as={HandCoins} size="xl" color="$trueGray300" />
          <Heading size="md" color="$trueGray300">
            Cobrança
          </Heading>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
