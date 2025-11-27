'use client';

import React from 'react';
import { AlertTriangle, Zap, TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react';

interface SentimentWidgetProps {
    hypeScore?: number; // 0-100
    oddsScore?: number; // 0-100
    volume?: string;
    marketId?: string | null;
    marketTitle?: string;
}

export default function SentimentWidget({
    hypeScore: initialHype = 78,
    oddsScore: initialOdds = 48,
    volume = "$1.2M",
    marketId,
    marketTitle = "Global Market Sentiment"
}: SentimentWidgetProps) {
    // Dynamic Mock Data based on Market ID
    const getMarketData = () => {
        if (!marketId) return { hype: initialHype, odds: initialOdds, title: "Global Market Sentiment" };

        // Mock logic for demo purposes
        const seed = marketId.charCodeAt(0) || 0;
        const mockHype = (seed * 7) % 100;
        const mockOdds = (seed * 13) % 100;

        return {
            hype: mockHype,
            odds: mockOdds,
            title: marketTitle
        };
    };

    const { hype, odds, title } = getMarketData();

    // Use the dynamic values
    const hypeScore = hype;
    const oddsScore = odds;

    const spread = Math.abs(hypeScore - oddsScore);
    const isDivergent = spread > 15;
    const isHighLiquidity = volume.includes('M'); // Simple check for demo

    // SVG Configuration
    const radius = 36;
    const circumference = 2 * Math.PI * radius;

    const hypeOffset = circumference - (hypeScore / 100) * circumference;
    const oddsOffset = circumference - (oddsScore / 100) * circumference;

    // Ghost Ring Configuration (24h Average)
    const hypeAvg = 65;
    const oddsAvg = 55;
    const hypeAvgOffset = circumference - (hypeAvg / 100) * circumference;
    const oddsAvgOffset = circumference - (oddsAvg / 100) * circumference;

    return (
        <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl backdrop-blur-sm group">
            {/* Radar Sweep Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                <div
                    className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
                    style={{ animation: `radar-sweep ${isDivergent ? '3s' : '10s'} infinite linear` }}
                />
            </div>

            {/* Header Row 1: Title & CTA */}
            <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <Zap size={16} className="text-orange-500" />
                    <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest truncate max-w-[180px]" title={title}>
                        {title}
                    </h3>
                </div>
            </div>

            {/* Header Row 2: Status Bar */}
            <div className="relative z-10 w-full flex items-center gap-3 mt-2 mb-6">
                {isHighLiquidity && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-[10px] text-slate-400 font-mono leading-none">
                            LIQUIDITY: <span className="text-blue-400 font-bold">HIGH</span>
                        </span>
                    </div>
                )}
                {isDivergent && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-orange-900/20 border border-orange-500/30 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-[10px] text-orange-500 font-mono font-bold leading-none">
                            SIGNAL DETECTED
                        </span>
                    </div>
                )}
            </div>

            {/* Gauges Container */}
            <div className="relative z-10 flex items-center justify-center gap-4">

                {/* Left Gauge: HYPE (Noise) */}
                <div className="group/tooltip relative flex flex-col items-center gap-4 cursor-help">

                    <div className="relative w-28 h-28">
                        <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                            <defs>
                                <linearGradient id="hypeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
                                    <stop offset="100%" stopColor="#ec4899" /> {/* pink-500 */}
                                </linearGradient>
                            </defs>
                            {/* Background Ring */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="#1e293b"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            {/* Ghost Ring (24h Avg) */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="#334155" // slate-700
                                strokeWidth="2"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={hypeAvgOffset}
                                strokeLinecap="round"
                                className="opacity-50"
                            />
                            {/* Value Ring */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="url(#hypeGradient)"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={hypeOffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {/* Default: Score */}
                            <div className="flex items-center gap-1 transition-opacity duration-300 group-hover/tooltip:opacity-0">
                                <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-400 to-pink-500">
                                    {hypeScore}
                                </span>
                                <TrendingUp size={12} className="text-green-500 opacity-80" />
                            </div>
                            {/* Hover: Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 z-10">
                                <span className="text-[10px] font-bold text-slate-300 text-center leading-tight px-2">
                                    Social<br />Volume
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                        Hype <Info size={8} className="opacity-50" />
                    </span>
                </div>

                {/* Center Bridge */}
                <div className="relative flex flex-col items-center justify-center h-24 px-2 w-24">
                    {/* Dashed Connector Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px border-b border-dashed border-slate-800 -translate-y-1/2"></div>

                    {/* Content with solid background to mask line */}
                    <div className="relative flex flex-col items-center bg-[#0f172a] px-2 py-1 z-10">
                        <span className="text-xs font-mono text-slate-500 font-bold">{spread}%</span>
                        <span className="text-[9px] text-slate-600 uppercase tracking-wider">Spread</span>
                    </div>
                </div>

                {/* Right Gauge: ODDS (Signal) */}
                <div className="group/tooltip relative flex flex-col items-center gap-4 cursor-help">

                    <div className="relative w-28 h-28">
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

                        <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                            <defs>
                                <linearGradient id="oddsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
                                    <stop offset="100%" stopColor="#fbbf24" /> {/* amber-400 */}
                                </linearGradient>
                            </defs>
                            {/* Background Ring */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="#1e293b"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            {/* Ghost Ring (24h Avg) */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="#334155" // slate-700
                                strokeWidth="2"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={oddsAvgOffset}
                                strokeLinecap="round"
                                className="opacity-50"
                            />
                            {/* Value Ring */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="url(#oddsGradient)"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={oddsOffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {/* Default: Score */}
                            <div className="flex items-center gap-1 transition-opacity duration-300 group-hover/tooltip:opacity-0">
                                <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-400">
                                    {oddsScore}
                                </span>
                                <TrendingDown size={12} className="text-rose-500 opacity-80" />
                            </div>
                            {/* Hover: Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 z-10">
                                <span className="text-[10px] font-bold text-slate-300 text-center leading-tight px-2">
                                    Implied<br />Prob
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                        Odds <Info size={8} className="opacity-50" />
                    </span>
                </div>

            </div>

            {/* Footer / Context */}
            <div className="relative z-10 mt-8 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex items-start gap-3 max-w-[55%]">
                    <AlertTriangle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        <span className="text-slate-200 font-bold">Short Opportunity:</span> Media sentiment detached from capital.
                    </p>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-bold text-orange-500 border border-orange-500/50 px-3 py-1.5 rounded hover:bg-orange-500 hover:text-white transition-all uppercase tracking-wider group/btn shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]">
                    Execute Strategy
                    <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <style jsx global>{`
        @keyframes radar-sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
        </div>
    );
}