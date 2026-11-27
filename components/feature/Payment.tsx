import { useEffect } from 'react';
import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRegister } from '@/hooks/useRegister';
import { GameScreen } from '@/components/layout/GameScreen';
import { GameButton } from '@/components/ui/GameButton';
import { theme } from '@/constants/theme';
interface PaymentProps { method: 'cash' | 'card' }
export function Payment({ method }: PaymentProps) {
  const { total, paid, processing, pay } = useRegister();
  const router = useRouter();
  const isCard = method === 'card';
  useEffect(() => { if (paid) router.replace('/success'); else if (total === 0 && !processing) router.replace('/'); }, [paid, total, processing, router]);
  useEffect(() => {
    if (!processing) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [processing]);
  return <GameScreen withHeader>
    <Stack.Screen options={{ gestureEnabled: !processing, headerBackVisible: !processing }} />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topLabel}><Ionicons name={isCard ? 'card-outline' : 'cash-outline'} color={theme.colors.primary} size={20} /><Text style={styles.label}>{isCard ? 'ОПЛАТА КАРТОЙ' : 'ОПЛАТА НАЛИЧНЫМИ'}</Text></View>
      <View style={[styles.art, { backgroundColor: isCard ? theme.colors.blueLight : theme.colors.banana }]}>
        <Text style={styles.heroEmoji}>{isCard ? '💳' : '💵'}</Text>
        {isCard ? <View style={styles.terminal}><Ionicons name="wifi-outline" size={25} color={theme.colors.primary} /><Text style={styles.terminalText}>КАССА</Text><View style={styles.terminalDots}><View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} /></View></View> : null}
      </View>
      <Text style={styles.payLabel}>К оплате</Text><Text style={styles.amount}>{total} ₽</Text>
      <Text style={styles.instruction}>{isCard ? 'Приложи карту\nк терминалу' : 'Передай деньги\nи нажми на кнопку'}</Text>
      <View style={styles.action}>
        {processing ? <View accessibilityLiveRegion="polite" style={styles.processing}><ActivityIndicator size="large" color={theme.colors.blue} /><Text style={styles.processingText}>Проверяем оплату…</Text></View> : <GameButton label={isCard ? 'Приложить карту' : 'Оплатить наличными'} emoji={isCard ? '📱' : undefined} tone={isCard ? 'blue' : 'green'} disabled={paid || total === 0} onPress={() => pay(method)} />}
        <Text style={styles.hint}>{processing ? 'Подожди чуть-чуть' : 'Это игра. Деньги не списываются.'}</Text>
      </View>
    </ScrollView>
  </GameScreen>;
}
const styles = StyleSheet.create({
  scroll: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg, gap: theme.spacing.md },
  topLabel: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center', marginBottom: theme.spacing.sm },
  label: { color: theme.colors.primary, fontSize: theme.font.small, fontWeight: '700', letterSpacing: 1 },
  art: { width: 220, height: 200, borderRadius: theme.radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.sm },
  heroEmoji: { fontSize: theme.font.hero, includeFontPadding: false },
  terminal: { position: 'absolute', bottom: -8, right: -8, backgroundColor: theme.colors.surface, borderWidth: 3, borderColor: theme.colors.border, width: 76, height: 104, borderRadius: theme.radius.sm, justifyContent: 'center', alignItems: 'center', gap: theme.spacing.xs, transform: [{ rotate: '8deg' }] },
  terminalText: { color: theme.colors.primary, fontSize: 10, fontWeight: '800' },
  terminalDots: { flexDirection: 'row', gap: theme.spacing.xs, marginTop: theme.spacing.sm }, dot: { height: 8, width: 8, borderRadius: 4, backgroundColor: theme.colors.sky },
  payLabel: { fontSize: theme.font.section, fontWeight: '600', color: theme.colors.subtle },
  amount: { fontSize: 60, fontWeight: '800', color: theme.colors.ink, includeFontPadding: false },
  instruction: { fontSize: 26, fontWeight: '700', lineHeight: 36, color: theme.colors.ink, textAlign: 'center' },
  action: { width: '100%', maxWidth: 440, marginTop: theme.spacing.lg, gap: theme.spacing.md },
  hint: { color: theme.colors.subtle, fontSize: theme.font.small, textAlign: 'center' },
  processing: { minHeight: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, borderRadius: theme.radius.md, backgroundColor: theme.colors.blueLight, padding: theme.spacing.md },
  processingText: { fontSize: theme.font.label, color: theme.colors.primary, fontWeight: '700', flexShrink: 1 },
});
