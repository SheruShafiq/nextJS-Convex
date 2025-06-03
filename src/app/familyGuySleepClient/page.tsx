'use client';

import { useRef, useEffect } from 'react';

function Page() {
  const tmdb_id = "tt0182576"; // Replace with actual TMDB ID
  const season_number = "1"; // Replace with actual season number
  const episode_number = "1"; // Replace with actual episode number
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // include mute=0 and allow autoplay
  const src = `https://vidsrc.xyz/embed/tv/${tmdb_id}/${season_number}-${episode_number}?autoplay=1&autonext=1&mute=0`;

  useEffect(() => {
    // disable window.open entirely
    window.open = () => null;

    // block any <a target="_blank"> or navigation attempts
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'A' && (el as HTMLAnchorElement).target === '_blank') {
        e.preventDefault();
      }
    };

    // prevent unload/redirect via scripts
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <h1>Family Guy Sleep Client</h1>
      <iframe
        ref={iframeRef}
        src={src}
        allow="autoplay"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default Page;
