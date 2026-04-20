'use client';

import { ReactNode, useEffect, useState } from 'react';

interface AppLayoutClientProps {
  children: ReactNode;
  className?: string;
}

export default function AppLayoutClient({
  children,
  className = 'h-full',
}: AppLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <body suppressHydrationWarning className={className} />;
  }

  return <body className={className}>{children}</body>;
}
