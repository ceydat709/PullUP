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
  const isAbove = textPosition === 'above';

  const arc = (
    <svg
      viewBox="0 0 360 180"
      width="360"
      height="100"
      className="absolute left-0"
      aria-hidden="true"
    >
      <path
        id={`curve-${label}`}
        d={
          isAbove
            ? 'M 30,100 Q 180,0 330,100'     
            : 'M 30,50 Q 180,140 330,50'    
        }
        fill="transparent"
      />
      <text fill="black" fontSize="52" fontWeight="bold">
        <textPath href={`#curve-${label}`} startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
    </svg>
  );

  return (
    <Link href={href} className="inline-block">
      <div className="flex flex-col items-center">
        {/* Arc above */}
        {isAbove && (
          <div className="relative h-[80px] w-[360px] flex justify-center items-end overflow-visible pt-1">
            {arc}
          </div>
        )}

        {/* Dice Image */}
        <div
          className={`transform ${rotateClass}`}
          style={{
            marginTop: isAbove ? '-64px' : '0px',
            marginBottom: !isAbove ? '-36px' : '0px',
          }}
        >
          <Image
            src="/media/Die.png"
            alt="Dice"
            width={220}
            height={220}
            className={`transition-transform group-hover:scale-110 ${
              rotation === 'left' ? 'spin-ccw' : 'spin-cw'
            }`}
          />
        </div>

        {/* Arc below */}
        {!isAbove && (
          <div className="relative h-[80px] w-[340px] flex justify-center items-start overflow-visible pb-1">
            {arc}
          </div>
        )}
      </div>
    </Link>
  );
}
