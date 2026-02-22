/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GAMES } from './constants';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (selectedCategory !== 'All' || searchQuery) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % GAMES.length);
    }, 5000); // Slide every 5 seconds

    return () => clearInterval(interval);
  }, [selectedCategory, searchQuery]);

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredGame = GAMES[currentHeroIndex] || GAMES[0];

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 240 }}
        className="flex flex-col border-r border-white/5 bg-surface z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-display font-extrabold text-2xl">
            N
          </div>
          {!isSidebarCollapsed && (
            <span className="font-display font-bold text-xl tracking-tight">NEXUS</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem 
            icon={<LayoutGrid size={20} />} 
            label="Library" 
            active={selectedCategory === 'All'} 
            onClick={() => setSelectedCategory('All')}
            collapsed={isSidebarCollapsed}
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full mt-2 p-3 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight className={`transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} size={20} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-10 px-8 py-6 flex items-center justify-between bg-bg/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-white font-medium">Featured</span>
            <span className="mx-2">|</span>
            <span>February 2026</span>
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
        </header>

        <div className="px-8 pb-12">
          {/* Hero Section */}
          {selectedCategory === 'All' && !searchQuery && (
            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 group">
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
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured Game</span>
                    </div>
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
                {GAMES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-white w-6' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Game Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold">
                {searchQuery ? `Search results for "${searchQuery}"` : `${selectedCategory} Games`}
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
                  <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
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
              <div className="flex-1 bg-black relative">
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

const SidebarItem = ({ icon, label, active = false, onClick, collapsed }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-3 rounded-xl transition-all group
        ${active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white hover:bg-white/5'}
      `}
    >
      <div className={`${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
        {icon}
      </div>
      {!collapsed && <span className="font-medium">{label}</span>}
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
