import React, { useState } from 'react';
import { Gift, Copy, Users, Zap, CheckCircle2, TrendingUp, Lock } from 'lucide-react';

export default function RewardsView() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://brier.app/?ref=0x71C...9A2');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header / Hero */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-900/40 to-slate-900 border border-orange-500/30 p-8">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Gift size={200} className="text-orange-500" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Zap size={12} />
                        Acquisition Analytics
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Partner Rewards: Expand Your Network.</h1>
                    <p className="text-slate-400 text-lg mb-8">
                        Invite friends and earn <span className="text-orange-400 font-bold">10% of their trading fees</span> forever.
                        Payouts are automated via smart contract every Friday.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg p-1.5 flex items-center gap-2 w-full max-w-md">
                            <div className="pl-2 text-slate-500">
                                <Lock size={14} />
                            </div>
                            <div className="px-2 py-1.5 text-slate-500 font-mono text-sm truncate select-all flex-1">
                                https://brier.app/?ref=0x71C...9A2
                            </div>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] transition-all flex items-center gap-2 min-w-[200px] justify-center"
                        >
                            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'COPY REFERRAL CODE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Stats Cards */}
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Earnings</div>
                        <div className="text-3xl font-mono font-bold text-green-400">$1,240.50</div>
                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-green-500" />
                            Next Payout: Friday, Nov 28
                        </div>
                    </div>
                    <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Active Referrals</div>
                        <div className="text-3xl font-mono font-bold text-white">12</div>
                        <div className="text-xs text-slate-500 mt-2">
                            Top referrer in your region
                        </div>
                    </div>
                    <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-6 backdrop-blur-sm flex-1">
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">Reward Tiers</div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-sm text-slate-300">Bronze (5%)</span>
                                <span className="text-xs font-mono text-slate-500">0 Ref</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-orange-400 font-bold">Silver (10%)</span>
                                <span className="text-xs font-mono text-orange-400">5 Ref</span>
                            </div>
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-sm text-slate-300">Gold (15%)</span>
                                <span className="text-xs font-mono text-slate-500">25 Ref</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referrals Table */}
                <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/40">
                        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Users size={16} className="text-slate-500" />
                            Active Referrals
                        </h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900/60 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date Joined</th>
                                    <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Top Market Traded</th>
                                    <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Volume Traded</th>
                                    <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Your Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {[
                                    { id: 1, market: 'Fed Rate Cut' },
                                    { id: 2, market: 'BTC > 100k' },
                                    { id: 3, market: 'US Recession' },
                                    { id: 4, market: 'ETH ETF' },
                                    { id: 5, market: 'Solana ATH' }
                                ].map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                                                    U{item.id}
                                                </div>
                                                <span className="text-sm text-slate-300 font-mono">user_0x{item.id}a...f9</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 font-mono">2024-11-{10 + item.id}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-300 text-xs font-medium bg-slate-800/50 border border-slate-700">
                                                <TrendingUp size={10} className="text-slate-500" />
                                                {item.market}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-300">${(1000 * item.id).toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono font-bold text-orange-400">+${(100 * item.id).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
