// src/app/layout.tsx
import './globals.css';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PullUp',
  description: 'Your app description',
  icons: {
    icon: '/Media/Logo.png', 
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/Media/Logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );  
}
