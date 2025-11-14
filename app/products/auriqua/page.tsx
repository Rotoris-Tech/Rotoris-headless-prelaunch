import { Metadata } from 'next';
import { LayoutShell } from '@/components/core/LayoutShell';
import { ProductPageLayout } from '@/components/product/layouts/ProductPageLayout';
import { AuriquaHero } from '@/components/product/auriqua/AuriquaHero';
import { AuriquaStory } from '@/components/product/auriqua/AuriquaStory';
import { KeyMaterialsSection } from '@/components/product/shared/KeyMaterialsSection';
import { CenterMessageSection } from '@/components/product/shared/CenterMessageSection';
import { WatchQuoteSection } from '@/components/product/shared/WatchQuoteSection';
import { WatchPreviewSection } from '@/components/product/shared/WatchPreviewSection';
import { ProductNewsletterSection } from '@/components/product/shared/ProductNewsletterSection';
import { auriquaData } from './productData';

export const metadata: Metadata = {
  title: 'Auriqua Collection',
  description: 'Where elegance meets precision. Discover the Auriqua collection of luxury timepieces.',
};

export default function AuriquaPage() {
  return (
    <LayoutShell>
      <ProductPageLayout>
        {/* Hero Section - Unique to Auriqua */}
        <AuriquaHero
          title={auriquaData.hero.title}
          subtitle={auriquaData.hero.subtitle}
          videoSrc={auriquaData.hero.videoSrc}
        />

        {/* Story Section - Unique to Auriqua */}
        <AuriquaStory
          story={auriquaData.story.text}
          heritage={auriquaData.story.heritage}
        />

        {/* Shared Sections - Configured via data */}
        <div className="container mx-auto px-4">
          <KeyMaterialsSection
            materials={auriquaData.materials}
            title="Premium Materials"
            subtitle="Crafted with the finest components"
          />
        </div>

        <CenterMessageSection
          title={auriquaData.centerMessage.title}
          message={auriquaData.centerMessage.message}
        />

        <WatchQuoteSection
          quote={auriquaData.quote.text}
          author={auriquaData.quote.author}
        />

        <div className="container mx-auto px-4">
          <WatchPreviewSection
            imageSrc={auriquaData.preview.imageSrc}
            imageAlt={auriquaData.preview.imageAlt}
            title={auriquaData.preview.title}
            description={auriquaData.preview.description}
          />
        </div>

        <ProductNewsletterSection
          title={auriquaData.newsletter.title}
          subtitle={auriquaData.newsletter.subtitle}
          productName={auriquaData.newsletter.productName}
        />
      </ProductPageLayout>
    </LayoutShell>
  );
}
