import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              IntelliStay
            </div>
            <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
              Experience the future of hotel booking with AI-powered search. 
              Simply describe what you want, and we'll find your perfect stay.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              Made with <Heart className="h-4 w-4 mx-1 text-red-400" /> for travelers
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#press" className="text-gray-400 hover:text-white transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">hello@intellistay.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <span className="text-sm">
                  San Francisco, CA<br />
                  United States
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} IntelliStay. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}