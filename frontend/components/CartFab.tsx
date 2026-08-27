'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCart,
  updateCartQuantity,
  clearCart,
  cartTotal,
  cartCount,
  getActiveTableId,
  onCartChange,
  type CartItem,
} from '@/lib/cart';
import { createOrder } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app';

interface Props {
  slug: string;
  themeColor: string;
  isRTL: boolean;
  enabled: boolean;
  /** Pass this when the page already knows it synchronously (avoids a mount-order
   * race on /[slug]/t/[tableId]); otherwise it's read from sessionStorage. */
  tableId?: string;
  estimatedPrepMinutes?: number;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function CartFab({ slug, themeColor, isRTL, enabled, tableId, estimatedPrepMinutes = 15 }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resolvedTableId, setResolvedTableId] = useState<string | undefined>(tableId);

  const refresh = useCallback(() => setItems(getCart(slug)), [slug]);

  useEffect(() => {
    refresh();
    return onCartChange(refresh);
  }, [refresh]);

  useEffect(() => {
    setResolvedTableId(tableId || getActiveTableId());
  }, [tableId]);

  // Ordering only happens from a table-scoped link - the general/no-table
  // menu link is browse-only, so staff always know which table an order
  // came from.
  if (!enabled || !resolvedTableId) return null;

  const count = cartCount(items);
  const total = cartTotal(items);

  async function handleSubmit() {
    if (items.length === 0 || !resolvedTableId) return;
    setState('submitting');
    setErrorMsg('');
    try {
      await createOrder(slug, {
        tableId: resolvedTableId,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart(slug);
      setState('success');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Sipariş gönderilemedi');
      setState('error');
    }
  }

  function handleClose() {
    setOpen(false);
    // Reset the success/error screen shortly after the drawer closes.
    setTimeout(() => setState('idle'), 300);
  }

  return (
    <>
      {/* Floating action button */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            onClick={() => setOpen(true)}
            className={`fixed bottom-6 ${isRTL ? 'left-5' : 'right-5'} z-40 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full shadow-2xl font-bold text-sm text-white`}
            style={{ backgroundColor: themeColor, boxShadow: `0 8px 28px ${themeColor}70` }}
          >
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/25 text-xs font-black">
              {count}
            </span>
            <span>Sepeti Gör</span>
            <span className="opacity-80">₺{total.toFixed(2).replace(/\.00$/, '')}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {state === 'success' ? (
                <div className="p-8 flex flex-col items-center text-center gap-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${themeColor}25`, color: themeColor }}
                  >
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-white">Siparişiniz alındı</h3>
                  <p className="text-white/60 text-sm max-w-xs">
                    Siparişiniz mutfağa iletildi. Tahmini hazırlanma süresi ~{estimatedPrepMinutes} dakika.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-3 px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    Kapat
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Sepetiniz</h3>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full bg-white/5 text-white/70 hover:text-white flex items-center justify-center"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-white/5">
                    {items.length === 0 ? (
                      <p className="p-8 text-center text-white/40 text-sm">Sepetiniz boş.</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
                          <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                            {item.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.photoUrl.startsWith('/') ? `${API_URL}${item.photoUrl}` : item.photoUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-lg"
                                style={{ backgroundColor: `${themeColor}20` }}
                              >
                                🍽️
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                            <p className="text-white/40 text-xs">
                              ₺{item.price.toFixed(2).replace(/\.00$/, '')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateCartQuantity(slug, item.productId, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold hover:bg-white/20"
                            >
                              −
                            </button>
                            <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(slug, item.productId, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold hover:bg-white/20"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="p-5 border-t border-white/10 space-y-3">
                      {errorMsg && (
                        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                          {errorMsg}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm text-white/60">Toplam</span>
                        <span className="text-xl font-extrabold">₺{total.toFixed(2).replace(/\.00$/, '')}</span>
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={state === 'submitting'}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-60"
                        style={{ backgroundColor: themeColor, boxShadow: `0 4px 20px ${themeColor}40` }}
                      >
                        {state === 'submitting' ? 'Gönderiliyor…' : 'Siparişi Gönder'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
