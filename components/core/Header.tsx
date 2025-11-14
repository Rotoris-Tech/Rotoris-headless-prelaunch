import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-rotoris">
            Rotoris
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/products/auriqua"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Auriqua
            </Link>
            <Link
              href="/products/monarch"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Monarch
            </Link>
            <Link
              href="/#newsletter"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Newsletter
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
