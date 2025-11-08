import { Input as GlueStackInput, InputField } from '@ui/input';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField>;

export function Input({ ...rest }: Props) {
  return (
    <GlueStackInput className="bg-trueGray-700 h-12 px-1 borderWidth-1 borderRadius-md @focus:border-green-500 @focus:border-1 flex-1">
      <InputField
        placeholderTextColor="$trueGray400"
        {...rest}
        className="text-trueGray-100 text-sm font-body"
      />
    </GlueStackInput>
  );
}
