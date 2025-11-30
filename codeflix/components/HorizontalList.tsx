// components/HorizontalList.tsx
'use client';
import { ReactNode } from 'react';
import { useMomentumScroll } from '@/hook/useMomentumScroll';

interface Props {
  children: ReactNode;
  className?: string; // Para permitir override de gaps o paddings
}

export default function HorizontalList({ children, className = '' }: Props) {
  const scrollRef = useMomentumScroll();

  return (
    <div
      ref={scrollRef}
      className={`flex overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </div>
  );
}