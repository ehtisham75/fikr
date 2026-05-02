import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui/native';
import RootNavigator from './src/navigation/RootNavigator';
import tamaguiConfig from './tamagui.config';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const themeName = isDarkMode ? 'dark' : 'light';

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <Theme name={themeName}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </SafeAreaProvider>
      </Theme>
    </TamaguiProvider>
  );
}

export default App;
