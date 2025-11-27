import React, { useState, useEffect } from 'react';
import { Filter, Wallet, ShieldCheck, ArrowUpRight, ArrowDownRight, MoreHorizontal, Crown, Zap, Info, ExternalLink, X, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { getWalletLabel } from '@/lib/knownWallets';

// Types
interface WhaleTransaction {
    id: string;
    walletAddress: string;
    isKnownWhale: boolean;
    whaleName?: string;
    action: 'BUY_YES' | 'BUY_NO' | 'SELL_YES' | 'SELL_NO';
    marketTicker: string;
    amount: number;
    timestamp: string;
    marketSentiment: number; // Percentage of YES votes (0-100)
}

export default function WhaleWatcher() {
    const [filterValue] = useState<number>(10000);
    const [isLoading, setIsLoading] = useState(true);
    const [whaleData, setWhaleData] = useState<WhaleTransaction[]>([]);

    // Mirror Trade State
    const [mirrorModalOpen, setMirrorModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<WhaleTransaction | null>(null);

    useEffect(() => {
        async function fetchWhaleData() {
            setIsLoading(true);
            try {
                const res = await fetch('/api/whales');
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setWhaleData(data);
                } else {
                    // Fallback if no data yet (cron hasn't run)
                    // We can trigger the cron manually here for demo purposes if empty
                    await fetch('/api/cron/whale-scan');
                    const retryRes = await fetch('/api/whales');
                    const retryData = await retryRes.json();
                    setWhaleData(retryData);
                }
            } catch (error) {
                console.error('Failed to load whale data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchWhaleData();

        // Poll every 30s
        const interval = setInterval(fetchWhaleData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getActionColor = (action: string) => {
        if (action.includes('BUY')) return 'text-[#00ff00]'; // Neon Green
        return 'text-[#ff4500]'; // Signal Orange
    };

    const getActionText = (action: string, ticker: string) => {
        const type = action.split('_')[0] === 'BUY' ? 'Bought' : 'Sold';
        const outcome = action.split('_')[1];
        return (
            <span>
                <span className="font-bold">{type} {outcome}</span> on <span className="text-slate-300">{ticker}</span>
            </span>
        );
    };

    // 1. Visual Hierarchy & "Whale Tiers" - Address Column
    const getWalletBadge = (tx: WhaleTransaction) => {
        const knownWallet = getWalletLabel(tx.walletAddress);

        if (knownWallet) {
            return (
                <div className={clsx(
                    "flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                    knownWallet.tier === 'gold'
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                )}>
                    {knownWallet.tier === 'gold' ? <Crown size={10} className="fill-current" /> : <ShieldCheck size={10} />}
                    {knownWallet.name}
                </div>
            );
        }

        // Fallback to legacy logic if not in knownWallets but marked as known in mock data
        if (tx.isKnownWhale) {
            return (
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] text-amber-500 font-bold uppercase tracking-wide">
                    <Crown size={10} className="fill-amber-500/20" />
                    {tx.whaleName}
                </div>
            );
        }

        if (tx.amount > 100000) {
            return (
                <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px] text-blue-400 font-bold uppercase tracking-wide">
                    <ShieldCheck size={10} />
                    WHALE
                </div>
            );
        }

        return null;
    };

    // 1. Visual Hierarchy & "Whale Tiers" - Value Column
    const getValueStyles = (amount: number) => {
        if (amount >= 250000) {
            return "text-[#ff7b00] drop-shadow-[0_0_8px_rgba(255,123,0,0.3)]"; // Neon Orange + Glow
        }
        if (amount >= 50000) {
            return "text-white font-bold";
        }
        return "text-slate-400";
    };

    // 2. "Smart Money" Narrative Tags
    const getSmartMoneyTag = (tx: WhaleTransaction) => {
        // Contrarian: Buying NO when sentiment is > 80% YES
        if (tx.action === 'BUY_NO' && tx.marketSentiment > 80) {
            return (
                <div className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-[9px] text-purple-400 font-bold uppercase tracking-wider ml-2">
                    <Info size={8} />
                    CONTRARIAN BET
                </div>
            );
        }
        return null;
    };

    const handleMirrorClick = (tx: WhaleTransaction) => {
        setSelectedTx(tx);
        setMirrorModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm relative">
            {/* Mirror Trade Modal */}
            {mirrorModalOpen && selectedTx && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2 text-orange-500">
                                <Zap size={20} className="fill-current" />
                                <h3 className="text-lg font-bold uppercase tracking-wide">Mirror Trade</h3>
                            </div>
                            <button onClick={() => setMirrorModalOpen(false)} className="text-slate-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Copying Strategy</div>
                                <div className="flex items-center gap-2 mb-2">
                                    {getWalletBadge(selectedTx) || <span className="text-slate-300 font-mono">{selectedTx.walletAddress}</span>}
                                </div>
                                <div className="text-sm text-slate-300">
                                    {getActionText(selectedTx.action, selectedTx.marketTicker)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1.5">Amount</label>
                                    <div className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm">
                                        $500.00
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1.5">Side</label>
                                    <div className={clsx(
                                        "border rounded px-3 py-2 font-mono text-sm font-bold text-center",
                                        selectedTx.action.includes('YES')
                                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                                            : "bg-red-500/10 border-red-500/30 text-red-400"
                                    )}>
                                        {selectedTx.action.split('_')[1]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={`https://polymarket.com/market/${selectedTx.marketTicker.toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-all group"
                        >
                            EXECUTE ON POLYMARKET
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded text-blue-400">
                        <ShieldCheck size={16} />
                    </div>
                    <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Whale Watcher</h2>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-800/50 rounded px-2 py-1 gap-2 border border-slate-700/50">
                        <Filter size={12} className="text-slate-500" />
                        <span className="text-[10px] font-medium text-slate-400">&gt;{formatCurrency(filterValue)}</span>
                    </div>
                    <button className="text-slate-500 hover:text-slate-300 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <div className="divide-y divide-slate-800/50">
                    {isLoading ? (
                        // Skeleton Loaders
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 animate-pulse">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-5 w-24 bg-slate-800/50 rounded"></div>
                                    <div className="h-3 w-12 bg-slate-800/50 rounded"></div>
                                </div>
                                <div className="h-4 w-3/4 bg-slate-800/50 rounded mb-3"></div>
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-20 bg-slate-800/50 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : whaleData.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No whale activity detected recently.
                        </div>
                    ) : (
                        whaleData.map((tx) => (
                            <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors group relative">
                                {/* Row 1: Wallet & Identity */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getWalletBadge(tx) || (
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                                                <Wallet size={12} />
                                                {tx.walletAddress}
                                            </div>
                                        )}

                                        {/* 3. "Mirror Trade" Action */}
                                        <button
                                            onClick={() => handleMirrorClick(tx)}
                                            className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-orange-500/10 hover:border-orange-500/50 border border-transparent rounded text-slate-400 hover:text-orange-500 hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                                            title="Mirror this Trade"
                                        >
                                            <Zap size={12} className="fill-current" />
                                        </button>
                                    </div>

                                    <span className="text-[10px] text-slate-600 font-mono">{tx.timestamp}</span>
                                </div>

                                {/* Row 2: Action & Narrative */}
                                <div className="text-sm text-slate-400 mb-2 flex items-center flex-wrap">
                                    {getActionText(tx.action, tx.marketTicker)}
                                    {getSmartMoneyTag(tx)}
                                </div>

                                {/* Row 3: Value */}
                                <div className="flex items-center justify-between">
                                    <div className={clsx(
                                        "font-mono text-sm flex items-center gap-1",
                                        getValueStyles(tx.amount)
                                    )}>
                                        <span className={getActionColor(tx.action)}>
                                            {tx.action.includes('BUY') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        </span>
                                        {formatCurrency(tx.amount)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer / Status */}
            <div className="p-2 border-t border-slate-800 bg-slate-900/40 text-[10px] text-slate-500 text-center font-mono">
                LIVE FEED • {whaleData.length} TRANSACTIONS
            </div>
        </div>
    );
}
