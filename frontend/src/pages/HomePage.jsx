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

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-green mb-3">Training Registration</h2>
              <p className="text-gray-600 mb-5">Apply for practical farming training sessions and mentorship from FARMERS NATION experts.</p>
              <a href="/training" className="inline-block bg-light-green text-primary-green px-6 py-3 rounded-lg font-semibold hover:bg-accent-green transition">
                Register for Training
              </a>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-primary-green font-semibold mb-2">What you get</p>
              <p className="text-gray-600">Hands-on guidance, practical modules, and follow-up support for your farm growth plan.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-green mb-3">Farm Visit Booking</h2>
              <p className="text-gray-600 mb-5">Book either type of visit: we visit your farm, or you visit our demonstration farm.</p>
              <a href="/farm-visits" className="inline-block bg-light-green text-primary-green px-6 py-3 rounded-lg font-semibold hover:bg-accent-green transition">
                Book Farm Visit
              </a>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-primary-green font-semibold mb-2">Visit options</p>
              <p className="text-gray-600">Choose your preferred date and purpose so the team can prepare for a productive session.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-green mb-3">Business Plan eBooks</h2>
              <p className="text-gray-600 mb-5">Download practical eBooks to help you plan profitable farming businesses step by step.</p>
              <a href="/business-plans" className="inline-block bg-light-green text-primary-green px-6 py-3 rounded-lg font-semibold hover:bg-accent-green transition">
                View Business Plan eBooks
              </a>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-primary-green font-semibold mb-2">Admin managed</p>
              <p className="text-gray-600">The admin dashboard controls publishing, editing, and deleting business plan eBooks.</p>
            </div>
          </div>
        </div>
      </section>
      
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
