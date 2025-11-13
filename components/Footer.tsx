import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent mt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium">&copy; {new Date().getFullYear()} QuickSummarize AI. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors font-medium">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-900 dark:hover:text-white transition-colors font-medium">Terms of Service</a>
            <a href="mailto:vk409633@gmail.com" className="hover:text-slate-900 dark:hover:text-white transition-colors font-medium">vk409633@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);