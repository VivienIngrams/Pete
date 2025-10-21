
'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    // Force light mode on page load
    document.documentElement.setAttribute('data-theme', 'light');

      console.log("Forcing light mode...");
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light'; // Optional, ensures light mode on supported browsers
      console.log("Light mode set:", document.documentElement.getAttribute('data-theme'));
  
  }, []);

  return null; // This component doesn't need to render anything
}
