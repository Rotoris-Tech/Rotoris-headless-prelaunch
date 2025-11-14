import Link from 'next/link';

/**
 * Reusable 404 Not Found Component
 * Used by not-found.tsx files throughout the app
 */

interface NotFoundContentProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  homeLinkText?: string;
}

export function NotFoundContent({
  title = 'Page Not Found',
  message = "The page you're looking for doesn't exist or has been moved.",
  showHomeLink = true,
  homeLinkText = 'Go back home',
}: NotFoundContentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-9xl font-bold font-rotoris text-primary/20">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold font-rotoris">{title}</h2>
        <p className="mb-8 text-muted-foreground">{message}</p>

        {showHomeLink && (
          <Link
            href="/homepage"
            className="inline-block rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {homeLinkText}
          </Link>
        )}
      </div>
    </div>
  );
}
