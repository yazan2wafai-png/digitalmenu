import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: '#B5651D',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F5F0E6',
          borderRadius: '7px',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
