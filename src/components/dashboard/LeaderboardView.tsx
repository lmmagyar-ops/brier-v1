import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Eye, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useUser } from '@/context/UserContext';

interface LeaderboardEntry {
    rank: number;
    name: string;
    pnl: number;
    winRate: number;
    brierScore: number;
    isUser?: boolean;
}

export default function LeaderboardView() {
    const { user } = useUser();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            try {
                // In a real app, we'd get the user's actual realized PnL from the DB
                // For this demo, we'll pass a mock PnL if the user is connected to simulate them being on the board
                let query = '';
                if (user?.wallet_address) {
                    // Simulate that the user has some realized PnL to show up
                    // We'll use a deterministic value based on address
                    const mockPnL = 145000;
                    query = `?userWallet=${user.wallet_address}&userPnL=${mockPnL}`;
                }

                const res = await fetch(`/api/leaderboard${query}`);
                const data = await res.json();
                setLeaderboard(data);
            } catch (error) {
                console.error('Failed to load leaderboard:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, [user?.wallet_address]);

    return (
        <div className="flex flex-col h-full bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Trophy size={20} className="text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Market Masters Leaderboard</h2>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">Top performers by realized PnL (30d)</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/60 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-20 text-center">Rank</th>
                            <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Trader</th>
                            <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Total PnL</th>
                            <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Win Rate</th>
                            <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Brier Score</th>
                            <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        Loading rankings...
                                    </div>
                                </td>
                            </tr>
                        ) : leaderboard.map((entry) => {
                            const isPro = entry.pnl > 250000 && entry.winRate > 60;
                            const isScoreHigh = entry.brierScore >= 85;

                            return (
                                <tr
                                    key={entry.rank}
                                    className={clsx(
                                        "transition-colors group",
                                        entry.isUser ? "bg-blue-500/10 hover:bg-blue-500/20 border-l-2 border-blue-500" : "hover:bg-slate-800/30 border-l-2 border-transparent"
                                    )}
                                >
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            {entry.rank === 1 ? (
                                                <Medal size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                            ) : entry.rank === 2 ? (
                                                <Medal size={20} className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />
                                            ) : entry.rank === 3 ? (
                                                <Medal size={20} className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
                                            ) : (
                                                <span className={clsx("font-mono font-bold", entry.isUser ? "text-blue-400" : "text-slate-500")}>#{entry.rank}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                                                entry.isUser ? "bg-blue-500 text-white border-blue-400" : "bg-slate-800 border-slate-700 text-slate-400"
                                            )}>
                                                {entry.isUser ? 'ME' : entry.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={clsx(
                                                    "font-medium text-sm flex items-center gap-2",
                                                    entry.isUser ? "text-blue-400 font-bold" : (entry.rank <= 3 ? "text-white font-bold" : "text-slate-300")
                                                )}>
                                                    {entry.name}
                                                    {isPro && (
                                                        <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-[9px] text-orange-500 font-mono font-bold uppercase tracking-wider">
                                                            PRO: Brier {Math.floor(entry.brierScore)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-mono font-bold text-green-400 text-sm">
                                            +{formatCurrency(entry.pnl)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-mono text-slate-300">
                                            {entry.winRate}%
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-32 h-2 bg-slate-800/70 rounded-full overflow-hidden relative shrink-0">
                                                {/* Target Tick Mark at 85% */}
                                                <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: '85%' }}></div>

                                                <div
                                                    className={clsx(
                                                        "h-full transition-all duration-500",
                                                        isScoreHigh
                                                            ? "bg-gradient-to-r from-blue-500 to-green-400"
                                                            : "bg-gradient-to-r from-purple-600 to-red-500"
                                                    )}
                                                    style={{ width: `${entry.brierScore}%` }}
                                                />
                                            </div>
                                            <span className={clsx(
                                                "font-mono text-xs font-bold w-10 text-right inline-block",
                                                isScoreHigh ? "text-green-400" : "text-slate-400"
                                            )}>{entry.brierScore}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
                                            <Eye size={12} />
                                            View Positions
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
