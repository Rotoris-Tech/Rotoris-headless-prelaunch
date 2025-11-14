// Global TypeScript type definitions

// Home page types
export interface HomeScene {
  id: string;
  label: string;
  startTime: number;
  endTime: number;
  overlayTitle?: string;
  overlaySubtitle?: string;
  overlayPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

// Product page types
export interface Material {
  name: string;
  description: string;
  icon?: string;
}

export interface ProductHeroData {
  title: string;
  subtitle: string;
  videoSrc?: string;
}

export interface ProductStoryData {
  text: string;
  heritage: string;
}

export interface ProductQuoteData {
  text: string;
  author?: string;
}

export interface ProductPreviewData {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface ProductNewsletterData {
  title: string;
  subtitle: string;
  productName?: string;
}

export interface ProductData {
  hero: ProductHeroData;
  story: ProductStoryData;
  materials: Material[];
  centerMessage: {
    title: string;
    message: string;
  };
  quote: ProductQuoteData;
  preview: ProductPreviewData;
  newsletter: ProductNewsletterData;
}

// Newsletter types
export interface NewsletterFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Shopify types
export interface ShopifyCustomer {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  acceptsMarketing?: boolean;
}

export interface ShopifyApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

// Component prop types
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

export interface NotFoundContentProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  homeLinkText?: string;
}
