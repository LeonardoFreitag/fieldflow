import { Text } from '@ui/text';
import { Button as GlueStackButton, ButtonSpinner } from '@ui/button';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof GlueStackButton> & {
  title: string;
  btVariant?: 'primary' | 'secondary';
  isLoading?: boolean;
};

export function Button({
  title,
  btVariant = 'primary',
  isLoading = false,
  ...rest
}: Props) {
  const variantClasses =
    btVariant === 'secondary'
      ? 'bg-transparent border border-green-700 active:bg-trueGray-500'
      : 'bg-green-700 border-0 active:bg-green-500';

  return (
    <GlueStackButton
      className={`w-full h-12 justify-center items-center rounded-sm ${variantClasses} ${
        isLoading ? 'opacity-70' : ''
      }`}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner className="text-white" />
      ) : (
        <Text
          className={` ${btVariant === 'secondary' ? 'text-green-500' : 'text-white'} font-heading text-sm `}
        >
          {title}
        </Text>
      )}
    </GlueStackButton>
  );
}
