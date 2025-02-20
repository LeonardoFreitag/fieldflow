import { Input as GluestackInput, InputField } from '@gluestack-ui/themed';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField>;

export function Input({ ...rest }: Props) {
  return (
    <GluestackInput
      bg="$trueGray900"
      h="$12"
      px="$1"
      borderWidth="$1"
      borderRadius="$md"
      $focus={{
        borderWidth: 1,
        borderColor: '$green500',
      }}
    >
      <InputField
        color="$trueGray100"
        fontSize="$sm"
        fontFamily="$body"
        placeholderTextColor="$trueGray400"
        {...rest}
      />
    </GluestackInput>
  );
}
