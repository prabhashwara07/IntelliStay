import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Building } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
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

const departments = [
  {
    icon: HelpCircle,
    title: 'General Support',
    description: 'Booking assistance, account questions, and general inquiries',
    email: 'support@intellistay.com'
  },
  {
    icon: Building,
    title: 'Business Partnerships',
    description: 'Hotel partnerships, B2B solutions, and corporate accounts',
    email: 'partnerships@intellistay.com'
  },
  {
    icon: MessageSquare,
    title: 'Media & Press',
    description: 'Press releases, media kits, and interview requests',
    email: 'press@intellistay.com'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Reset form or show success message
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      department: 'general'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            We're Here to{' '}
            <span className="text-primary">Help</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Have questions about your booking? Need assistance planning your trip? 
            Our dedicated support team is ready to make your travel experience seamless.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-card">
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

      {/* Contact Form & Departments */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Send us a message
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Fill out the form below and we'll get back to you as soon as possible. 
                  For urgent matters, please use our live chat or phone support.
                </p>
              </div>

              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="general">General Support</option>
                      <option value="business">Business Partnerships</option>
                      <option value="press">Media & Press</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Departments & Additional Info */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                  Departments
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Specialized Support
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Connect directly with the right team for faster, more targeted assistance.
                </p>

                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <dept.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {dept.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {dept.description}
                          </p>
                          <a 
                            href={`mailto:${dept.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      Office Hours
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-2 border-t border-subtle">
                    <p className="text-sm text-muted-foreground">
                      <strong>Emergency Support:</strong> Available 24/7 via live chat for urgent booking issues.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Need Quick Answers?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Check out our comprehensive FAQ section for instant solutions to common questions.
                  </p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Visit FAQ
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
