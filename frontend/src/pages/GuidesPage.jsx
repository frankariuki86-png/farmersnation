import React, { useEffect, useState } from 'react';
import { FaSpinner, FaDownload, FaLock, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { guidesAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAccess, setUserAccess] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);
  const [paymentInitiating, setPaymentInitiating] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await guidesAPI.getAll();
      setGuides(response.data.data || []);

      // Check access for each guide
      const token = localStorage.getItem('token');
      if (token) {
        const accessMap = {};
        for (const guide of response.data.data || []) {
          try {
            const accessResponse = await paymentsAPI.checkAccess(guide.id);
            accessMap[guide.id] = accessResponse.data.hasAccess || false;
          } catch (error) {
            accessMap[guide.id] = false;
          }
        }
        setUserAccess(accessMap);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
      toast.error('Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleDownload = async (guideId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to download guides');
      navigate('/login');
      return;
    }

    try {
      setDownloadingId(guideId);
      const response = await paymentsAPI.checkAccess(guideId);

      if (!response.data.hasAccess) {
        toast.error('Please purchase this guide first');
        return;
      }

      // Get download URL
      const downloadResponse = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/guides/${guideId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!downloadResponse.ok) {
        throw new Error('Download failed');
      }

      const data = await downloadResponse.json();
      if (data.success && data.downloadUrl) {
        // Open download link
        window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}${data.downloadUrl}`, '_blank');
        toast.success('Download started');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download guide');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleInitiatePayment = async (guideId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase guides');
      navigate('/login');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setPaymentInitiating(guideId);
      const response = await paymentsAPI.initiateMpesa({
        phoneNumber,
        guideId
      });

      if (response.data.success) {
        toast.success('STK push sent! Check your phone to complete payment.');
        // Poll for payment status
        const pollInterval = setInterval(async () => {
          const accessResponse = await paymentsAPI.checkAccess(guideId);
          if (accessResponse.data.hasAccess) {
            clearInterval(pollInterval);
            setUserAccess({ ...userAccess, [guideId]: true });
            toast.success('Payment verified! Guide is now available for download.');
            setPhoneNumber('');
          }
        }, 2000);

        // Stop polling after 2 minutes
        setTimeout(() => clearInterval(pollInterval), 120000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.response?.data?.error || 'Failed to initiate payment');
    } finally {
      setPaymentInitiating(null);
    }
  };

  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-green mb-3">Farming Guides & E-Books</h1>
          <p className="text-gray-600 mb-10">
            Access comprehensive farming guides and e-books. Premium guides require a one-time payment of 100 KSH. {' '}
            <span className="font-semibold text-primary-green">Admin users have free access to all guides.</span>
          </p>

          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-green mx-auto" />
            </div>
          ) : (
            <div className="space-y-6">
              {guides.map((guide) => (
                <article key={guide.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs uppercase font-semibold text-light-green mb-2">{guide.category || 'Guide'}</p>
                      <h2 className="text-2xl font-bold text-primary-green mb-2">{guide.title}</h2>
                      <p className="text-gray-600 mb-3">{guide.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>👁️ Views: {guide.views || 0}</span>
                        <span>📥 Downloads: {guide.downloads || 0}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                      {userAccess[guide.id] ? (
                        // User has access - show download button
                        <button
                          onClick={() => handleDownload(guide.id)}
                          disabled={downloadingId === guide.id}
                          className="flex items-center justify-center gap-2 bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green disabled:opacity-50 transition whitespace-nowrap"
                        >
                          {downloadingId === guide.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <>
                              <FaDownload /> Download
                            </>
                          )}
                        </button>
                      ) : (
                        // User doesn't have access - show payment section or payment initiator
                        <div className="border border-light-green rounded-lg p-4 bg-green-50">
                          <div className="flex items-center gap-2 text-primary-green font-semibold mb-3">
                            <FaLock /> Price: 100 KSH
                          </div>
                          <div className="space-y-2">
                            <input
                              type="tel"
                              placeholder="Enter your M-Pesa number (e.g., 254712345678)"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <button
                              onClick={() => handleInitiatePayment(guide.id)}
                              disabled={paymentInitiating === guide.id}
                              className="w-full flex items-center justify-center gap-2 bg-light-green text-primary-green px-4 py-2 rounded hover:bg-accent-green disabled:opacity-50 transition font-semibold"
                            >
                              {paymentInitiating === guide.id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <>
                                  <FaPlay /> Pay & Download
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
              {!guides.length && <p className="text-gray-500 text-center py-12">No guides available yet.</p>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
