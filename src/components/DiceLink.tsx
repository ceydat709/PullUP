'use client';
import Image from 'next/image';
import Link from 'next/link';

interface DiceLinkProps {
  label: string;
  href: string;
  rotation?: 'left' | 'right';
}

export default function DiceLink({ label, href, rotation = 'left' }: DiceLinkProps) {
  const rotateClass = rotation === 'left' ? '-rotate-12' : 'rotate-12';
  const textClass =
    rotation === 'left'
      ? 'origin-top-left -rotate-[25deg]'
      : 'origin-top-right rotate-[25deg]';

  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className={`transform ${rotateClass}`}>
        <Image
          src="/media/Die.png"
          alt="Dice"
          width={80}
          height={80}
          className="transition-transform group-hover:scale-110"
        />
      </div>
      <span
        className={`text-2xl font-bold text-black transition-all group-hover:underline ${textClass}`}
      >
        {label}
      </span>
    </Link>
  );
}
