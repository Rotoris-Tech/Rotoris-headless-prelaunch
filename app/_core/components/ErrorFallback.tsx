'use client';

/**
 * Reusable Error Fallback Component
 * Used by error.tsx files throughout the app
 */

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong!',
  message = 'We apologize for the inconvenience. An error occurred while loading this page.',
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-4 text-2xl font-bold font-rotoris">{title}</h2>
        <p className="mb-2 text-muted-foreground">{message}</p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mb-6 mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-destructive">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-secondary p-4 text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
