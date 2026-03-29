import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBasket, FaSpinner, FaWhatsapp } from 'react-icons/fa';
import { marketplaceAPI } from '../services/api';
import { getAssetUrl } from '../utils/url';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await marketplaceAPI.getAll(1);
        setProducts((response.data.data || []).slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch marketplace products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-primary-green">Marketplace Products</h2>
            <p className="text-gray-600 mt-2">Buy and sell agricultural products with trusted suppliers</p>
          </div>
          <Link to="/marketplace" className="text-light-green font-semibold hover:text-primary-green transition">
            Browse marketplace
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <FaSpinner className="animate-spin text-3xl text-primary-green mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <article key={item.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition">
                {item.image_url ? (
                  <img
                    src={getAssetUrl(item.image_url)}
                    alt={item.name}
                    className="w-full h-36 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="flex items-center gap-2 text-light-green mb-2">
                  <FaShoppingBasket />
                  <span className="text-sm uppercase font-semibold">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold text-primary-green">{item.name}</h3>
                <p className="text-gray-600 text-sm my-3 line-clamp-2">{item.description}</p>
                <p className="text-2xl font-extrabold text-primary-green">KSH {item.price}</p>
                <p className="text-xs text-gray-500 mb-4">Per {item.unit || 'item'}</p>
                <a
                  href={`https://wa.me/${(item.seller_phone || '0725822740').replace(/^0/, '254')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <FaWhatsapp /> Contact seller
                </a>
              </article>
            ))}

            {!products.length && (
              <p className="text-gray-500 col-span-full">No products available yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
