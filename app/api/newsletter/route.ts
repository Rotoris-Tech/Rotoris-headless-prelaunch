/**
 * Newsletter Subscription API Route
 * POST /api/newsletter
 * Creates a customer in Shopify when someone subscribes to the newsletter
 */

import { NextRequest, NextResponse } from 'next/server';
import { createShopifyCustomer } from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, firstName, lastName, phone } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required.',
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    // Create customer in Shopify
    const result = await createShopifyCustomer({
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      phone: phone?.trim(),
      tags: ['newsletter', 'website-signup'],
      acceptsMarketing: true,
    });

    // Return response based on result
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
        },
        { status: 200 }
      );
    } else {
      // Handle specific errors
      const statusCode =
        result.error === 'ALREADY_SUBSCRIBED'
          ? 409 // Conflict
          : result.error === 'MISSING_CREDENTIALS'
          ? 500 // Server error
          : 400; // Bad request

      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: statusCode }
      );
    }
  } catch (error) {
    console.error('Newsletter API Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Optionally handle GET requests to check if API is working
export async function GET() {
  return NextResponse.json(
    {
      message: 'Newsletter API is running',
      endpoint: 'POST /api/newsletter',
      requiredFields: ['email'],
      optionalFields: ['firstName', 'lastName', 'phone'],
    },
    { status: 200 }
  );
}
