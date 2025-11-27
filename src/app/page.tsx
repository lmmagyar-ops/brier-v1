'use client';

import React, { useState, useEffect } from 'react';
import BrierTerminal from "@/components/BrierTerminal";
import { Radar, Binoculars, Scale, Terminal, ChevronRight, Zap, Building, Hexagon, Triangle, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Typewriter Effect State
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = React.useMemo(() => [
    "Spot Arbitrage across Polymarket & Kalshi.",
    "Track Whale Wallets in Real-Time.",
    "Hedge Real-World Events Onchain."
  ], []);

  useEffect(() => {
    const currentPhrase = phrases[textIndex];
    const typeSpeed = isDeleting ? 30 : 50;
    const delay = isDeleting ? 0 : 2000; // Pause at end of phrase

    if (!isDeleting && displayText === currentPhrase) {
      setTimeout(() => setIsDeleting(true), delay);
      return;
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText(prev =>
        isDeleting ? prev.slice(0, -1) : currentPhrase.slice(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, phrases]);

  if (isTerminalOpen) {
    return (
      <main className="min-h-screen bg-black">
        <BrierTerminal />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">BRIER</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm text-slate-400 hover:text-white transition-colors font-mono">MANIFESTO</button>
            <button
              onClick={() => setIsTerminalOpen(true)}
              className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Badges Container */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/20 border border-orange-500/30 text-orange-500 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              System Online v2.4.0
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 text-green-500 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              842 Traders Online
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight mb-6 leading-[1.1]">
            The Terminal for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200">Truth.</span>
          </h1>

          <div className="h-20 mb-8"> {/* Fixed height for typewriter */}
            <p className="text-lg md:text-xl text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
              <span className="text-slate-200">{displayText}</span>
              <span className="animate-pulse text-orange-500">_</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setIsTerminalOpen(true)}
              className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>
              <span className="flex items-center justify-center gap-2">
                Enter Terminal <ChevronRight size={16} />
              </span>
            </button>
            <button className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-sm uppercase tracking-wider transition-all w-full sm:w-auto">
              Read Manifesto
            </button>
          </div>

          {/* Social Proof Strip */}
          <div className="flex flex-col items-center gap-4 mb-20 opacity-80">
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">Trusted by Institutional Traders</span>
            <div className="flex items-center gap-8 grayscale opacity-50">
              <div className="flex items-center gap-2"><Building size={20} /><span className="font-bold text-lg">APEX</span></div>
              <div className="flex items-center gap-2"><Hexagon size={20} /><span className="font-bold text-lg">NEXUS</span></div>
              <div className="flex items-center gap-2"><Triangle size={20} /><span className="font-bold text-lg">DELTA</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-current"></div><span className="font-bold text-lg">ORION</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 rotate-45 border-2 border-current"></div><span className="font-bold text-lg">QUANT</span></div>
            </div>
          </div>

          {/* 3D Card Visual with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-4xl mx-auto perspective-1000 group"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative transform transition-transform duration-700 ease-out group-hover:rotate-x-2 group-hover:rotate-y-2 rotate-x-6 rotate-y-0 preserve-3d"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Card Container */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {/* Mock UI Header */}
                <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  </div>
                  <div className="flex-1 text-center text-[10px] font-mono text-slate-500">brier_terminal_v1.exe</div>
                </div>

                {/* Mock UI Body (Abstract representation of the dashboard) */}
                <div className="p-6 grid grid-cols-12 gap-4 h-[400px] bg-slate-900/50">
                  {/* Sidebar */}
                  <div className="col-span-1 hidden sm:flex flex-col gap-4 border-r border-slate-800 pr-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded bg-slate-800/50"></div>)}
                  </div>

                  {/* Main Content */}
                  <div className="col-span-12 sm:col-span-11 flex flex-col gap-4">
                    {/* Top Bar */}
                    <div className="h-12 border-b border-slate-800 flex items-center justify-between">
                      <div className="w-32 h-4 bg-slate-800/50 rounded"></div>
                      <div className="flex gap-2">
                        <div className="w-20 h-8 bg-orange-600/20 border border-orange-500/30 rounded"></div>
                      </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-4 h-full">
                      <div className="col-span-2 bg-slate-950/50 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
                        {/* Chart Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/10 to-transparent"></div>
                        <svg className="absolute bottom-0 left-0 right-0 w-full h-32 text-orange-500" preserveAspectRatio="none">
                          <path d="M0,100 Q100,80 200,90 T400,50 T600,70 T800,20 L800,128 L0,128 Z" fill="currentColor" fillOpacity="0.1" />
                          <path d="M0,100 Q100,80 200,90 T400,50 T600,70 T800,20" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="col-span-1 flex flex-col gap-4">
                        <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-800"></div>
                        <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-800"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ticker Strip */}
      <div className="w-full bg-black border-y border-slate-800 overflow-hidden py-3 relative z-20 group">
        <div className="flex animate-scroll whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4 font-mono text-xs font-bold">
              <span className="text-slate-400">FED RATE CUT (YES) <span className="text-red-500">15¢</span></span>
              <span className="text-slate-400">BTC {'>'} 100K (YES) <span className="text-green-500">32¢</span></span>
              <span className="text-slate-400">TRUMP 2024 <span className="text-green-500">48¢</span></span>
              <span className="text-slate-400">ETH {'>'} 4K (NO) <span className="text-green-500">88¢</span></span>
              <span className="text-slate-400">US RECESSION 2025 <span className="text-red-500">12¢</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <section className="py-32 relative z-10 bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 border border-slate-800 bg-slate-900/20 rounded-2xl hover:bg-slate-900/40 transition-all hover:border-orange-500/50 duration-300">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                <Radar size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">Alpha Radar</h3>
              <p className="text-slate-400 leading-relaxed">
                Detect sentiment divergence before the crowd. Our algorithms scan social volume vs. market price to find mispriced assets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 border border-slate-800 bg-slate-900/20 rounded-2xl hover:bg-slate-900/40 transition-all hover:border-orange-500/50 duration-300">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Binoculars size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">Whale Watcher</h3>
              <p className="text-slate-400 leading-relaxed">
                Track Wintermute, Paradigm, and other market makers in real-time. See their positions and copy-trade with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 border border-slate-800 bg-slate-900/20 rounded-2xl hover:bg-slate-900/40 transition-all hover:border-orange-500/50 duration-300">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300">
                <Scale size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">Arb Engine</h3>
              <p className="text-slate-400 leading-relaxed">
                Find risk-free spreads across Polymarket & Kalshi. Automatically execute atomic swaps to capture the difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Footer Strip */}
      <div className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-slate-500">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-slate-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Non-Custodial</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap size={16} className="text-slate-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Base Network</span>
          </div>
          <div className="flex items-center gap-3">
            <Lock size={16} className="text-slate-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Audited Smart Contracts</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center text-slate-600 text-sm font-mono bg-black">
        <p>&copy; 2025 Brier Systems. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-x-6 {
          transform: rotateX(6deg);
        }
      `}</style>
    </main>
  );
}
