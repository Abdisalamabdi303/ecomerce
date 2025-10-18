'use client';

import { ArrowLeft, Award, Users, Leaf, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Craftsmanship',
      description: 'Every fragrance is meticulously crafted by master perfumers with decades of experience.'
    },
    {
      icon: Users,
      title: 'Heritage',
      description: 'Building on generations of olfactory expertise and luxury tradition.'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to ethical sourcing and environmentally conscious practices.'
    },
    {
      icon: Globe,
      title: 'Global Excellence',
      description: 'Delivering world-class luxury experiences across all markets.'
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
            Our <span className="gradient-text">Story</span>
          </h1>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Founded on the principles of uncompromising luxury and bold sophistication, 
            Maison Luxe represents the pinnacle of fragrance artistry.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              A Legacy of Excellence
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Since our founding, Maison Luxe has been at the forefront of luxury fragrance innovation. 
              Our master perfumers combine traditional techniques with cutting-edge technology to create 
              scents that define generations.
            </p>
            <p className="text-white/80 leading-relaxed">
              Each fragrance tells a story of meticulous craftsmanship, from the careful selection of 
              rare ingredients to the final bottling process. We believe that luxury is not just about 
              what you wear, but how it makes you feel.
            </p>
          </div>
          <div className="glass rounded-2xl p-8">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              <span className="text-white/50 text-lg">Master Perfumer at Work</span>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Perfumers Section */}
        <div className="glass rounded-2xl p-8 mb-20">
          <h2 id="perfumers" className="text-3xl font-bold text-white text-center mb-12">
            Master <span className="gradient-text">Perfumers</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Elena Rodriguez',
                title: 'Chief Perfumer',
                description: '30+ years creating iconic fragrances for luxury houses worldwide.',
                image: 'ER'
              },
              {
                name: 'Jean-Pierre Dubois',
                title: 'Master of Raw Materials',
                description: 'Expert in sourcing the world\'s finest natural ingredients.',
                image: 'JD'
              },
              {
                name: 'Aisha Kimani',
                title: 'Innovation Director',
                description: 'Pioneering new scent technologies and sustainable practices.',
                image: 'AK'
              }
            ].map((perfumer, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{perfumer.image}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {perfumer.name}
                </h3>
                <p className="text-primary text-sm mb-2">
                  {perfumer.title}
                </p>
                <p className="text-white/70 text-sm">
                  {perfumer.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Section */}
        <div id="sustainability" className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            <span className="gradient-text">Sustainability</span> Commitment
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-8">
            We are committed to creating luxury fragrances that respect our planet. 
            From sustainable ingredient sourcing to eco-friendly packaging, every aspect 
            of our production process is designed with environmental responsibility in mind.
          </p>
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-white/70 text-sm">Sustainable Sourcing</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">0%</div>
                <div className="text-white/70 text-sm">Animal Testing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

