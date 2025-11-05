import Link from "next/link";

export default function Home() {
  const products = [
    { name: "Auriqua", href: "/products/auriqua", description: "Discover the excellence of Auriqua" },
    { name: "Manifesta", href: "/products/manifesta", description: "Experience Manifesta's innovation" },
    { name: "Monarch", href: "/products/monarch", description: "Rule with Monarch" },
    { name: "Astonia", href: "/products/astonia", description: "Explore Astonia's possibilities" },
    { name: "Arvion", href: "/products/arvion", description: "Elevate with Arvion" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Welcome to Rotoris
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Discover our premium product collection
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-8">
            Our Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {product.name}
                </h3>
                <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                  {product.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Learn more
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
