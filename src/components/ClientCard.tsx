import {
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Icon,
} from '@gluestack-ui/themed';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { type CustomerModel } from '../models/CustomerModel';

type Props = TouchableOpacityProps & {
  data: CustomerModel;
  handleSelectCustomer: () => void;
};

export function ClientCard({ data, handleSelectCustomer, ...rest }: Props) {
  return (
    <TouchableOpacity onPress={handleSelectCustomer} {...rest}>
      <HStack
        bg="$trueGray700"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
        w="$full"
        justifyContent="space-between"
      >
        <Image
          source={{
            uri: data.logo,
          }}
          alt="Client Logo"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading size="sm" color="$trueGray100">
            {data.name}
          </Heading>
          <Text color="$trueGray400">{data.address}</Text>
        </VStack>
        <Icon as={CheckCheck} color="$green400" />
      </HStack>
    </TouchableOpacity>
  );
}
