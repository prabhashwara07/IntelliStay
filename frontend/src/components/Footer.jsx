import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-t border-border">
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Brand Section */}
          <div className="mb-8">
            <div className="text-2xl font-bold text-primary mb-4">
              IntelliStay
            </div>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
              Experience the future of hotel booking with AI-powered search. 
              Simply describe what you want, and we'll find your perfect stay.
            </p>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 mx-1 text-accent" /> for travelers
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IntelliStay. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-sm text-muted-foreground hover:text-brand-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-muted-foreground hover:text-brand-primary transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-sm text-muted-foreground hover:text-brand-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}