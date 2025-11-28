'use client';

import React, { useState } from 'react';
import { useUnifiedMarkets } from '@/hooks/useUnifiedMarkets';
import SentimentWidget from '@/components/dashboard/SentimentWidget';
import WhaleWatcher from '@/components/dashboard/WhaleWatcher';
import PortfolioView from '@/components/dashboard/PortfolioView';
import LeaderboardView from '@/components/dashboard/LeaderboardView';
import RewardsView from '@/components/dashboard/RewardsView';
import { ExternalLink, TrendingUp, Activity, Briefcase, Bitcoin, DollarSign, Flag, ArrowUpRight, ArrowDownRight, Trophy, Gift } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';

export default function BrierTerminal() {
    const { markets, loading } = useUnifiedMarkets();
    const [activeTab, setActiveTab] = useState<'markets' | 'portfolio' | 'leaderboard' | 'rewards'>('markets');
    const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
    const [selectedMarketTitle, setSelectedMarketTitle] = useState<string | undefined>(undefined);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRYPTO' | 'POLITICS' | 'ECONOMY'>('ALL');

    const handleMarketSelect = (id: string, title: string) => {
        if (selectedMarketId === id) {
            setSelectedMarketId(null);
            setSelectedMarketTitle(undefined);
        } else {
            setSelectedMarketId(id);
            setSelectedMarketTitle(title);
        }
    };

    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'markets': return 'Market Overview';
            case 'portfolio': return 'Portfolio Management';
            case 'leaderboard': return 'Leaderboard';
            case 'rewards': return 'Rewards Program';
            default: return 'Brier Terminal';
        }
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-20 flex flex-col items-center py-6 border-r border-slate-800 bg-[#020617]">
                <div className="font-serif text-5xl text-slate-100 mb-8">B</div>
                <nav className="flex flex-col gap-6">
                    <button
                        onClick={() => setActiveTab('markets')}
                        className={clsx(
                            "p-3 rounded-lg transition-colors",
                            activeTab === 'markets' ? "bg-slate-900/50 text-orange-500" : "hover:bg-slate-900/50 text-slate-500 hover:text-slate-300"
                        )}
                        title="Markets"
                    >
                        <TrendingUp size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        className={clsx(
                            "p-3 rounded-lg transition-colors",
                            activeTab === 'portfolio' ? "bg-slate-900/50 text-orange-500" : "hover:bg-slate-900/50 text-slate-500 hover:text-slate-300"
                        )}
                        title="Portfolio"
                    >
                        <Briefcase size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={clsx(
                            "p-3 rounded-lg transition-colors",
                            activeTab === 'leaderboard' ? "bg-slate-900/50 text-orange-500" : "hover:bg-slate-900/50 text-slate-500 hover:text-slate-300"
                        )}
                        title="Leaderboard"
                    >
                        <Trophy size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab('rewards')}
                        className={clsx(
                            "p-3 rounded-lg transition-colors",
                            activeTab === 'rewards' ? "bg-slate-900/50 text-orange-500" : "hover:bg-slate-900/50 text-slate-500 hover:text-slate-300"
                        )}
                        title="Rewards"
                    >
                        <Gift size={24} />
                    </button>
                    <div className="p-3 rounded-lg hover:bg-slate-900/50 text-slate-500 hover:text-slate-300 transition-colors cursor-not-allowed opacity-50">
                        <Activity size={24} />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between bg-[#020617]">
                    <h1 className="text-xl font-medium text-slate-100">
                        {getHeaderTitle()}
                    </h1>
                    <div className="flex items-center gap-6">
                        <span className="text-xs font-mono text-slate-500">
                            MKT ACCURACY: <span className="text-green-500">82%</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-mono">LIVE FEED</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0052FF]/10 border border-[#0052FF]/20">
                            <div className="w-2 h-2 bg-[#0052FF] rounded-full"></div>
                            <span className="text-[10px] font-bold text-[#0052FF] tracking-wider">BASE INTEGRATED</span>
                        </div>
                        <div className="ml-4">
                            <ConnectButton.Custom>
                                {({
                                    account,
                                    chain,
                                    openAccountModal,
                                    openChainModal,
                                    openConnectModal,
                                    authenticationStatus,
                                    mounted,
                                }) => {
                                    const ready = mounted && authenticationStatus !== 'loading';
                                    const connected =
                                        ready &&
                                        account &&
                                        chain &&
                                        (!authenticationStatus ||
                                            authenticationStatus === 'authenticated');

                                    return (
                                        <div
                                            {...(!ready && {
                                                'aria-hidden': true,
                                                'style': {
                                                    opacity: 0,
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                },
                                            })}
                                        >
                                            {(() => {
                                                if (!connected) {
                                                    return (
                                                        <button
                                                            onClick={openConnectModal}
                                                            type="button"
                                                            className="bg-orange-600 text-white font-bold uppercase px-4 py-2.5 rounded shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:bg-orange-500 transition-all tracking-wider text-sm animate-glow-pulse"
                                                        >
                                                            Connect Wallet
                                                        </button>
                                                    );
                                                }

                                                if (chain.unsupported) {
                                                    return (
                                                        <button onClick={openChainModal} type="button" className="bg-red-500 text-white px-4 py-2 rounded font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                                            Wrong network
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <div style={{ display: 'flex', gap: 12 }}>
                                                        <button
                                                            onClick={openChainModal}
                                                            style={{ display: 'flex', alignItems: 'center' }}
                                                            type="button"
                                                            className="bg-slate-900/50 border border-slate-700 text-slate-300 px-3 py-2 rounded flex items-center gap-2 hover:bg-slate-800 transition-colors"
                                                        >
                                                            {chain.hasIcon && (
                                                                <div
                                                                    style={{
                                                                        background: chain.iconBackground,
                                                                        width: 12,
                                                                        height: 12,
                                                                        borderRadius: 999,
                                                                        overflow: 'hidden',
                                                                        marginRight: 4,
                                                                    }}
                                                                >
                                                                    {chain.iconUrl && (
                                                                        <img
                                                                            alt={chain.name ?? 'Chain icon'}
                                                                            src={chain.iconUrl}
                                                                            style={{ width: 12, height: 12 }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                            {chain.name}
                                                        </button>

                                                        <button onClick={openAccountModal} type="button" className="bg-slate-900/50 border border-slate-700 text-slate-300 px-3 py-2 rounded hover:bg-slate-800 transition-colors font-mono">
                                                            {account.displayName}
                                                        </button>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    );
                                }}
                            </ConnectButton.Custom>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="flex-1 p-6 grid grid-cols-12 gap-6 min-h-screen">

                    {/* Main View Area (Market Table or Portfolio) */}
                    <div className="col-span-9 flex flex-col h-full min-h-0">
                        {activeTab === 'markets' ? (
                            <div className="flex flex-col h-full bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Top Opportunities</h2>
                                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                                        {['ALL', 'CRYPTO', 'POLITICS', 'ECONOMY'].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setActiveFilter(filter as 'ALL' | 'CRYPTO' | 'POLITICS' | 'ECONOMY')}
                                                className={clsx(
                                                    "px-3 py-1 text-[10px] font-bold rounded transition-colors",
                                                    activeFilter === filter
                                                        ? "bg-slate-800 text-white shadow-sm"
                                                        : "text-slate-500 hover:text-slate-300"
                                                )}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-900/60 sticky top-0 z-10">
                                            <tr>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Market</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Outcome</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Price</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">24h Change</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">7D Trend</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Volume</th>
                                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={8} className="p-8 text-center text-slate-500">Loading markets...</td>
                                                </tr>
                                            ) : markets
                                                .filter(m => activeFilter === 'ALL' || m.category?.toUpperCase() === activeFilter)
                                                .map((market) => {
                                                    // Icon Logic
                                                    let Icon = TrendingUp;
                                                    let iconColor = "text-slate-400";
                                                    if (market.title.toLowerCase().includes('bitcoin') || market.title.toLowerCase().includes('btc') || market.title.toLowerCase().includes('eth')) {
                                                        Icon = Bitcoin;
                                                        iconColor = "text-orange-500";
                                                    } else if (market.title.toLowerCase().includes('fed') || market.title.toLowerCase().includes('rate') || market.title.toLowerCase().includes('recession')) {
                                                        Icon = DollarSign;
                                                        iconColor = "text-green-500";
                                                    } else if (market.title.toLowerCase().includes('election') || market.title.toLowerCase().includes('usa') || market.title.toLowerCase().includes('trump')) {
                                                        Icon = Flag;
                                                        iconColor = "text-blue-500";
                                                    }

                                                    // Volume Logic
                                                    const isHighVolume = market.volume.includes('M') && parseFloat(market.volume.replace('$', '').replace('M', '')) > 10;

                                                    // Button Highlight Logic

                                                    const isShort = market.outcome === 'No';

                                                    // Sparkline Logic
                                                    const min = Math.min(...(market.trend7d || []));
                                                    const max = Math.max(...(market.trend7d || []));
                                                    const range = max - min || 1;
                                                    const points = (market.trend7d || []).map((val, i) => {
                                                        const x = (i / 6) * 60;
                                                        const y = 20 - ((val - min) / range) * 20;
                                                        return `${x},${y}`;
                                                    }).join(' ');

                                                    // Sparkline Reference Line (Start Point)
                                                    const startVal = (market.trend7d || [])[0] || 0;
                                                    const startY = 20 - ((startVal - min) / range) * 20;

                                                    return (
                                                        <tr key={market.id} className="hover:bg-slate-800/30 transition-colors group">
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2 rounded-full bg-slate-800/50 ${iconColor}`}>
                                                                        <Icon size={16} />
                                                                    </div>
                                                                    <div className="font-medium text-slate-200 truncate max-w-[220px]" title={market.title}>{market.title}</div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={clsx(
                                                                    "px-2 py-1 rounded text-xs font-medium",
                                                                    market.platform === 'Polymarket' ? "bg-blue-950/50 text-blue-400" : "bg-green-950/50 text-green-400"
                                                                )}>
                                                                    {market.platform}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={clsx(
                                                                    "font-bold font-mono",
                                                                    market.outcome === 'Yes' ? "text-green-400" : "text-red-400"
                                                                )}>
                                                                    {market.outcome}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-mono text-slate-300">{market.price}¢</td>
                                                            <td className="p-4 text-right">
                                                                <div className={clsx(
                                                                    "flex items-center justify-end gap-1 font-mono text-xs",
                                                                    market.change24h >= 0 ? "text-green-400" : "text-red-400"
                                                                )}>
                                                                    {market.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                                    {Math.abs(market.change24h)}%
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <svg width="60" height="20" className="inline-block">
                                                                    <polyline
                                                                        points={points}
                                                                        fill="none"
                                                                        stroke={market.change24h >= 0 ? "#4ade80" : "#f87171"}
                                                                        strokeWidth="1.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <circle cx="0" cy={startY} r="1.5" fill="currentColor" className="text-slate-500" />
                                                                </svg>
                                                            </td>
                                                            <td className="p-4 text-right font-mono text-slate-400 text-xs">{market.volume}</td>
                                                            <td className="p-4 text-right">
                                                                <a
                                                                    href={market.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={clsx(
                                                                        "inline-flex items-center justify-center w-40 whitespace-nowrap px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all",
                                                                        !isShort
                                                                            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                                                            : "border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
                                                                    )}
                                                                >
                                                                    BET {market.outcome.toUpperCase()} @ {market.price}¢
                                                                    <ExternalLink size={12} className="ml-1" />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : activeTab === 'portfolio' ? (
                            <PortfolioView onSelectMarket={handleMarketSelect} selectedMarketId={selectedMarketId} />
                        ) : activeTab === 'leaderboard' ? (
                            <LeaderboardView />
                        ) : (
                            <RewardsView />
                        )}
                    </div>

                    {/* Right Sidebar (Widgets) */}
                    <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
                        {/* Sentiment Widget */}
                        <div className="flex-1 min-h-0">
                            <SentimentWidget marketId={selectedMarketId || undefined} marketTitle={selectedMarketTitle} />
                        </div>

                        {/* Whale Watcher */}
                        <div className="flex-1 min-h-0">
                            <WhaleWatcher />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
