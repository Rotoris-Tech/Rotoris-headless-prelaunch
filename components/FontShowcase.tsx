/**
 * Font Showcase Component
 * Demonstrates all custom fonts with different weights
 * Use this component to preview fonts during development
 */

export function FontShowcase() {
  return (
    <div className="space-y-12 p-8">
      {/* Rotoris Sans */}
      <section>
        <h2 className="mb-6 text-3xl font-bold font-rotoris">Rotoris Sans</h2>
        <div className="space-y-4">
          <div className="font-rotoris font-extralight text-4xl">
            Extra Light (200) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-rotoris font-light text-4xl">
            Light (300) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-rotoris font-normal text-4xl">
            Regular (400) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-rotoris font-medium text-4xl">
            Medium (500) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-rotoris font-semibold text-4xl">
            Semi Bold (600) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-rotoris font-bold text-4xl">
            Bold (700) - The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </section>

      {/* Switzer Variable */}
      <section>
        <h2 className="mb-6 text-3xl font-bold font-rotoris">Switzer (Variable)</h2>
        <div className="space-y-4">
          <div className="font-switzer font-thin text-4xl">
            Thin (100) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-extralight text-4xl">
            Extra Light (200) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-light text-4xl">
            Light (300) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-normal text-4xl">
            Regular (400) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-medium text-4xl">
            Medium (500) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-semibold text-4xl">
            Semi Bold (600) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-bold text-4xl">
            Bold (700) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-extrabold text-4xl">
            Extra Bold (800) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-switzer font-black text-4xl">
            Black (900) - The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </section>

      {/* Decimal */}
      <section>
        <h2 className="mb-6 text-3xl font-bold font-rotoris">Decimal</h2>
        <div className="space-y-4">
          <div className="font-decimal font-thin text-4xl">
            Thin (100) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-decimal font-extralight text-4xl">
            Extra Light (200) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-decimal font-light text-4xl">
            Light (300) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-decimal font-normal text-4xl">
            Book (400) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-decimal font-medium text-4xl">
            Medium (500) - The quick brown fox jumps over the lazy dog
          </div>
          <div className="font-decimal font-black text-4xl">
            Black (900) - The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="mb-6 text-3xl font-bold font-rotoris">Usage Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-rotoris font-semibold text-5xl mb-2">
              Heading with Rotoris Sans SemiBold
            </h3>
            <p className="font-switzer text-lg">
              Body text with Switzer font. This is how your paragraphs will look
              with the default font configuration. It&apos;s optimized for readability
              and performance using a variable font.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <blockquote className="font-decimal font-light text-2xl italic">
              &ldquo;Elegant quotes and special content can use Decimal font
              for a sophisticated serif look.&rdquo;
            </blockquote>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-secondary rounded-lg">
              <h4 className="font-rotoris font-bold text-xl mb-2">Card Title</h4>
              <p className="font-switzer text-sm">Card description using Switzer.</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg">
              <h4 className="font-rotoris font-bold text-xl mb-2">Card Title</h4>
              <p className="font-switzer text-sm">Card description using Switzer.</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg">
              <h4 className="font-rotoris font-bold text-xl mb-2">Card Title</h4>
              <p className="font-switzer text-sm">Card description using Switzer.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
