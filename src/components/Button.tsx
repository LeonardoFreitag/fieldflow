import {
  Button as GluestackButton,
  Text,
  ButtonSpinner,
} from '@gluestack-ui/themed';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof GluestackButton> & {
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
  return (
    <GluestackButton
      w="$full"
      h="$12"
      bg={btVariant === 'secondary' ? 'transparent' : '$green700'}
      borderWidth={btVariant === 'secondary' ? '$1' : '$0'}
      borderColor={'$green700'}
      rounded="$sm"
      $active-bg={btVariant === 'secondary' ? '$trueGray500' : '$green500'}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text
          color={btVariant === 'secondary' ? '$green500' : '$white'}
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}
