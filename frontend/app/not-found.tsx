import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-8 text-center font-sans">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-10 shadow-2xl">
        <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Restaurant Not Found</h2>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          The restaurant you're looking for doesn't exist or has been removed from NFCMyPlace.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-200 transition-colors w-full"
        >
          Return Home
        </Link>
      </div>
      
      <div className="mt-12 opacity-40 flex items-center space-x-2">
        <span className="text-sm font-medium tracking-widest uppercase">NFCMyPlace</span>
      </div>
    </div>
  );
}
