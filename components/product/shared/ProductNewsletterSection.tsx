'use client';

import { NewsletterForm } from '@/components/NewsletterForm';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface ProductNewsletterSectionProps {
  title?: string;
  subtitle?: string;
  productName?: string;
}

export function ProductNewsletterSection({
  title = 'Stay Updated',
  subtitle = 'Subscribe to receive exclusive updates and early access',
  productName,
}: ProductNewsletterSectionProps) {
  const ref = useSectionReveal();

  return (
    <div ref={ref} className="py-20 bg-muted/20">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-rotoris mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>

        <NewsletterForm
          placeholder="Enter your email"
          buttonText={productName ? `Notify me about ${productName}` : 'Subscribe'}
          inline={true}
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  );
}
