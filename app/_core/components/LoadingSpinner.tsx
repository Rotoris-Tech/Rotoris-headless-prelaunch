/**
 * Reusable Loading Spinner Component
 * Used by loading.tsx files throughout the app
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export function LoadingSpinner({
  size = 'lg',
  fullScreen = true,
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
