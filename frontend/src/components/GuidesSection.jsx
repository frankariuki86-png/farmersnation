import React from 'react';
import { Link } from 'react-router-dom';
import { FaFeather, FaHorseHead, FaTractor, FaSeedling } from 'react-icons/fa';

const guideCategories = [
  {
    id: 1,
    title: 'Poultry Farming',
    description: 'Learn modern poultry techniques including layer and broiler farming.',
    icon: FaFeather,
    category: 'poultry'
  },
  {
    id: 2,
    title: 'Goat Farming',
    description: 'Start your goat farming business with proven strategies.',
    icon: FaHorseHead,
    category: 'goat'
  },
  {
    id: 3,
    title: 'Dairy Farming',
    description: 'Establish a profitable dairy operation with quality milk production.',
    icon: FaTractor,
    category: 'dairy'
  },
  {
    id: 4,
    title: 'Crop Farming',
    description: 'Grow high-value crops with modern sustainable techniques.',
    icon: FaSeedling,
    category: 'crop'
  },
];

export default function GuidesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-green mb-4">Farming Guides</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master the essentials of modern farming with our comprehensive guides and e-books
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guideCategories.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <Link
                key={guide.id}
                to="/guides"
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition"
              >
                <div className="flex justify-center mb-4 text-4xl text-light-green">
                  <IconComponent />
                </div>
                <h3 className="text-xl font-bold text-primary-green mb-3 text-center">{guide.title}</h3>
                <p className="text-gray-600 text-center text-sm mb-4">{guide.description}</p>
                <div className="flex justify-center items-center text-light-green font-semibold">
                  Learn More <span className="ml-2">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/guides"
            className="inline-block bg-light-green text-primary-green px-8 py-3 rounded-lg font-semibold hover:bg-accent-green transition"
          >
            View All Guides
          </Link>
        </div>
      </div>
    </section>
  );
}
