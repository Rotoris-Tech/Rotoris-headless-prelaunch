import Link from "next/link";
import { productsData } from "../../data/products";

const product = productsData.arvion;

export const metadata = {
  title: `${product.name} - Rotoris`,
  description: product.description,
};

export default function Arvion() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
        >
          ← Back to Home
        </Link>

        <div className="mt-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{product.icon}</div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {product.name}
            </h1>
          </div>

          <p className="mt-6 text-xl leading-8 text-zinc-600 dark:text-zinc-400 text-center max-w-3xl mx-auto">
            {product.description}
          </p>

          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Product Overview
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                {product.overview}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Key Features
              </h2>
              <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                {product.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Specifications
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                {product.specifications}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
