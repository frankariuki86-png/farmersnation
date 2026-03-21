import React, { useEffect, useState } from 'react';
import { FaSpinner, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { marketplaceAPI } from '../services/api';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await marketplaceAPI.getAll(1);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-3">Product Section</h1>
          <p className="text-gray-600 mb-10">Explore farm products listed on our marketplace.</p>

          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <article key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <p className="text-xs uppercase font-semibold text-light-green">{item.category}</p>
                  <h2 className="text-2xl font-bold text-primary-green mt-1">{item.name}</h2>
                  <p className="text-gray-600 my-3">{item.description}</p>
                  <p className="text-2xl font-extrabold text-primary-green">KSH {item.price}</p>
                  <p className="text-sm text-gray-500 mb-4">Per {item.unit || 'item'}</p>
                  <a
                    href={`https://wa.me/${(item.seller_phone || '0725822740').replace(/^0/, '254')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <FaWhatsapp /> Contact seller
                  </a>
                </article>
              ))}
              {!products.length && <p className="text-gray-500 col-span-full">No products found.</p>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
