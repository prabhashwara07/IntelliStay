import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Globe, Heart, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=300&h=300&fit=crop&face',
    description: 'Former hospitality executive with 15+ years of experience in luxury hotels.'
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face',
    description: 'Tech visionary specializing in AI and machine learning solutions.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&face',
    description: 'Operations expert ensuring seamless customer experiences worldwide.'
  },
  {
    name: 'David Kim',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face',
    description: 'Creative director with passion for user-centered design and innovation.'
  }
];

const stats = [
  { number: '50K+', label: 'Happy Travelers', icon: Users },
  { number: '10K+', label: 'Partner Hotels', icon: Award },
  { number: '150+', label: 'Countries Covered', icon: Globe },
  { number: '4.8/5', label: 'Customer Rating', icon: Star }
];

const values = [
  {
    title: 'Innovation First',
    description: 'We leverage cutting-edge AI technology to provide personalized travel recommendations and seamless booking experiences.',
    icon: Award
  },
  {
    title: 'Customer Focused',
    description: 'Every decision we make is centered around delivering exceptional value and experiences for our travelers.',
    icon: Heart
  },
  {
    title: 'Global Reach',
    description: 'Our platform connects travelers with authentic accommodations in destinations worldwide.',
    icon: Globe
  },
  {
    title: 'Trust & Safety',
    description: 'We maintain the highest standards of security and reliability for all our booking processes.',
    icon: CheckCircle
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            About IntelliStay
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Revolutionizing Travel with{' '}
            <span className="text-primary">Intelligent</span> Hospitality
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            We're on a mission to transform how people discover and book accommodations 
            by combining artificial intelligence with human expertise to create 
            unforgettable travel experiences.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-4">
                      <stat.icon className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Born from a Vision to Simplify Travel
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, IntelliStay emerged from a simple yet powerful idea: 
                  what if artificial intelligence could understand your travel preferences 
                  better than you do yourself? Our founders, seasoned travelers and 
                  technology experts, experienced firsthand the frustration of endless 
                  scrolling through generic hotel listings.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 travelers worldwide, helping 
                  them discover perfectly matched accommodations through our proprietary 
                  AI recommendation engine. From boutique hotels in Paris to beachfront 
                  resorts in Bali, we're making every journey more memorable.
                </p>
                <p>
                  Our commitment goes beyond just bookings – we're building a community 
                  of informed travelers who value authentic experiences, sustainable 
                  tourism, and meaningful connections with local cultures.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values shape every decision and guide us toward creating 
              exceptional travel experiences for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-4">
                    <value.icon className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Meet the Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The People Behind IntelliStay
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A diverse team of passionate individuals committed to revolutionizing 
              the way you discover and book your perfect stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 text-center">
                <div className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Experience Intelligent Travel?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of satisfied travelers who trust IntelliStay for their 
            accommodation needs. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="text-lg px-8">
                Start Exploring
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
