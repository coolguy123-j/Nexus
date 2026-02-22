/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  LayoutGrid, 
  Settings, 
  Search, 
  Play, 
  Star, 
  TrendingUp, 
  X,
  Maximize2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GAMES } from './constants';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const iframeContainerRef = useRef(null);
  const proxyContainerRef = useRef(null);

  const FEATURED_GAMES = useMemo(() => GAMES.slice(0, 3), []);

  const handleFullscreen = (ref) => {
    if (ref.current) {
      const elem = ref.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (view !== 'home' || searchQuery) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % FEATURED_GAMES.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [view, searchQuery, FEATURED_GAMES.length]);

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredGame = FEATURED_GAMES[currentHeroIndex] || FEATURED_GAMES[0];

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 flex flex-col border-r border-white/5 bg-surface z-20">
        <div className="p-6 flex justify-center">
          <button 
            onClick={() => setView('home')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-2xl transition-all ${view === 'home' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white/5 text-white/40 hover:text-white'}`}
          >
            N
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem 
            icon={<Gamepad2 size={20} />} 
            active={view === 'library'} 
            onClick={() => setView('library')}
          />
          <SidebarItem 
            icon={<Globe size={20} />} 
            active={view === 'proxy'} 
            onClick={() => setView('proxy')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header - Only show in Library, Proxy or when searching */}
        <AnimatePresence>
          {(view === 'library' || view === 'proxy' || searchQuery) && (
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-0 z-10 px-8 py-6 flex items-center justify-between bg-bg/80 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-white font-medium">
                  {view === 'library' ? 'Library' : view === 'proxy' ? 'Proxy' : 'Search'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-surface border border-white/5 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <div className="px-8 pb-12 pt-6">
          {/* Hero Section - Only show on Home */}
          {view === 'home' && !searchQuery && (
            <>
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-display font-black text-white tracking-tighter">
                  NEXUS <span className="text-accent">ARCADE</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-surface border border-white/5 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="relative h-[calc(100vh-180px)] rounded-3xl overflow-hidden mb-12 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredGame.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={featuredGame.thumbnail} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={featuredGame.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 max-w-2xl">
                    <h1 className="text-6xl font-display font-extrabold mb-4 tracking-tight">{featuredGame.title}</h1>
                    <p className="text-white/60 text-lg mb-8 line-clamp-2">{featuredGame.description}</p>
                    <button 
                      onClick={() => setActiveGame(featuredGame)}
                      className="bg-white text-bg px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95"
                    >
                      <Play size={20} fill="currentColor" />
                      Play Now
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-6 right-10 flex gap-2 z-10">
                {FEATURED_GAMES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-white w-6' : 'bg-white/30'}`}
                  />
                ))}
              </div>
              </div>
            </>
          )}

          {/* Game Grid - Only show on Library or when searching */}
          {(view === 'library' || searchQuery) && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">
                  {searchQuery ? `Search results for "${searchQuery}"` : `All Games`}
                </h2>
                <div className="flex gap-2">
                  <div className="bg-surface px-4 py-2 rounded-lg text-sm text-white/60 border border-white/5">
                    {filteredGames.length} Games
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    index={index}
                    onClick={() => setActiveGame(game)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Proxy Section */}
          {view === 'proxy' && !searchQuery && (
            <div className="relative group">
              <motion.div 
                ref={proxyContainerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[calc(100vh-140px)] rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl"
              >
                <iframe 
                  src="https://etherealproxy.netlify.app/"
                  className="w-full h-full border-none"
                  title="Proxy"
                  allow="autoplay; fullscreen; pointer-lock"
                />
              </motion.div>
              <button 
                onClick={() => handleFullscreen(proxyContainerRef)}
                className="absolute top-4 right-4 p-3 bg-bg/40 backdrop-blur-md hover:bg-accent text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-white/10"
                title="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-bg/95 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface w-full h-full rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-surface/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <img src={activeGame.thumbnail} className="w-10 h-10 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-bold">{activeGame.title}</h3>
                    <p className="text-xs text-white/40">{activeGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleFullscreen(iframeContainerRef)}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveGame(null)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div ref={iframeContainerRef} className="flex-1 bg-black relative">
                <iframe 
                  src={activeGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; pointer-lock"
                  title={activeGame.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SidebarItem = ({ icon, active = false, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center justify-center p-3 rounded-xl transition-all group
        ${active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white hover:bg-white/5'}
      `}
    >
      <div className={`${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
        {icon}
      </div>
    </button>
  );
};

const GameCard = ({ game, index, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 game-card-shadow">
        <img 
          src={game.thumbnail} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={game.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button className="w-full bg-white text-bg py-2 rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play size={16} fill="currentColor" />
            Play Now
          </button>
        </div>
        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
          <Star size={12} className="text-yellow-400" fill="currentColor" />
          {game.rating}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{game.title}</h3>
          <p className="text-sm text-white/40">{game.category}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest">Plays</div>
          <div className="font-mono text-accent font-bold">{game.plays}</div>
        </div>
      </div>
    </motion.div>
  );
};
