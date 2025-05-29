// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import DiceLink from '../components/DiceLink';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-8 bg-white shadow-md hover:shadow-lg transition">
      {}
      <div className="w-full flex justify-end">
      <Link href="/login">
        <button className="bg-black text-cyan-300 font-bold px-6 py-2 text-lg rounded-full hover:opacity-90 transition">
          Sign In
        </button>
      </Link>

      </div>

      {}
      <div className="flex flex-col items-center text-center">
        <Image
          src="/media/Logo.png"
          alt="PullUP Logo"
          width={850}
          height={160}
          priority
        />
        <p className="text-2xl font-semibold mt-2 mb-4 text-black">
          Make Plans that Leave the Group Chat.
        </p>
      </div>

      <div className="flex justify-center gap-32 mt-6 mb-12">
        <DiceLink label="Create Plan" href="/create" rotation="left" />
        <DiceLink label="Search Plan" href="/search" rotation="right" />
      </div>

      {}
      <footer className="flex justify-center space-x-8 text-sm text-gray-600 pb-4">
        <Link href="/about">About Us</Link>
        <Link href="/support">Support</Link>
      </footer>
    </main>
  );
}

