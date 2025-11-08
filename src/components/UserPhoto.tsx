import { Image } from '@ui/image';
import { type ComponentProps } from 'react';

type Props = ComponentProps<typeof Image>;

export function UserPhoto({ ...rest }: Props) {
  return (
    <Image
      {...rest}
      className="rounded-full border-2 border-trueGray-400 bg-trueGray-500"
    />
  );
}
