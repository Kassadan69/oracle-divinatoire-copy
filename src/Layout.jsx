import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Scroll, History } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-[#f4e4c1]">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-[#d4bc8a] via-[#e8d4a8] to-[#d4bc8a] border-b-2 border-[#8b6914]/30 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link 
              to={createPageUrl('Oracle')}
              className="flex items-center gap-2 text-[#6b4423] hover:text-[#8b6914] transition-colors"
            >
              <span className="text-xl">𓂀</span>
              <span className="font-serif font-bold">Oracle d'Égypte</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                to={createPageUrl('Oracle')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  currentPageName === 'Oracle' 
                    ? 'bg-[#8b6914]/20 text-[#6b4423] font-medium' 
                    : 'text-[#8b7355] hover:text-[#6b4423]'
                }`}
              >
                <Scroll className="w-4 h-4" />
                <span className="hidden sm:inline">Consultation</span>
              </Link>
              <Link
                to={createPageUrl('History')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  currentPageName === 'History' 
                    ? 'bg-[#8b6914]/20 text-[#6b4423] font-medium' 
                    : 'text-[#8b7355] hover:text-[#6b4423]'
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