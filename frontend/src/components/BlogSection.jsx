import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaSpinner } from 'react-icons/fa';
import { blogsAPI } from '../services/api';
import { getAssetUrl } from '../utils/url';

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogsAPI.getAll(1);
        setBlogs((response.data.data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-primary-green">Latest Blog</h2>
            <p className="text-gray-600 mt-2">Practical insights for smarter farming decisions</p>
          </div>
          <Link to="/blog" className="text-light-green font-semibold hover:text-primary-green transition">
            View all posts
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <FaSpinner className="animate-spin text-3xl text-primary-green mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <article key={post.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition">
                {post.image_url ? (
                  <img
                    src={getAssetUrl(post.image_url)}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="flex items-center gap-2 text-light-green mb-3">
                  <FaNewspaper />
                  <span className="text-sm font-semibold uppercase">{post.category || 'Farming'}</span>
                </div>
                <h3 className="text-xl font-bold text-primary-green mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt || post.content}</p>
                <Link to="/blog" className="text-primary-green font-semibold hover:text-secondary-green transition">
                  Read more
                </Link>
              </article>
            ))}

            {!blogs.length && (
              <p className="text-gray-500 col-span-full">No blog posts available yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
