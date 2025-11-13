import React, { useState, useEffect } from 'react';
import { PlayCircleIcon } from '../constants';

interface AdModalProps {
  isOpen: boolean;
  onFinished: () => void;
}

const AD_DURATION = 5; // seconds

const AdModal: React.FC<AdModalProps> = ({ isOpen, onFinished }) => {
  const [countdown, setCountdown] = useState(AD_DURATION);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(AD_DURATION); // Reset countdown when modal closes
      return;
    }

    if (countdown === 0) {
      onFinished();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, countdown, onFinished]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="ad-modal-title"
    >
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 text-center">
        <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
          <PlayCircleIcon className="w-10 h-10 text-green-500" />
        </div>
        <h2 id="ad-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">Renewing Your Credits</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Please "watch" this ad to continue using Pro features. Your credits will be refilled shortly.
        </p>
        <div className="mt-6">
          <img 
            src="https://picsum.photos/seed/admodal/400/200" 
            alt="Simulated advertisement" 
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
        <div className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-200">
          {countdown > 0 ? (
            <p>Ad finishing in <span className="text-indigo-500">{countdown}</span>...</p>
          ) : (
            <p className="text-green-500">Thank you! Your credits have been renewed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdModal;
