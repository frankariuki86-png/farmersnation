import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogsAPI } from '../services/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogsAPI.getAll(1);
        setPosts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-3">Blog Section</h1>
          <p className="text-gray-600 mb-10">Expert articles and updates from the FARMERS NATION team.</p>

          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-xs uppercase font-semibold text-light-green">{post.category || 'Farming'}</p>
                  <h2 className="text-2xl font-bold text-primary-green mt-1 mb-2">{post.title}</h2>
                  <p className="text-gray-700">{post.excerpt || post.content}</p>
                </article>
              ))}
              {!posts.length && <p className="text-gray-500">No blog posts found.</p>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
