import { HStack } from '@ui/hstack';
import { Input as GlueStackInput, InputField } from '@ui/input';
import { Button, ButtonIcon } from '@ui/button';
import { Calendar1 } from 'lucide-react-native';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof InputField> & {
  buttonPress?: () => void;
};

export function DateInput({ buttonPress, ...rest }: Props) {
  return (
    <HStack className="items-center w-full">
      <GlueStackInput className="bg-background-50 h-12 bw-1 br-md flex-1">
        <InputField
          {...rest}
          className="text-typography-700 text-sm font-body"
        />
        <Button
          onPress={buttonPress}
          className="h-12 w-12 rounded-md bg-background-50  active:bg-trueGray-500"
        >
          <ButtonIcon
            as={Calendar1}
            size="xl"
            className="h-12 text-typography-700"
          />
        </Button>
      </GlueStackInput>
    </HStack>
  );
}
