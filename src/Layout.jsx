import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Scroll, History } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-[#0d0705]">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#1a0f0a] via-[#2c1810] to-[#1a0f0a] border-b border-[#d4a84b]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link 
              to={createPageUrl('Oracle')}
              className="flex items-center gap-2 text-[#d4a84b] hover:text-[#ffd700] transition-colors"
            >
              <span className="text-xl">𓂀</span>
              <span className="font-serif font-bold">Oracle d'Égypte</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                to={createPageUrl('Oracle')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  currentPageName === 'Oracle' 
                    ? 'bg-[#d4a84b]/20 text-[#ffd700]' 
                    : 'text-[#8b7355] hover:text-[#d4a84b]'
                }`}
              >
                <Scroll className="w-4 h-4" />
                <span className="hidden sm:inline">Consultation</span>
              </Link>
              <Link
                to={createPageUrl('History')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  currentPageName === 'History' 
                    ? 'bg-[#d4a84b]/20 text-[#ffd700]' 
                    : 'text-[#8b7355] hover:text-[#d4a84b]'
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Historique</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <main>
        {children}
      </main>
    </div>
  );
}