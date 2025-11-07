import Link from "next/link";

export const metadata = {
  title: "Manifesta - Rotoris",
  description: "Discover Manifesta by Rotoris",
};

export default function Manifesta() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Home
        </Link>

        <div className="mt-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Manifesta
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Welcome to Manifesta - a premium product by Rotoris.
          </p>

          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Product Overview
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Add your product description here. Highlight the key features and benefits of Manifesta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Key Features
              </h2>
              <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                <li>• Feature 1</li>
                <li>• Feature 2</li>
                <li>• Feature 3</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Specifications
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Add technical specifications and details here.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
