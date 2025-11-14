import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold font-rotoris mb-4">Rotoris</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Premium timepieces crafted with precision and passion.
              Discover our collection of luxury watches.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold font-rotoris mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products/auriqua" className="text-muted-foreground hover:text-foreground transition-colors">
                  Auriqua Collection
                </Link>
              </li>
              <li>
                <Link href="/products/monarch" className="text-muted-foreground hover:text-foreground transition-colors">
                  Monarch Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold font-rotoris mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#newsletter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Rotoris. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
