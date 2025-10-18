'use client';

import { ArrowLeft, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+254 700 000 000',
      description: 'Mon-Fri 9AM-6PM EAT'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'luxury@maisonluxe.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'Nairobi, Kenya',
      description: 'Westlands Business District'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM',
      description: 'Sat: 10AM-4PM EAT'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Whether you have questions about our fragrances, 
            need assistance with an order, or want to share your feedback, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Contact <span className="gradient-text">Information</span>
            </h2>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="glass rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {info.title}
                        </h3>
                        <p className="text-primary font-semibold mb-1">
                          {info.details}
                        </p>
                        <p className="text-white/60 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    question: 'How long does shipping take?',
                    answer: 'Standard shipping takes 3-5 business days within Kenya.'
                  },
                  {
                    question: 'Do you offer international shipping?',
                    answer: 'Yes, we ship worldwide with tracking included.'
                  },
                  {
                    question: 'What is your return policy?',
                    answer: '30-day return policy for unopened products.'
                  },
                  {
                    question: 'Can I sample fragrances before buying?',
                    answer: 'Yes, we offer sample sets for most collections.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-white font-semibold mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-white/70 text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Send us a <span className="gradient-text">Message</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors duration-200"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

