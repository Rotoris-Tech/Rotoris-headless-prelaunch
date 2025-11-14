import { Metadata } from 'next';
import { LayoutShell } from '@/components/core/LayoutShell';
import { ProductPageLayout } from '@/components/product/layouts/ProductPageLayout';
import { MonarchHero } from '@/components/product/monarch/MonarchHero';
import { MonarchStory } from '@/components/product/monarch/MonarchStory';
import { KeyMaterialsSection } from '@/components/product/shared/KeyMaterialsSection';
import { CenterMessageSection } from '@/components/product/shared/CenterMessageSection';
import { WatchQuoteSection } from '@/components/product/shared/WatchQuoteSection';
import { WatchPreviewSection } from '@/components/product/shared/WatchPreviewSection';
import { ProductNewsletterSection } from '@/components/product/shared/ProductNewsletterSection';
import { monarchData } from './productData';

export const metadata: Metadata = {
  title: 'Monarch Collection',
  description: 'Command attention, master time. Discover the Monarch collection of luxury timepieces.',
};

export default function MonarchPage() {
  return (
    <LayoutShell>
      <ProductPageLayout>
        {/* Hero Section - Unique to Monarch */}
        <MonarchHero
          title={monarchData.hero.title}
          subtitle={monarchData.hero.subtitle}
          videoSrc={monarchData.hero.videoSrc}
        />

        {/* Story Section - Unique to Monarch */}
        <MonarchStory
          story={monarchData.story.text}
          heritage={monarchData.story.heritage}
        />

        {/* Shared Sections - Configured via data */}
        <div className="container mx-auto px-4">
          <KeyMaterialsSection
            materials={monarchData.materials}
            title="Superior Construction"
            subtitle="Built to withstand anything"
          />
        </div>

        <CenterMessageSection
          title={monarchData.centerMessage.title}
          message={monarchData.centerMessage.message}
        />

        <WatchQuoteSection
          quote={monarchData.quote.text}
          author={monarchData.quote.author}
        />

        <div className="container mx-auto px-4">
          <WatchPreviewSection
            imageSrc={monarchData.preview.imageSrc}
            imageAlt={monarchData.preview.imageAlt}
            title={monarchData.preview.title}
            description={monarchData.preview.description}
            reverse={true}
          />
        </div>

        <ProductNewsletterSection
          title={monarchData.newsletter.title}
          subtitle={monarchData.newsletter.subtitle}
          productName={monarchData.newsletter.productName}
        />
      </ProductPageLayout>
    </LayoutShell>
  );
}
