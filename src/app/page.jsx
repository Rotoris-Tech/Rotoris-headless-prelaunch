import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Rotoris
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12">
          Discover our premium collection of innovative products
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/products/auriqua"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Auriqua</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Discover Auriqua
            </p>
          </Link>

          <Link
            href="/products/manifesta"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Manifesta</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Discover Manifesta
            </p>
          </Link>

          <Link
            href="/products/monarch"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Monarch</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Discover Monarch
            </p>
          </Link>

          <Link
            href="/products/astonia"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Astonia</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Discover Astonia
            </p>
          </Link>

          <Link
            href="/products/arvion"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Arvion</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Discover Arvion
            </p>
          </Link>

          <Link
            href="/test-animation"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Animation Test</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              View scroll animation demo
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
