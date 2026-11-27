import { theme } from '@/constants/theme';
export interface Product { id: string; name: string; emoji: string; price: number; color: string }
export const products: Product[] = [
  { id: 'apple', name: 'Яблоко', emoji: '🍎', price: 10, color: theme.colors.apple },
  { id: 'banana', name: 'Банан', emoji: '🍌', price: 15, color: theme.colors.banana },
  { id: 'milk', name: 'Молоко', emoji: '🥛', price: 30, color: theme.colors.milk },
  { id: 'bread', name: 'Хлеб', emoji: '🍞', price: 20, color: theme.colors.bread },
  { id: 'carrot', name: 'Морковка', emoji: '🥕', price: 10, color: theme.colors.carrot },
  { id: 'cookie', name: 'Печенье', emoji: '🍪', price: 25, color: theme.colors.cookie },
];
export type Basket = Record<string, number>;
export function getTotal(basket: Basket): number {
  return products.reduce((total, product) => total + product.price * (basket[product.id] || 0), 0);
}
export function getCount(basket: Basket): number {
  return Object.values(basket).reduce((sum, quantity) => sum + quantity, 0);
}
