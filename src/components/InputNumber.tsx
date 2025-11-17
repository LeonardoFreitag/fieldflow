import { Input as GlueStackInput, InputField } from '@ui/input';
import React, { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => {
    formatValue(String(value));
  }, [formatValue, value]);

  return (
    <GlueStackInput className=" h-12 px-1 borderWidth-1 borderRadius-md">
      <InputField
        {...rest}
        className="text-typography-700 text-sm text-right"
        keyboardType="number-pad"
        value={formatedValue}
        onChangeText={formatValue}
        onFocus={handleFocused}
        onBlur={handleBlur}
        selection={focused ? selection : undefined}
        returnKeyType="done"
      />
    </GlueStackInput>
  );
}
