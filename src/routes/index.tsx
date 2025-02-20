import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';
import { Box } from '@gluestack-ui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

export function Routes() {
  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.trueGray800;

  return (
    // <Box flex={1} bg="$gray800">
    <NavigationContainer theme={theme}>
      <Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Screen name="AuthRoutes" component={AuthRoutes} />
        <Screen name="AppRoutes" component={AppRoutes} />
      </Navigator>
    </NavigationContainer>
    // </Box>
  );
}
