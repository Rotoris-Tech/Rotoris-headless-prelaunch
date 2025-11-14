import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutShellProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function LayoutShell({
  children,
  showHeader = true,
  showFooter = true
}: LayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
