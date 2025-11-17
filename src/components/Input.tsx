import { HStack } from '@ui/hstack';
import { Input as GlueStackInput, InputField } from '@ui/input';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField>;

export function Input({ ...rest }: Props) {
  return (
    <HStack className="items-center flex-1">
      <GlueStackInput className="bg-background-50 h-12 bw-1 br-md flex-1">
        <InputField
          {...rest}
          className="text-typography-800 text-sm font-body"
        />
      </GlueStackInput>
    </HStack>
  );
}
