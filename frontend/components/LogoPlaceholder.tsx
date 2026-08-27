'use client';

import React, { useState } from 'react';
import type { Restaurant } from '@/types/menu';

export type RestaurantType = 'coffee' | 'burger' | 'restaurant';

export function getRestaurantType(
  slug: string = '',
  name: string = '',
  themeColor?: string
): RestaurantType {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  const tc = (themeColor || '').toLowerCase();

  if (
    s.includes('coffee') ||
    s.includes('kahve') ||
    s.includes('erenkoy') ||
    s.includes('roast') ||
    s.includes('cafe') ||
    n.includes('kahve') ||
    n.includes('coffee') ||
    n.includes('cafe') ||
    tc === '#6f4e37'
  ) {
    return 'coffee';
  }

  if (
    s.includes('burger') ||
    s.includes('baltazar') ||
    s.includes('grill') ||
    s.includes('smash') ||
    n.includes('burger') ||
    n.includes('baltazar') ||
    tc === '#c0392b'
  ) {
    return 'burger';
  }

  return 'restaurant';
}

export function getInitials(name: string = '', slug: string = ''): string {
  if (!name && !slug) return 'DM';
  const cleanName = name.trim();
  if (cleanName) {
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length >= 2) {
      // If single word, check if slug has multiple hyphenated parts (e.g. baltazar-burger)
      if (slug && slug.includes('-')) {
        const slugParts = slug.split('-').filter(Boolean);
        if (slugParts.length >= 2) {
          return (slugParts[0][0] + slugParts[1][0]).toUpperCase();
        }
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
  }

  if (slug) {
    const slugParts = slug.split(/[-_]/).filter(Boolean);
    if (slugParts.length >= 2) {
      return (slugParts[0][0] + slugParts[1][0]).toUpperCase();
    }
    return slug.slice(0, 2).toUpperCase();
  }

  return 'DM';
}

// ── SVG Themed Icons ──────────────────────────────────────────────────────────
export function CoffeeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

export function BurgerIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11c0-4 4-8 9-8s9 4 9 8" />
      <path d="M4 11h16" />
      <path d="M3 15h18" />
      <path d="M5 19h14a2 2 0 0 0 2-2H3a2 2 0 0 0 2 2Z" />
      <path d="M6 13c1 0 1.5 1 2.5 1s1.5-1 2.5-1 1.5 1 2.5 1 1.5-1 2.5-1 1.5 1 2.5 1" />
    </svg>
  );
}

export function UtensilsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

interface Props {
  restaurant: Pick<Restaurant, 'name' | 'slug'> & {
    themeColor?: string;
    logoUrl?: string | null;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LogoPlaceholder({ restaurant, size = 'md', className = '' }: Props) {
  const [imageError, setImageError] = useState(false);

  const theme = restaurant.themeColor || '#C0392B';
  const type = getRestaurantType(restaurant.slug, restaurant.name, theme);
  const initials = getInitials(restaurant.name, restaurant.slug);

  const logoSrc = restaurant.logoUrl
    ? restaurant.logoUrl.startsWith('http')
      ? restaurant.logoUrl
      : `${process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app'}${restaurant.logoUrl}`
    : null;

  // Size styling maps
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-28 h-28 text-2xl sm:text-3xl',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const selectedIconSize = iconSizes[size] || iconSizes.md;

  // If a valid logo URL is present and hasn't failed to load
  if (logoSrc && !imageError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none ${selectedSizeClass} ${className}`}
        style={{
          boxShadow: `0 0 0 2px ${theme}80, 0 0 20px ${theme}40, 0 8px 24px rgba(0,0,0,0.5)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={() => {
            console.warn(`[LogoPlaceholder] Image failed to load: ${logoSrc}. Falling back to stylized badge.`);
            setImageError(true);
          }}
        />
      </div>
    );
  }

  // Fallback: Sleek, intentional circular badge
  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 flex flex-col items-center justify-center select-none font-black text-white ${selectedSizeClass} ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 30%, ${theme}50 0%, ${theme}25 55%, rgba(18, 18, 18, 0.95) 100%)`,
        border: `2px solid ${theme}95`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 0 24px ${theme}60, inset 0 0 18px ${theme}30`,
      }}
      title={restaurant.name}
    >
      {/* Background glow sheen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)`,
        }}
      />

      {/* Large / XL layout: Icon on top, Initials below */}
      {size === 'xl' || size === 'lg' ? (
        <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 sm:gap-1">
          <div style={{ color: '#fff', filter: `drop-shadow(0 0 6px ${theme})` }}>
            {type === 'coffee' && <CoffeeIcon className={selectedIconSize} />}
            {type === 'burger' && <BurgerIcon className={selectedIconSize} />}
            {type === 'restaurant' && <UtensilsIcon className={selectedIconSize} />}
          </div>
          <span
            className="font-black tracking-wider leading-none drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            {initials}
          </span>
        </div>
      ) : (
        /* Small / Medium layout: Crisp initials with subtle theme icon accent or clean monogram */
        <div className="relative z-10 flex items-center justify-center">
          <span
            className="font-black tracking-wider leading-none drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
