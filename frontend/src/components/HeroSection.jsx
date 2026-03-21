import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary-green to-secondary-green text-white py-24 md:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-light-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-light-green rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Empowering Farmers Across Africa
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
          Learn, grow, and profit with FARMERS NATION. Your complete guide to modern sustainable farming.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/guides"
            className="inline-block bg-light-green text-primary-green px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-green transform hover:-translate-y-1 transition"
          >
            Start Farming
          </Link>
          <a
            href="https://wa.me/254725822740"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-light-green text-light-green px-8 py-4 rounded-lg font-bold text-lg hover:bg-light-green hover:text-primary-green transform hover:-translate-y-1 transition"
          >
            Join Community
          </a>
        </div>

        <p className="mt-8 text-gray-200 italic">
          Turning Farms Into Fortunes | Location: Busia, Kenya | 📱 0725822740
        </p>
      </div>
    </section>
  );
}
