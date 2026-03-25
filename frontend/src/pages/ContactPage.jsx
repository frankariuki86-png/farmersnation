import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-4">Contact FARMERS NATION</h1>
          <p className="text-gray-600 mb-8">Reach out for support, farm visits, training, or partnership opportunities.</p>

          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <p><span className="font-semibold text-primary-green">Phone:</span> 0725822740</p>
            <p><span className="font-semibold text-primary-green">WhatsApp:</span> 0725822740</p>
            <p><span className="font-semibold text-primary-green">Location:</span> Busia, Kenya</p>
            <a
              href="https://wa.me/254725822740"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-light-green text-primary-green px-6 py-3 rounded-lg font-semibold hover:bg-accent-green transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
