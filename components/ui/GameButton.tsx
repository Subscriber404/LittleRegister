import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
interface GameButtonProps { label: string; emoji?: string; tone?: 'blue' | 'yellow' | 'green'; disabled?: boolean; onPress: () => void; compact?: boolean }
export const GameButton = memo(function GameButton({ label, emoji, tone = 'blue', disabled = false, onPress, compact = false }: GameButtonProps) {
  const fill = disabled ? theme.colors.disabled : tone === 'yellow' ? theme.colors.yellow : tone === 'green' ? theme.colors.green : theme.colors.blue;
  const color = disabled ? theme.colors.disabledText : tone === 'yellow' ? theme.colors.yellowText : theme.colors.surface;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, compact ? styles.compact : null, { backgroundColor: fill, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
    <View style={compact ? styles.vertical : styles.horizontal}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  </Pressable>;
});
const styles = StyleSheet.create({
  button: { minHeight: 80, borderRadius: theme.radius.md, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.md, width: '100%' },
  compact: { minHeight: 96 },
  horizontal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm },
  vertical: { alignItems: 'center', gap: theme.spacing.xs },
  emoji: { fontSize: 30, includeFontPadding: false },
  label: { fontSize: theme.font.section, fontWeight: '700', textAlign: 'center', includeFontPadding: false, flexShrink: 1 },
});
