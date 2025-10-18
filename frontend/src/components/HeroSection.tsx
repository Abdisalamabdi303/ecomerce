'use client';

import { ShoppingBag, Star, Award } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    {
      icon: ShoppingBag,
      value: '2.5K+',
      label: 'Luxury Products',
      delay: '0ms'
    },
    {
      icon: Star,
      value: '4.9★',
      label: 'Customer Rating',
      delay: '200ms'
    },
    {
      icon: Award,
      value: '50+',
      label: 'Awards Won',
      delay: '400ms'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center top-20 justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
         
            backgroundSize: 'contain',
            backgroundPosition: 'center center'
          }}
        />
        <div className="absolute inset-0 luxury-gradient" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center glass px-6 py-3 rounded-full mb-8 animate-fade-in">
          <span className="text-primary font-bold text-sm uppercase tracking-wider">
            Exclusive Collection
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in">
          <span className="text-white">Unmistakably</span>
          <br />
          <span className="gradient-text animate-shimmer">Audacious</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          Discover the world's most coveted fragrances. Each scent tells a story of 
          uncompromising luxury and bold sophistication.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in">
          <button className="group relative px-12 py-4 bg-primary text-black font-bold text-lg rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-2xl">
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
          
          <button className="glass px-12 py-4 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105">
            Watch Story
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: stat.delay }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/20 rounded-full">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;






