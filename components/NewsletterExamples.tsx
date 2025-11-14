/**
 * Newsletter Form Usage Examples
 * Copy these examples to use the newsletter form in different layouts
 */

import { NewsletterForm } from './NewsletterForm';

// Example 1: Simple inline newsletter (most common)
export function SimpleNewsletter() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-rotoris font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-muted-foreground mb-6">
          Get the latest updates and exclusive offers delivered to your inbox.
        </p>
        <NewsletterForm placeholder="Enter your email" buttonText="Subscribe" />
      </div>
    </section>
  );
}

// Example 2: Footer newsletter with names
export function FooterNewsletter() {
  return (
    <div className="bg-primary text-primary-foreground py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-rotoris font-bold mb-2">
              Join Our Community
            </h3>
            <p className="opacity-90">
              Be the first to know about new products, special offers, and company news.
            </p>
          </div>
          <div>
            <NewsletterForm
              showName={true}
              placeholder="Email address"
              buttonText="Join Now"
              className="text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 3: Vertical form with all fields
export function VerticalNewsletter() {
  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-lg">
      <h3 className="text-2xl font-rotoris font-semibold mb-2 text-center">
        Newsletter Signup
      </h3>
      <p className="text-muted-foreground text-center mb-6">
        Subscribe to receive updates and exclusive content.
      </p>
      <NewsletterForm
        showName={true}
        inline={false}
        placeholder="Email address"
        buttonText="Subscribe to Newsletter"
      />
    </div>
  );
}

// Example 4: Minimal inline
export function MinimalNewsletter() {
  return (
    <div className="flex items-center justify-between gap-4 p-6 bg-accent/50 rounded-lg">
      <p className="font-medium">Get our latest updates</p>
      <div className="flex-1 max-w-md">
        <NewsletterForm
          placeholder="your@email.com"
          buttonText="Sign Up"
        />
      </div>
    </div>
  );
}

// Example 5: Hero section newsletter
export function HeroNewsletter() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-rotoris font-bold mb-4">
          Stay in the Loop
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of subscribers getting exclusive updates and early access to new releases.
        </p>
        <NewsletterForm
          showName={true}
          placeholder="Enter your email address"
          buttonText="Get Early Access"
          className="max-w-xl mx-auto"
        />
        <p className="text-sm text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

// Example 6: Sidebar newsletter widget
export function SidebarNewsletter() {
  return (
    <aside className="p-6 bg-card border border-border rounded-lg">
      <h4 className="font-rotoris font-semibold text-lg mb-2">Newsletter</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Subscribe for weekly updates
      </p>
      <NewsletterForm
        inline={false}
        placeholder="Email"
        buttonText="Subscribe"
      />
    </aside>
  );
}

// Example 7: Full-width banner
export function BannerNewsletter() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-rotoris font-bold mb-2">
              Never Miss an Update
            </h3>
            <p className="opacity-90">
              Subscribe to our newsletter for the latest news and offers
            </p>
          </div>
          <div className="flex-1 max-w-lg w-full">
            <NewsletterForm
              placeholder="Enter your email"
              buttonText="Subscribe"
              className="text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 8: Modal/Popup newsletter
export function PopupNewsletter() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card max-w-md w-full p-8 rounded-2xl shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <h3 className="text-3xl font-rotoris font-bold mb-2">
            🎉 Special Offer!
          </h3>
          <p className="text-muted-foreground">
            Subscribe now and get 10% off your first order
          </p>
        </div>
        <NewsletterForm
          showName={true}
          inline={false}
          placeholder="Email address"
          buttonText="Claim My Discount"
        />
        <p className="text-xs text-muted-foreground text-center mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
