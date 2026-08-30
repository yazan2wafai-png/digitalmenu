'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';

const PROMO_DEADLINE_KEY = 'promo_deadline';
const PROMO_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h, set once per visitor
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function SignupForm({ locale }: { locale: 'tr' | 'en' }) {
  const [mounted, setMounted] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Deadline is set once per visitor (localStorage) and never resets on reload.
  useEffect(() => {
    setMounted(true);
    let deadline: number;
    try {
      const stored = window.localStorage.getItem(PROMO_DEADLINE_KEY);
      if (stored && !Number.isNaN(Number(stored))) {
        deadline = Number(stored);
      } else {
        deadline = Date.now() + PROMO_WINDOW_MS;
        window.localStorage.setItem(PROMO_DEADLINE_KEY, String(deadline));
      }
    } catch {
      // localStorage unavailable (private mode, etc.) - fall back to an
      // in-memory deadline for this page view only.
      deadline = Date.now() + PROMO_WINDOW_MS;
    }

    const tick = () => setRemainingMs(deadline - Date.now());
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(false);

    if (!EMAIL_REGEX.test(email.trim())) {
      setFieldError(locale === 'tr' ? 'Geçerli bir e-posta adresi girin.' : 'Enter a valid email address.');
      return;
    }
    setFieldError('');
    setIsSubmitting(true);

    try {
      const companyId = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID;
      const listId = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;
      if (!companyId || !listId) {
        throw new Error('Klaviyo NEXT_PUBLIC_KLAVIYO_COMPANY_ID / NEXT_PUBLIC_KLAVIYO_LIST_ID is not configured');
      }

      // Klaviyo "Create Client Subscription" endpoint - verified against
      // Klaviyo's published OpenAPI spec (revision defaults to 2026-07-15).
      const res = await fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          revision: '2026-07-15',
        },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email: email.trim(),
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED',
                        },
                      },
                    },
                  },
                },
              },
              custom_source: 'Landing page signup form',
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: listId,
                },
              },
            },
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Klaviyo request failed with status ${res.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Klaviyo signup failed:', err);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const expired = mounted && remainingMs !== null && remainingMs <= 0;

  return (
    <section id="signup" className="py-20 px-4 sm:px-6 relative z-10" style={{ background: '#F5F0E6' }}>
      <div
        className="max-w-lg mx-auto rounded-3xl overflow-hidden shadow-xl"
        style={{ background: '#FBF7EE', border: '1px solid #D9CBB0' }}
      >
        {/* Dark top strip: live countdown */}
        <div className="px-6 py-3 text-center" style={{ background: '#3C3428' }}>
          <p className="text-xs sm:text-sm font-semibold tabular-nums" style={{ color: '#F5F0E6' }}>
            {!mounted
              ? ' '
              : expired
                ? (locale === 'tr' ? 'Kampanya sona erdi' : 'Campaign has ended')
                : (locale === 'tr'
                    ? `İlk siparişte %30 indirim — kalan süre ${formatCountdown(remainingMs ?? 0)}`
                    : `30% off your first order — ${formatCountdown(remainingMs ?? 0)} left`)}
          </p>
        </div>

        <div className="p-8 sm:p-10 text-center">
          {submitted ? (
            <div className="py-4">
              <div
                className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: '#3C3428' }}
              >
                <Check className="w-6 h-6" style={{ color: '#F5F0E6' }} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black mb-1" style={{ color: '#3C3428' }}>
                {locale === 'tr' ? 'Katıldın' : "You're in"}
              </h3>
              <p className="text-sm" style={{ color: '#6B5F49' }}>
                {locale === 'tr' ? 'E-postanı kontrol et, kampanyalar yolda.' : 'Check your inbox — offers are on the way.'}
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl sm:text-2xl font-black mb-2" style={{ color: '#3C3428' }}>
                {locale === 'tr' ? 'Fırsatları kaçırma' : "Don't miss out"}
              </h3>
              <p className="text-sm mb-6" style={{ color: '#6B5F49' }}>
                {locale === 'tr'
                  ? 'E-postanı bırak, indirimlerden ve yeniliklerden ilk sen haberdar ol.'
                  : 'Leave your email to be first to hear about discounts and new drops.'}
              </p>
              <form onSubmit={handleSubmit} noValidate className="space-y-3 text-left">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError('');
                  }}
                  placeholder={locale === 'tr' ? 'ornek@eposta.com' : 'you@example.com'}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: '#FBF7EE',
                    border: `1px solid ${fieldError ? '#b91c1c' : '#D9CBB0'}`,
                    color: '#3C3428',
                  }}
                />
                {fieldError && (
                  <p className="text-xs" style={{ color: '#b91c1c' }}>
                    {fieldError}
                  </p>
                )}
                {submitError && (
                  <p className="text-xs" style={{ color: '#b91c1c' }}>
                    {locale === 'tr' ? 'Bir şeyler ters gitti, tekrar dene.' : 'Something went wrong, please try again.'}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-opacity disabled:opacity-60 cursor-pointer"
                  style={{ background: '#3C3428', color: '#F5F0E6' }}
                >
                  {isSubmitting ? (locale === 'tr' ? 'Gönderiliyor…' : 'Submitting…') : (locale === 'tr' ? 'Katıl' : 'Join')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SignupForm;
