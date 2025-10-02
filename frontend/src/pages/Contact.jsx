import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@intellistay.com',
    availability: '24/7'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our support team',
    contact: '+1 (555) 123-4567',
    availability: 'Mon-Fri, 9AM-6PM EST'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Real-time assistance for urgent matters',
    contact: 'Available on website',
    availability: '24/7'
  },
  {
    icon: MapPin,
    title: 'Visit Our Office',
    description: 'Meet us in person at our headquarters',
    contact: '123 Innovation Drive, Tech Valley, CA',
    availability: 'Mon-Fri, 9AM-5PM PST'
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose How to Reach Us
            </h2>
            <p className="text-xl text-muted-foreground">
              Multiple ways to get the support you need, when you need it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <method.icon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {method.description}
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">
                      {method.contact}
                    </p>
                    <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                      {method.availability}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
