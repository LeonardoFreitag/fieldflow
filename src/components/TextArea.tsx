import {
  Textarea as GTextarea,
  TextareaInput,
  type InputField,
} from '@gluestack-ui/themed';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField>;

export function TextArea({ ...rest }: Props) {
  return (
    <GTextarea
      bg="$trueGray900"
      px="$1"
      borderWidth="$1"
      borderRadius="$md"
      borderColor="$trueGray500"
      $focus={{
        borderWidth: 1,
        borderColor: '$green500',
      }}
      isReadOnly={false}
      isInvalid={false}
      isDisabled={false}
    >
      <TextareaInput
        {...rest}
        color="$trueGray100"
        fontSize="$sm"
        fontFamily="$body"
        placeholderTextColor="$trueGray400"
      />
    </GTextarea>
  );
}
