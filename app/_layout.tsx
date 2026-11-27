import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { RegisterProvider } from '@/contexts/RegisterContext';
import { theme } from '@/constants/theme';
export function RootLayout() {
  return <AlertProvider><SafeAreaProvider><RegisterProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background }, animation: 'fade', headerStyle: { backgroundColor: theme.colors.sky }, headerTintColor: theme.colors.primary, headerTitleStyle: { fontSize: theme.font.label, fontWeight: '700' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cash" options={{ headerShown: true, title: 'Наличные', headerBackTitle: 'Магазин' }} />
      <Stack.Screen name="card" options={{ headerShown: true, title: 'Картой', headerBackTitle: 'Магазин' }} />
      <Stack.Screen name="success" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  </RegisterProvider></SafeAreaProvider></AlertProvider>;
}
export default RootLayout;
