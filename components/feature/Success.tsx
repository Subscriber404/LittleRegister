import { useEffect, useRef } from 'react';
import { Animated, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRegister } from '@/hooks/useRegister';
import { theme } from '@/constants/theme';
import { GameScreen } from '@/components/layout/GameScreen';
import { GameButton } from '@/components/ui/GameButton';
export function Success() {
  const { paid, paidTotal, reset } = useRegister();
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (!paid) router.replace('/'); }, [paid, router]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { reset(); router.replace('/'); return true; });
    return () => subscription.remove();
  }, [reset, router]);
  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]);
    animation.start(); return () => animation.stop();
  }, [scale, opacity]);
  return <GameScreen>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>ПОКУПКА ГОТОВА</Text>
      <Animated.View style={[styles.checkRing, { opacity, transform: [{ scale }] }]}><Text style={styles.check}>✅</Text></Animated.View>
      <Text accessibilityLiveRegion="polite" style={styles.title}>Оплата{ '\n' }успешна!</Text>
      <View style={styles.receipt}><View style={styles.receiptHeading}><Ionicons name="receipt-outline" color={theme.colors.green} size={24} /><Text style={styles.receiptLabel}>Оплачено</Text></View><Text style={styles.amount}>Оплачено: {paidTotal} ₽</Text><View style={styles.divider} /><Text style={styles.thanks}>Спасибо за покупку!</Text><Text style={styles.bag}>🛍️</Text></View>
      <View style={styles.action}><GameButton label="Новая покупка" tone="green" onPress={() => { reset(); router.replace('/'); }} /></View>
    </ScrollView>
  </GameScreen>;
}
const styles = StyleSheet.create({
  scroll: { flex: 1 }, content: { flexGrow: 1, padding: theme.spacing.lg, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.lg },
  eyebrow: { color: theme.colors.green, fontSize: theme.font.small, fontWeight: '800', letterSpacing: 1.6 },
  checkRing: { width: 172, height: 172, borderRadius: theme.radius.pill, backgroundColor: theme.colors.greenLight, borderWidth: 8, borderColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
  check: { fontSize: theme.font.hero, includeFontPadding: false },
  title: { fontSize: 40, lineHeight: 46, fontWeight: '800', textAlign: 'center', color: theme.colors.green, includeFontPadding: false },
  receipt: { width: '100%', maxWidth: 360, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, alignItems: 'center', gap: theme.spacing.md, shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  receiptHeading: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }, receiptLabel: { fontSize: theme.font.body, color: theme.colors.subtle, fontWeight: '600' },
  amount: { fontSize: 26, fontWeight: '800', color: theme.colors.ink, textAlign: 'center' },
  divider: { width: '100%', borderBottomWidth: 2, borderStyle: 'dashed', borderColor: theme.colors.border },
  thanks: { fontSize: theme.font.label, color: theme.colors.subtle, textAlign: 'center' }, bag: { fontSize: 36 },
  action: { width: '100%', maxWidth: 440 },
});
