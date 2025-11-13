import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import SummarizerCard from './components/SummarizerCard';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { useProStatus } from './hooks/useProStatus';

const AdModal = lazy(() => import('./components/AdModal'));
const ContactForm = lazy(() => import('./components/ContactForm'));

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return storedTheme || (prefersDark ? 'dark' : 'light');
    }
    return 'light';
  });
  
  const { isPro, credits, useCredit, renewCredits } = useProStatus();
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleRenew = useCallback(() => {
    renewCredits();
    setIsAdModalOpen(false);
  }, [renewCredits]);

  const openAdModal = useCallback(() => {
    setIsAdModalOpen(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-gray-900">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <SummarizerCard 
              isPro={isPro}
              credits={credits}
              useCredit={useCredit}
            />
          </div>
          <div className="lg:col-span-1">
            <Sidebar 
              isPro={isPro}
              credits={credits}
              onRenew={openAdModal}
            />
          </div>
        </div>
        <div className="mt-16 lg:mt-24">
          <Suspense fallback={<div className="text-center p-10 font-medium text-slate-500 dark:text-slate-400">Loading Contact Form...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <AdModal
          isOpen={isAdModalOpen}
          onFinished={handleRenew}
        />
      </Suspense>
    </div>
  );
};

export default App;