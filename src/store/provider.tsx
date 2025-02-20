import { Provider as ProviderRedux } from 'react-redux';
import { store } from './store';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return <ProviderRedux store={store}>{children}</ProviderRedux>;
}
