"use client";

import Link from "next/link";
import { productsData } from "../../data/products";
import { useState } from "react";

const product = productsData.auriqua;

export default function Auriqua() {
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { email, instagram });
    // Handle form submission
    alert("Thank you for joining the waitlist!");
    setEmail("");
    setInstagram("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-sm tracking-[0.3em] text-gray-400 mb-8 uppercase">
            Rotoris
          </h1>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            AURIQUA
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-4">
            For those who command precision.
          </p>

          <p className="text-sm text-gray-500 tracking-wider">
            {product.title}
          </p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-center md:text-left">
            Where super-yacht precision meets open water.
          </h3>
        </div>
      </section>

      {/* Feature Image Section 1 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="aspect-[16/9] bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Product Image 1
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg leading-relaxed text-gray-400 text-center md:text-left">
            {product.overview}
          </p>
        </div>
      </section>

      {/* Feature Image Section 2 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Product Image 2
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900/20 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-light mb-16">
            Forged for the Unshaken, Crafted to Withstand Time and Tide.
          </h3>

          {/* Detail images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                Detail Image 1
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                Detail Image 2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h4 className="text-2xl md:text-3xl font-light mb-12 text-center">
            Key Features
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {product.features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-800 to-gray-900 rounded-full flex items-center justify-center">
                  <div className="text-2xl md:text-3xl">
                    {index === 0 ? "🤖" : index === 1 ? "🎯" : index === 2 ? "📡" : "⚡"}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            {product.specifications}
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl md:text-7xl text-gray-700 mb-8">&ldquo;</div>
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-8">
            Precision isn&apos;t just a feature. It&apos;s a philosophy.
          </p>

          {/* Product detail image */}
          <div className="aspect-[3/4] max-w-xs mx-auto bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Product Detail
            </div>
          </div>
        </div>
      </section>

      {/* Join Waitlist Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-gray-700 rounded flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="text-2xl md:text-3xl font-light mb-2">Join Waitlist</h4>
          </div>

          <p className="text-sm text-gray-400 text-center mb-8 leading-relaxed">
            Be among the first to experience Auriqua. Reserve your place in line for exclusive early access and special launch pricing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Email us</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@example.com"
                className="w-full bg-transparent border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">Instagram username</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourusername"
                className="w-full bg-transparent border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded transition-colors"
            >
              Submit
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6 leading-relaxed">
            By providing your email and Instagram, you consent to Rotoris&apos;s{" "}
            <a href="#" className="underline hover:text-gray-400">Privacy Policy</a> and agree to receive updates about Auriqua.
          </p>
        </div>
      </section>

      {/* Back to Top */}
      <div className="py-12 px-4 text-center border-t border-gray-800">
        <button
          onClick={scrollToTop}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Back to Top
        </button>
      </div>
    </div>
  );
}
