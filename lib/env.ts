/**
 * Environment Variables
 * Centralized access to environment variables with type safety
 */

export const env = {
  // Site Configuration
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // Analytics
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,

  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL,

  // Shopify Admin API (Server-side only)
  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
    adminApiAccessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
    adminApiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || '2025-01',
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Validate required environment variables
 * Call this at app startup to ensure all required vars are set
 */
export function validateEnv() {
  const required = {
    NEXT_PUBLIC_SITE_URL: env.siteUrl,
    SHOPIFY_STORE_DOMAIN: env.shopify.storeDomain,
    SHOPIFY_ADMIN_API_ACCESS_TOKEN: env.shopify.adminApiAccessToken,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0 && env.isProduction) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.production file or hosting platform settings.'
    );
  }

  if (missing.length > 0 && env.isDevelopment) {
    console.warn(
      `⚠️  Missing environment variables: ${missing.join(', ')}\n` +
      'Some features may not work. Check your .env.local file.'
    );
  }

  return true;
}
