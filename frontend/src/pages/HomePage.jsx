import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import GuidesSection from '../components/GuidesSection';
import BlogSection from '../components/BlogSection';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <GuidesSection />
      <BlogSection />
      <ProductsSection />
      
      {/* Community Section */}
      <section className="bg-gradient-to-r from-primary-green to-secondary-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Farming Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with thousands of progressive farmers across Africa. Share experiences, ask questions, and grow together.
          </p>
          <a
            href="https://wa.me/254725822740"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-light-green text-primary-green px-8 py-3 rounded-lg font-bold text-lg hover:bg-accent-green transform hover:-translate-y-1 transition"
          >
            Join on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
