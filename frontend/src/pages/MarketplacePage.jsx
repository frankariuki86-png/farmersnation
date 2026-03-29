import React, { useEffect, useState } from 'react';
import { FaSpinner, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { marketplaceAPI } from '../services/api';
import { getAssetUrl } from '../utils/url';

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
                <article key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  {/* Product Image */}
                  {item.image_url ? (
                    <div className="w-full h-48 overflow-hidden bg-gray-200">
                      <img 
                        src={getAssetUrl(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition"
                        onError={(e) => {
                          const imageContainer = e.currentTarget.parentElement;
                          if (imageContainer) {
                            imageContainer.outerHTML = '<div class="w-full h-48 bg-gradient-to-br from-light-green to-accent-green flex items-center justify-center"><span class="text-4xl">🌾</span></div>';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-light-green to-accent-green flex items-center justify-center">
                      <span className="text-4xl">🌾</span>
                    </div>
                  )}
                  
                  {/* Product Details */}
                  <div className="p-6">
                    <p className="text-xs uppercase font-semibold text-light-green mb-2">{item.category}</p>
                    <h2 className="text-2xl font-bold text-primary-green mb-2">{item.name}</h2>
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    {/* Stock Status */}
                    <p className="text-sm text-gray-500 mb-3">
                      {item.stock > 0 ? (
                        <span className="text-green-600 font-semibold">✓ In Stock ({item.stock})</span>
                      ) : (
                        <span className="text-red-600 font-semibold">✗ Out of Stock</span>
                      )}
                    </p>
                    
                    {/* Price and Unit */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-extrabold text-primary-green">KSH {item.price}</span>
                      <span className="text-sm text-gray-600">Per {item.unit || 'item'}</span>
                    </div>
                    
                    {/* Contact Button */}
                    <a
                      href={`https://wa.me/${(item.seller_phone || '0725822740').replace(/^0/, '254')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      <FaWhatsapp /> Contact Seller
                    </a>
                  </div>
                </article>
              ))}
              {!products.length && <p className="text-gray-500 col-span-full text-center py-8">No products found.</p>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
