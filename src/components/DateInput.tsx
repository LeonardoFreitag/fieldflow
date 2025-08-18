import {
  Button,
  ButtonIcon,
  Input as GluestackInput,
  HStack,
  InputField,
} from '@gluestack-ui/themed';
import { Calendar1 } from 'lucide-react-native';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField> & {
  buttonPress?: () => void;
};

export function DateInput({ buttonPress, ...rest }: Props) {
  return (
    <HStack alignItems="center" width="$full">
      <GluestackInput
        bg="$trueGray900"
        h="$12"
        // px="$1"
        borderWidth="$1"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: '$green500',
        }}
        flex={1}
      >
        <InputField
          color="$trueGray100"
          fontSize="$sm"
          fontFamily="$body"
          placeholderTextColor="$trueGray400"
          {...rest}
        />
        <Button
          h="$12"
          w="$12"
          rounded="$md"
          backgroundColor="$trueGray900"
          $active-bg="$trueGray500"
          onPress={buttonPress}
        >
          <ButtonIcon as={Calendar1} size="xl" height="$12" />
        </Button>
      </GluestackInput>
    </HStack>
  );
}
