import type { Metadata } from "next";
import "./styles/globals.css";
import { ErrorSuppressor } from "./_core/components/ErrorSuppressor";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Rotoris Headless - Premium Product Solutions",
    template: "%s | Rotoris Headless",
  },
  description: "Discover premium products including Auriqua, Monarch, Arvion, Astonia, and Manifesta. Innovative solutions crafted with excellence.",
  keywords: ["premium products", "innovative solutions", "Auriqua", "Monarch", "Arvion", "Astonia", "Manifesta"],
  authors: [{ name: "Rotoris Headless" }],
  creator: "Rotoris Headless",
  publisher: "Rotoris Headless",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Rotoris Headless - Premium Product Solutions",
    description: "Discover premium products including Auriqua, Monarch, Arvion, Astonia, and Manifesta.",
    siteName: "Rotoris Headless",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotoris Headless - Premium Product Solutions",
    description: "Discover premium products including Auriqua, Monarch, Arvion, Astonia, and Manifesta.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var originalError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var message = (args[0] || '').toString();
                  if (
                    message.includes('not valid semver') ||
                    message.includes('validateAndParse') ||
                    message.includes('Invalid argument')
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorSuppressor />
        {children}
      </body>
    </html>
  );
}
