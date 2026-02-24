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
  Globe,
  ArrowLeft,
  Bot,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GAMES } from './constants';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedCategoryView, setSelectedCategoryView] = useState(null);
  const iframeContainerRef = useRef(null);
  const proxyContainerRef = useRef(null);
  const aiContainerRef = useRef(null);
  const androidContainerRef = useRef(null);

  const FEATURED_GAMES = useMemo(() => GAMES.slice(0, 6), []);

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

  const gamesByCategory = useMemo(() => {
    const grouped = {};
    GAMES.forEach(game => {
      if (!grouped[game.category]) {
        grouped[game.category] = [];
      }
      grouped[game.category].push(game);
    });
    return grouped;
  }, []);

  const categoryColors = {
    'Horror': 'from-red-600 to-red-900',
    'Arcade': 'from-blue-600 to-blue-900',
    'Action': 'from-orange-600 to-orange-900',
    'Sports': 'from-green-600 to-green-900',
    'Simulation': 'from-purple-600 to-purple-900',
    'Adventure': 'from-yellow-600 to-yellow-900',
    'Racing': 'from-pink-600 to-pink-900',
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header - Only show when not on home or when searching */}
        <AnimatePresence>
          {(view !== 'home' || searchQuery) && (
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-0 z-10 px-8 py-6 flex items-center justify-between bg-bg/80 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                {view !== 'home' && (
                  <button 
                    onClick={() => {
                      setView('home');
                      setSelectedCategoryView(null);
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl text-white/60 hover:text-white transition-all border border-white/5"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <span className="text-white font-medium">
                  {view === 'library' ? 'Library' : view === 'proxy' ? 'Proxy' : view === 'ai' ? 'AI' : view === 'categories' ? 'Categories' : 'Search'}
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
          {/* Home Dashboard */}
          {view === 'home' && !searchQuery && (
            <>
              <div className="mb-12 flex items-center justify-between">
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


              {/* Hero Slider & Navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                {/* Hero Slider */}
                <div className="lg:col-span-10 relative h-[400px] rounded-3xl overflow-hidden group shadow-2xl border border-white/5 bg-surface">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={featuredGame.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={featuredGame.thumbnail} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={featuredGame.title}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-8 w-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h1 className="text-4xl font-display font-extrabold mb-2 tracking-tight text-white">{featuredGame.title}</h1>
                          <p className="text-white/70 text-base mb-6 line-clamp-2 max-w-xl">{featuredGame.description}</p>
                          <button 
                            onClick={() => setActiveGame(featuredGame)}
                            className="bg-accent text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-accent transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                          >
                            <Play size={18} fill="currentColor" />
                            Play Now
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Slide Indicators */}
                  <div className="absolute top-6 right-8 flex gap-2 z-10">
                    {FEATURED_GAMES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-accent w-8' : 'bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation Icons (Right Side) */}
                <div className="lg:col-span-2 flex flex-row lg:flex-col gap-6 justify-center items-center">
                  <NavIconButton 
                    icon={<Gamepad2 size={32} />} 
                    label="Library"
                    onClick={() => setView('library')}
                    color="hover:bg-blue-500/20 hover:text-blue-400"
                  />
                  <NavIconButton 
                    icon={<Globe size={32} />} 
                    label="Proxy"
                    onClick={() => setView('proxy')}
                    color="hover:bg-purple-500/20 hover:text-purple-400"
                  />
                  <NavIconButton 
                    icon={<LayoutGrid size={32} />} 
                    label="Categories"
                    onClick={() => {
                      setView('categories');
                      setSelectedCategoryView(null);
                    }}
                    color="hover:bg-emerald-500/20 hover:text-emerald-400"
                  />
                  <NavIconButton 
                    icon={<Bot size={32} />} 
                    label="AI Chat"
                    onClick={() => setView('ai')}
                    color="hover:bg-orange-500/20 hover:text-orange-400"
                  />
                  <NavIconButton 
                    icon={<Smartphone size={32} />} 
                    label="Android"
                    onClick={() => setView('android')}
                    color="hover:bg-red-500/20 hover:text-red-400"
                  />
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

          {/* AI Section */}
          {view === 'ai' && !searchQuery && (
            <div className="relative group">
              <motion.div 
                ref={aiContainerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[calc(100vh-140px)] rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl"
              >
                <iframe 
                  id="v-iframe-player"
                  src="https://gptlite.vercel.app/chat"
                  className="w-full h-full border-none"
                  title="AI Chat"
                  allow="autoplay; fullscreen; pointer-lock"
                />
              </motion.div>
              <button 
                onClick={() => handleFullscreen(aiContainerRef)}
                className="absolute top-4 right-4 p-3 bg-bg/40 backdrop-blur-md hover:bg-accent text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-white/10"
                title="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          )}

          {/* Android Section */}
          {view === 'android' && !searchQuery && (
            <div className="relative group">
              <motion.div 
                ref={androidContainerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[calc(100vh-140px)] rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl"
              >
                <iframe 
                  src="https://nowgg.fun/apps/uncube/7074/now.html" 
                  className="w-full h-full border-none"
                  title="Android Apps"
                  allow="autoplay; fullscreen; pointer-lock"
                />
              </motion.div>
              <button 
                onClick={() => handleFullscreen(androidContainerRef)}
                className="absolute top-4 right-4 p-3 bg-bg/40 backdrop-blur-md hover:bg-accent text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-white/10"
                title="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          )}

          {/* Categories Section */}
          {view === 'categories' && !searchQuery && (
            <div className="space-y-8">
              {!selectedCategoryView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Object.entries(gamesByCategory).map(([category, games], index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedCategoryView(category)}
                      className={`relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer group shadow-xl`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category] || 'from-zinc-600 to-zinc-900'} transition-transform duration-500 group-hover:scale-110`} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <Gamepad2 className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-display font-black text-white mb-2 tracking-tight uppercase italic">{category}</h3>
                          <p className="text-white/60 font-medium">{games.length} Games</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedCategoryView(null)}
                        className="p-2 hover:bg-white/5 rounded-xl text-white/60 hover:text-white transition-all border border-white/5"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-accent rounded-full" />
                        <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-tight">{selectedCategoryView}</h2>
                      </div>
                    </div>
                    <div className="bg-surface px-4 py-2 rounded-lg text-sm text-white/60 border border-white/5">
                      {gamesByCategory[selectedCategoryView].length} Games
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gamesByCategory[selectedCategoryView].map((game, index) => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        index={index}
                        onClick={() => setActiveGame(game)}
                      />
                    ))}
                  </div>
                </div>
              )}
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

const NavIconButton = ({ icon, label, onClick, color }) => {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group`}
    >
      <div className={`w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 transition-all ${color} group-hover:border-white/20 shadow-xl`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">{label}</span>
    </motion.button>
  );
};

const NavCard = ({ icon, title, description, onClick, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} border border-white/5 p-6 rounded-3xl cursor-pointer group transition-all hover:border-white/10`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/40">{description}</p>
    </motion.div>
  );
};

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
