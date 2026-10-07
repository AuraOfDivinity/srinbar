/** Extract a video ID from common YouTube sharing URLs without trusting arbitrary hosts. */
export function youtubeVideoId(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split('/').filter(Boolean);
    let id: string | null | undefined;
    if (host === 'youtu.be') {
      id = parts.length === 1 ? parts[0] : undefined;
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v')
        : parts.length === 2 && ['embed', 'live', 'shorts'].includes(parts[0]) ? parts[1] : undefined;
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}
