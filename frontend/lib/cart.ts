'use client';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  photoUrl: string | null;
  quantity: number;
}

const CART_EVENT = 'nfc-cart-updated';

function cartKey(slug: string): string {
  return `nfc_cart_${slug}`;
}

export function getCart(slug: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(cartKey(slug));
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(slug: string, items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(cartKey(slug), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(
  slug: string,
  item: Omit<CartItem, 'quantity'>,
  quantity: number = 1,
): void {
  const items = getCart(slug);
  const existing = items.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...item, quantity });
  }
  saveCart(slug, items);
}

export function updateCartQuantity(slug: string, productId: string, quantity: number): void {
  let items = getCart(slug);
  if (quantity <= 0) {
    items = items.filter((i) => i.productId !== productId);
  } else {
    const existing = items.find((i) => i.productId === productId);
    if (existing) existing.quantity = quantity;
  }
  saveCart(slug, items);
}

export function clearCart(slug: string): void {
  saveCart(slug, []);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/** The active table for this browsing session, set by /[slug]/t/[tableId] on entry. */
export function getActiveTableId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const stored = sessionStorage.getItem('tableId');
  if (stored) return stored;
  const params = new URLSearchParams(window.location.search);
  return params.get('tableId') || undefined;
}

export function onCartChange(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CART_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(CART_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}
