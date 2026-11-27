import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
interface GameScreenProps { children: ReactNode; withHeader?: boolean }
export function GameScreen({ children, withHeader = false }: GameScreenProps) {
  return <LinearGradient colors={[theme.colors.sky, theme.colors.background, theme.colors.pink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.root}>
    <SafeAreaView edges={withHeader ? ['bottom'] : ['top', 'bottom']} style={styles.root}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  </LinearGradient>;
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center' },
});
