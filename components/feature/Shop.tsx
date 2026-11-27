import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRegister } from '@/hooks/useRegister';
import { products } from '@/services/products';
import { theme } from '@/constants/theme';
import { GameScreen } from '@/components/layout/GameScreen';
import { GameButton } from '@/components/ui/GameButton';
import { ProductCard } from '@/components/feature/ProductCard';
export function Shop() {
  const { basket, total, count, soundEnabled, toggleSound, addProduct, removeProduct } = useRegister();
  const router = useRouter();
  return <GameScreen>
    <View style={styles.header}>
      <View><Text style={styles.eyebrow}>ИГРАЕМ В МАГАЗИН</Text><Text style={styles.title}>Касса 🛒</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel={soundEnabled ? 'Выключить звуки' : 'Включить звуки'} onPress={toggleSound} style={({ pressed }) => [styles.sound, { opacity: pressed ? 0.55 : 1 }]}>
        <Ionicons name={soundEnabled ? 'volume-high-outline' : 'volume-mute-outline'} size={26} color={theme.colors.primary} />
      </Pressable>
    </View>
    <FlatList data={products} numColumns={2} keyExtractor={item => item.id} extraData={basket} style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
      ListHeaderComponent={<View style={styles.tip}><View style={styles.tipIcon}><Ionicons name="basket-outline" size={28} color={theme.colors.primary} /></View><View style={styles.tipCopy}><Text style={styles.tipTitle}>Что будем покупать?</Text><Text style={styles.tipText}>Нажимай на товары — пик!</Text></View></View>}
      renderItem={({ item }) => <ProductCard product={item} quantity={basket[item.id] || 0} onAdd={() => addProduct(item.id)} onRemove={() => removeProduct(item.id)} />} />
    <View style={styles.checkout}>
      <View style={styles.totalRow}><View><Text style={styles.totalLabel}>Итого:</Text><Text style={styles.count}>{count === 0 ? 'Корзина пока пустая' : `В корзине: ${count}`}</Text></View><Text accessibilityLiveRegion="polite" style={styles.total}>{total} ₽</Text></View>
      <View style={styles.buttons}><View style={styles.button}><GameButton label="Наличные" emoji="💵" tone="yellow" compact disabled={total === 0} onPress={() => router.push('/cash')} /></View><View style={styles.button}><GameButton label="Картой" emoji="💳" tone="blue" compact disabled={total === 0} onPress={() => router.push('/card')} /></View></View>
      <Text style={styles.disclaimer}>Игрушечная касса • настоящих платежей нет</Text>
    </View>
  </GameScreen>;
}
const styles = StyleSheet.create({
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: theme.colors.primary, fontSize: theme.font.small, letterSpacing: 1.5, fontWeight: '700', marginBottom: theme.spacing.xs },
  title: { color: theme.colors.ink, fontSize: 36, fontWeight: '800', includeFontPadding: false },
  sound: { width: 52, height: 52, borderRadius: theme.radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  list: { flex: 1 }, listContent: { paddingHorizontal: theme.spacing.sm, paddingBottom: theme.spacing.md },
  tip: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, marginHorizontal: theme.spacing.sm, marginBottom: theme.spacing.sm, padding: theme.spacing.md, flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center' },
  tipIcon: { height: 48, width: 48, borderRadius: theme.radius.sm, backgroundColor: theme.colors.sky, alignItems: 'center', justifyContent: 'center' },
  tipCopy: { flex: 1 }, tipTitle: { fontSize: theme.font.label, fontWeight: '700', color: theme.colors.ink },
  tipText: { fontSize: theme.font.body, color: theme.colors.subtle, marginTop: theme.spacing.xs },
  checkout: { backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderTopLeftRadius: theme.radius.lg, borderTopRightRadius: theme.radius.lg, shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 6 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sm, marginBottom: theme.spacing.md },
  totalLabel: { fontSize: theme.font.section, fontWeight: '700', color: theme.colors.ink },
  count: { fontSize: theme.font.small, color: theme.colors.subtle, marginTop: theme.spacing.xs },
  total: { fontSize: 40, fontWeight: '800', color: theme.colors.primary, includeFontPadding: false, flexShrink: 1 },
  buttons: { flexDirection: 'row', gap: theme.spacing.sm }, button: { flex: 1 },
  disclaimer: { color: theme.colors.subtle, fontSize: 12, textAlign: 'center', marginTop: theme.spacing.sm },
});
