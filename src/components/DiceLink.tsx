'use client';
import Image from 'next/image';
import Link from 'next/link';

interface DiceLinkProps {
  label: string;
  href: string;
  rotation?: 'left' | 'right';
  textPosition?: 'above' | 'below';
}

export default function DiceLink({
  label,
  href,
  rotation = 'left',
  textPosition = 'below',
}: DiceLinkProps) {
  const rotateClass = rotation === 'left' ? '-rotate-12' : 'rotate-12';

  // Different SVG path depending on arc direction
  const isAbove = textPosition === 'above';

  const arc = (
    <svg
      viewBox="0 0 300 150"
      width="300"
      height="80"
      className=""
      aria-hidden="true"
    >
      <path
        id={`curve-${label}`}
        d={
          isAbove
            ? 'M 40,120 Q 150,-20 260,120' // frown arc
            : 'M 40,10 Q 150,130 260,10' // smile arc
        }
        fill="transparent"
      />
      <text fill="black" fontSize="42" fontWeight="bold">
        <textPath href={`#curve-${label}`} startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
    </svg>
  );

  return (
    <Link href={href} className="flex flex-col items-center gap-0 cursor-pointer">
      {/* Top label for Create Plan */}
      {isAbove && arc}

      {/* Dice */}
      <div className={`transform ${rotateClass}`}>
        <Image
          src="/media/Die.png"
          alt="Dice"
          width={180}
          height={180}
          className="transition-transform group-hover:scale-110"
        />
      </div>

      {/* Bottom label for Search Plan */}
      {!isAbove && arc}
    </Link>
  );
}
