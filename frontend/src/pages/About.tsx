import React from 'react';
import { Shield, Users, Globe, Award } from 'lucide-react';

const About = () => {
  const stats = [
    {
      value: '10k+',
      label: 'Active Users',
      icon: Users
    },
    {
      value: '5k+',
      label: 'Products Listed',
      icon: Globe
    },
    {
      value: '1k+',
      label: 'Verified Vendors',
      icon: Shield
    },
    {
      value: '99%',
      label: 'Customer Satisfaction',
      icon: Award
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About MarketPlace</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're building the most trusted marketplace for buyers and sellers to connect, 
          trade, and grow together.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To create a thriving ecosystem where buyers can discover unique products from trusted vendors, 
              and sellers can grow their businesses with the tools and support they need to succeed.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Shield className="h-5 w-5 text-indigo-600 mr-3" />
                <span>Verified vendors and secure transactions</span>
              </li>
              <li className="flex items-center">
                <Users className="h-5 w-5 text-indigo-600 mr-3" />
                <span>Strong community support</span>
              </li>
              <li className="flex items-center">
                <Globe className="h-5 w-5 text-indigo-600 mr-3" />
                <span>Global marketplace reach</span>
              </li>
            </ul>
          </div>
          <div 
            className="h-64 lg:h-auto bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80')"
            }}
          />
        </div>
      </div>

      {/* Team */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We're a diverse team of experts committed to building the best marketplace platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'John Smith',
              role: 'CEO & Founder',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80'
            },
            {
              name: 'Sarah Johnson',
              role: 'Head of Operations',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80'
            },
            {
              name: 'Michael Chen',
              role: 'Tech Lead',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
            }
          ].map((member) => (
            <div key={member.name} className="bg-white p-6 rounded-xl shadow-sm">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;