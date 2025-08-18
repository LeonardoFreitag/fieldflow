import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input as GluestackInput, InputField } from '@gluestack-ui/themed';
import { type ComponentProps } from 'react';
import { maskCurrency } from '@utils/masks';

type Props = ComponentProps<typeof InputField>;

export function InputNumber({ value, onChangeText, ...rest }: Props) {
  const [formatedValue, setFormatedValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleFocused = useCallback(() => {
    setFocused(true);
    // Posiciona o cursor no final quando recebe foco
    const endPosition = formatedValue.length;
    setSelection({ start: endPosition, end: endPosition });
  }, [formatedValue.length]);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const formatValue = useCallback(
    (text: string) => {
      const f = maskCurrency(text);
      setFormatedValue(f);
      if (onChangeText) {
        onChangeText(f);
      }
    },
    [onChangeText],
  );

  // const errored = useMemo(() => {
  //   if (error !== '') {
  //     return true;
  //   }
  //   return false;
  // }, [error]);

  useEffect(() => {
    formatValue(String(value));
  }, [formatValue, value]);

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
        {...rest}
        color="$trueGray100"
        fontSize="$sm"
        fontFamily="$body"
        placeholderTextColor="$trueGray400"
        textAlign="right"
        keyboardType="number-pad"
        value={formatedValue}
        onChangeText={formatValue}
        onFocus={handleFocused}
        onBlur={handleBlur}
        selection={focused ? selection : undefined}
        returnKeyType="done"
      />
    </GluestackInput>
  );
}
