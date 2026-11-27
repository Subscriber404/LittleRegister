import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/services/products';
import { theme } from '@/constants/theme';
interface ProductCardProps { product: Product; quantity: number; onAdd: () => void; onRemove: () => void }
export const ProductCard = memo(function ProductCard({ product, quantity, onAdd, onRemove }: ProductCardProps) {
  return <View style={[styles.card, { backgroundColor: product.color }, quantity > 0 ? styles.selected : null]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`${product.name}, ${product.price} рублей. Добавить в корзину`} onPress={onAdd}
      style={({ pressed }) => [styles.addArea, { opacity: pressed ? 0.65 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      <Text style={styles.emoji}>{product.emoji}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} ₽</Text>
      <View style={styles.plus}><Ionicons name="add-outline" size={22} color={theme.colors.primary} /></View>
      {quantity > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>×{quantity}</Text></View> : null}
    </Pressable>
    {quantity > 0 ? <Pressable accessibilityRole="button" accessibilityLabel={`Убрать один товар: ${product.name}`} onPress={onRemove} style={({ pressed }) => [styles.remove, { opacity: pressed ? 0.5 : 1 }]}>
      <Ionicons name="remove-outline" size={22} color={theme.colors.primary} />
    </Pressable> : null}
  </View>;
});
const styles = StyleSheet.create({
  card: { flex: 1, margin: theme.spacing.sm, borderRadius: theme.radius.md, borderWidth: 2, borderColor: theme.colors.surface, overflow: 'hidden' },
  selected: { borderColor: theme.colors.primary },
  addArea: { minHeight: 180, padding: theme.spacing.md, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs },
  emoji: { fontSize: theme.font.emoji, includeFontPadding: false },
  name: { color: theme.colors.ink, fontSize: theme.font.label, fontWeight: '700', includeFontPadding: false },
  price: { color: theme.colors.primary, fontSize: 26, fontWeight: '800', includeFontPadding: false },
  badge: { position: 'absolute', top: theme.spacing.sm, right: theme.spacing.sm, backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: theme.colors.surface, fontSize: theme.font.body, fontWeight: '800' },
  plus: { position: 'absolute', bottom: theme.spacing.sm, right: theme.spacing.sm, height: 32, width: 32, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
  remove: { position: 'absolute', bottom: 0, left: 0, width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
});
