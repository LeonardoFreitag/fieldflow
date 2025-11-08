import { type InputField } from '@ui/input';
import { Textarea as GTextarea, TextareaInput } from '@ui/textarea';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField>;

export function TextArea({ ...rest }: Props) {
  return (
    <GTextarea
      className="bg-trueGray-700 px-1 borderWidth-1 borderRadius-md @focus:border-green-500 @focus:border-1"
      isReadOnly={false}
      isInvalid={false}
      isDisabled={false}
    >
      <TextareaInput className="text-trueGray-100 text-sm font-body placeholder:text-trueGray-400" />
    </GTextarea>
  );
}
