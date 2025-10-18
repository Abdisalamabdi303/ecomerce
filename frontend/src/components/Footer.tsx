'use client';

import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  const shopLinks = [
    { name: 'All Collections', href: '/collections' },
    { name: 'Signature Line', href: '/collections/signature' },
    { name: 'Limited Editions', href: '/collections/limited-editions' },
    { name: 'Gift Sets', href: '/collections/gift-sets' },
    { name: 'Accessories', href: '/collections/accessories' },
  ];

  const aboutLinks = [
    { name: 'Our Story', href: '/about' },
    { name: 'Master Perfumers', href: '/about#perfumers' },
    { name: 'Sustainability', href: '/about#sustainability' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ];

  const supportLinks = [
    { name: 'Customer Service', href: '/support' },
    { name: 'Shipping Info', href: '/support#shipping' },
    { name: 'Returns', href: '/support#returns' },
    { name: 'Size Guide', href: '/support#size-guide' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+254 700 000 000' },
    { icon: Mail, text: 'luxury@maisonluxe.com' },
    { icon: MapPin, text: 'Nairobi, Kenya' },
  ];

  return (
    <footer className="matte border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">
                  <span className="gradient-text">MAISON</span>
                  <span className="text-white ml-1">LUXE</span>
                </span>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Crafting the world's most exclusive fragrances with uncompromising luxury and bold sophistication.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 text-white/70">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Shop</h3>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">About</h3>
              <ul className="space-y-3">
                {aboutLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-white mb-4">
                Stay Connected
              </h3>
              <p className="text-white/70 mb-6 text-sm">
                Be the first to discover new collections and exclusive offers.
              </p>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors duration-200"
                />
                <button className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-white/60 text-sm">
              © {currentYear} Maison Luxe. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <a
                href="#privacy"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="glass p-3 rounded-full text-white/70 hover:text-white hover:scale-110 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;