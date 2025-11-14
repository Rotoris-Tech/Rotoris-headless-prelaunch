import { ReactNode } from 'react';

interface ProductPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ProductPageLayout({ children, className = '' }: ProductPageLayoutProps) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}

interface ProductSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function ProductSection({ children, className = '', id }: ProductSectionProps) {
  return (
    <section id={id} className={`w-full py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
