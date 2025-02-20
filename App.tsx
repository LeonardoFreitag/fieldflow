import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from '@expo-google-fonts/roboto';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { Loading } from './src/components/Loading';
import { Routes } from '@routes/index';
import { StatusBar } from 'react-native';
import { Providers } from '@store/provider';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
  });

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Providers>{fontsLoaded ? <Routes /> : <Loading />}</Providers>
    </GluestackUIProvider>
  );
}
