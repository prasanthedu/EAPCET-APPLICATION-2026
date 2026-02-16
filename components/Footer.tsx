
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 royal-gradient rounded flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-gray-800">MPC Stack</span>
        </div>
        
        <p className="text-sm text-gray-400 font-medium">
          © 2026 MPC Stack | EAPCET 2026 Application Management System
        </p>
        
        <div className="flex gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-blue-700">Privacy Policy</a>
          <a href="#" className="hover:text-blue-700">Terms of Service</a>
          <a href="#" className="hover:text-blue-700">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
