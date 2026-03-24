import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { businessPlanAPI } from '../services/api';

export default function BusinessPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await businessPlanAPI.getAll();
        setPlans(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch business plans', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-3">Business Plan eBooks</h1>
          <p className="text-gray-600 mb-10">Explore practical eBooks that help farmers plan and run profitable farming businesses.</p>

          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <article key={plan.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <p className="text-xs uppercase font-semibold text-light-green">{plan.category}</p>
                  <h2 className="text-2xl font-bold text-primary-green mt-1 mb-2">{plan.title}</h2>
                  <p className="text-gray-700 mb-3">{plan.summary}</p>
                  <p className="text-gray-600 whitespace-pre-wrap">{plan.content}</p>
                  {plan.document_url && (
                    <a
                      href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/..${plan.document_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-light-green text-primary-green px-4 py-2 rounded font-semibold hover:bg-accent-green transition"
                    >
                      Open eBook
                    </a>
                  )}
                </article>
              ))}
              {!plans.length && <p className="text-gray-500 col-span-full">No business plan eBooks published yet.</p>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
