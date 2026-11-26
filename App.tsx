import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameScreen } from './src/GameScreen';
import { ErrorBoundary } from './src/ui/Screens';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });
  const [session, setSession] = useState(0);
  const ready = fontsLoaded || !!fontError;
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar hidden />
        {ready && (
          <ErrorBoundary onReset={() => setSession((n) => n + 1)}>
            <GameScreen key={session} />
          </ErrorBoundary>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#D2F0FD' },
});
