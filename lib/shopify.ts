/**
 * Shopify Admin API Client
 * Handles communication with Shopify Admin API
 */

import { env } from './env';

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
  customer?: any;
  error?: string;
}

/**
 * Create a customer in Shopify
 * Used for newsletter signups
 */
export async function createShopifyCustomer(
  customerData: ShopifyCustomer
): Promise<ShopifyApiResponse> {
  const { storeDomain, adminApiAccessToken, adminApiVersion } = env.shopify;

  // Validate required environment variables
  if (!storeDomain || !adminApiAccessToken) {
    return {
      success: false,
      message: 'Shopify API credentials not configured',
      error: 'MISSING_CREDENTIALS',
    };
  }

  // Construct API URL
  const apiUrl = `https://${storeDomain}/admin/api/${adminApiVersion}/customers.json`;

  try {
    // Prepare customer data
    const customerPayload = {
      customer: {
        email: customerData.email,
        first_name: customerData.firstName || '',
        last_name: customerData.lastName || '',
        phone: customerData.phone || '',
        tags: customerData.tags?.join(', ') || 'newsletter',
        accepts_marketing: customerData.acceptsMarketing ?? true,
        email_marketing_consent: {
          state: customerData.acceptsMarketing ? 'subscribed' : 'not_subscribed',
          opt_in_level: 'single_opt_in',
          consent_updated_at: new Date().toISOString(),
        },
      },
    };

    // Make API request to Shopify
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiAccessToken,
      },
      body: JSON.stringify(customerPayload),
    });

    const data = await response.json();

    // Handle response
    if (!response.ok) {
      // Check if customer already exists
      if (data.errors?.email?.includes('has already been taken')) {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.',
          error: 'ALREADY_SUBSCRIBED',
        };
      }

      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
        error: data.errors || 'UNKNOWN_ERROR',
      };
    }

    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      customer: data.customer,
    };
  } catch (error) {
    console.error('Shopify API Error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'NETWORK_ERROR',
    };
  }
}

/**
 * Update customer marketing consent
 */
export async function updateCustomerMarketing(
  customerId: string,
  acceptsMarketing: boolean
): Promise<ShopifyApiResponse> {
  const { storeDomain, adminApiAccessToken, adminApiVersion } = env.shopify;

  if (!storeDomain || !adminApiAccessToken) {
    return {
      success: false,
      message: 'Shopify API credentials not configured',
      error: 'MISSING_CREDENTIALS',
    };
  }

  const apiUrl = `https://${storeDomain}/admin/api/${adminApiVersion}/customers/${customerId}.json`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiAccessToken,
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          accepts_marketing: acceptsMarketing,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to update marketing preferences.',
        error: data.errors || 'UPDATE_FAILED',
      };
    }

    return {
      success: true,
      message: 'Marketing preferences updated successfully.',
      customer: data.customer,
    };
  } catch (error) {
    console.error('Shopify API Error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'NETWORK_ERROR',
    };
  }
}

/**
 * Search for a customer by email
 */
export async function findCustomerByEmail(
  email: string
): Promise<ShopifyApiResponse> {
  const { storeDomain, adminApiAccessToken, adminApiVersion } = env.shopify;

  if (!storeDomain || !adminApiAccessToken) {
    return {
      success: false,
      message: 'Shopify API credentials not configured',
      error: 'MISSING_CREDENTIALS',
    };
  }

  const apiUrl = `https://${storeDomain}/admin/api/${adminApiVersion}/customers/search.json?query=email:${encodeURIComponent(email)}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiAccessToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to search for customer.',
        error: data.errors || 'SEARCH_FAILED',
      };
    }

    const customer = data.customers?.[0];

    return {
      success: true,
      message: customer ? 'Customer found.' : 'Customer not found.',
      customer,
    };
  } catch (error) {
    console.error('Shopify API Error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'NETWORK_ERROR',
    };
  }
}
