"use client";

import { useState } from "react";

type ProductNewsletterSectionProps = {
  accentColor: string;
};

export function ProductNewsletterSection({ accentColor }: ProductNewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <section className="w-full py-16 bg-white/30 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h2
          className="text-4xl md:text-5xl font-bold font-rotoris"
          style={{ color: accentColor }}
        >
          Stay Updated
        </h2>
        <p className="text-lg md:text-xl text-black/70">
          Be the first to know about new releases, exclusive offers, and watchmaking insights.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-6 py-4 rounded-full border-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              borderColor: status === "error" ? "#EF4444" : `${accentColor}40`,
            }}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-8 py-4 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            style={{ backgroundColor: accentColor }}
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        {status === "error" && (
          <p className="text-sm text-red-600">Please enter a valid email address.</p>
        )}
        {status === "success" && (
          <p className="text-sm" style={{ color: accentColor }}>
            Thank you for subscribing!
          </p>
        )}
      </div>
    </section>
  );
}
