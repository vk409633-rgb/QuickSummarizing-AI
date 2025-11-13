import React from 'react';
import { StarIcon, TicketIcon, PlayCircleIcon } from '../constants';

interface SidebarProps {
  isPro: boolean;
  credits: number;
  onRenew: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isPro, credits, onRenew }) => {
  return (
    <aside className="space-y-8">
      {/* Pro Plan CTA */}
      <section aria-labelledby="pro-plan-heading" className="bg-white/60 dark:bg-slate-800/50 shadow-xl rounded-3xl p-6 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
        <h2 id="pro-plan-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <StarIcon className="h-6 w-6 text-amber-400"/>
          Pro Account
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Detailed summaries cost 10 credits. You have access to all our powerful Pro features.</p>
        
        {isPro && (
          <>
            <div className="mt-6 flex items-center justify-center gap-4 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
              <TicketIcon className="h-8 w-8 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Available Credits</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{credits}</p>
              </div>
            </div>

            {credits < 10 && (
              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">You need more credits for a detailed summary.</p>
                <button 
                  onClick={onRenew}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 px-4 rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:scale-105"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  Watch Ad to Renew (50 Credits)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Sponsored Ad */}
      <section aria-labelledby="sponsored-ad-heading" className="text-center p-4 bg-slate-100/80 dark:bg-slate-800/50 rounded-3xl backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
        <h3 id="sponsored-ad-heading" className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Advertisement</h3>
        <a href="#ad" className="block mt-3 group overflow-hidden rounded-xl">
          <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAzNDV8MHwxfHNlYXJjaHwzfHxzYWFzfGVufDB8fHx8MTcxOTkyMzk0NHww&ixlib=rb-4.0.3&q=80&w=1080" alt="Sponsored advertisement for a SaaS product" className="rounded-xl w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"/>
        </a>
        <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 font-semibold">ProjectHub - Manage Your Tasks</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">The ultimate tool for team collaboration. Get started for free.</p>
      </section>

      {/* Affiliate Links */}
      <section aria-labelledby="affiliate-links-heading" className="bg-white/60 dark:bg-slate-800/50 shadow-xl rounded-3xl p-6 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
        <h2 id="affiliate-links-heading" className="text-lg font-bold text-slate-900 dark:text-white">Recommended Tools</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Tools we love that enhance our workflow. <em className="text-xs">(Affiliate links)</em></p>
        <ul className="mt-4 space-y-3">
          <li><a href="#affiliate1" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">Notion - Your connected workspace</a></li>
          <li><a href="#affiliate2" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">Figma - Collaborative interface design</a></li>
          <li><a href="#affiliate3" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">CleanShot X - Superior screenshots</a></li>
        </ul>
      </section>
    </aside>
  );
};

export default React.memo(Sidebar);