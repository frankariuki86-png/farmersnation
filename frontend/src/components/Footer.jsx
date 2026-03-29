import React from 'react';
import { FaFacebook, FaLinkedin, FaYoutube, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  const phone = '0725822740';
  const whatsappUrl = `https://wa.me/${phone.replace(/^0/, '254')}`;
  const onYoutubeClick = (event) => {
    event.preventDefault();
    window.alert('YouTube channel coming soon.');
  };

  return (
    <footer className="bg-primary-green text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-light-green mb-4">About FARMERS NATION</h3>
            <p className="text-gray-300">
              Turning Farms Into Fortunes. Empowering African farmers with knowledge, tools, and market access for sustainable growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-light-green mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-light-green transition">Home</Link></li>
              <li><Link to="/guides" className="hover:text-light-green transition">Farming Guides</Link></li>
              <li><Link to="/blog" className="hover:text-light-green transition">Blog</Link></li>
              <li><Link to="/marketplace" className="hover:text-light-green transition">Marketplace</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-light-green mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center gap-2">
                <FaPhone className="text-light-green" />
                {phone}
              </p>
              <p className="flex items-center gap-2">
                <FaWhatsapp className="text-light-green" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-light-green">
                  Chat on WhatsApp
                </a>
              </p>
              <p className="text-sm">📍 Busia, Kenya</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2026 FARMERS NATION. All rights reserved. | Turning Farms Into Fortunes
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/rekless.feddy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="bg-opacity-20 bg-white p-3 rounded-full hover:bg-light-green transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.linkedin.com/in/farmers-nation-2920253b0?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="bg-opacity-20 bg-white p-3 rounded-full hover:bg-light-green transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="#youtube-coming-soon"
              onClick={onYoutubeClick}
              aria-label="YouTube"
              className="bg-opacity-20 bg-white p-3 rounded-full hover:bg-light-green transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
