import type React from 'react';

declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => Promise<void>;
    };
  }
}

export function openExternalSafely(
  event: React.MouseEvent<HTMLAnchorElement>,
  url: string
) {
  if (typeof window !== 'undefined' && window.electronAPI?.openExternal) {
    event.preventDefault();
    void window.electronAPI.openExternal(url);
  }
}
