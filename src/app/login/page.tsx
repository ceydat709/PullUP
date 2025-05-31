'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthForm from '../../components/AuthForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white px-6">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Image
            src="/media/Logo.png"
            alt="PullUp Logo"
            width={220} 
            height={140}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <AuthForm />
      </div>
    </main>
  );
}
