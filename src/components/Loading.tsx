import { Spinner } from '@ui/spinner';
import { Center } from '@ui/center';

export function Loading() {
  return (
    <Center className="bg-trueGray-800 flex-1">
      <Spinner className="text-green-500" />
    </Center>
  );
}
