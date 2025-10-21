
'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    // Force light mode on page load
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return null; // This component doesn't need to render anything
}
