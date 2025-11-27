import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Lock, Share2, ExternalLink, Scissors, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useUser } from '@/context/UserContext';
import { useUnifiedMarkets } from '@/hooks/useUnifiedMarkets';

const PerformanceChart = dynamic(() => import('./PerformanceChart'), { ssr: false });

interface Position {
    id: string;
    marketTitle: string;
    marketUrl: string;
    platform: 'Polymarket' | 'Kalshi';
    side: 'YES' | 'NO';
    size: number;
    avgEntry: number;
    currentPrice: number;
    unrealizedPnL: number;
    pnlPercent: number;
    expiresIn: string;
}

interface PortfolioViewProps {
    onSelectMarket?: (id: string, title: string) => void;
    selectedMarketId?: string | null;
}

// Mock Chain Data Helper
const fetchOnChainPositions = async (address: string) => {
    // Simulate RPC delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Deterministic mock data based on address char code to simulate different portfolios
    const seed = address.charCodeAt(address.length - 1);

    if (seed % 2 === 0) {
        // "Whale" Portfolio
        return [
            { marketId: 'poly_btc_100k', side: 'YES', amount: 50000, avgPrice: 32 },
            { marketId: 'poly_fed_cut', side: 'NO', amount: 12000, avgPrice: 45 },
            { marketId: 'kalshi_cpi', side: 'YES', amount: 2500, avgPrice: 88 }
        ];
    } else {
        // "Degen" Portfolio
        return [
            { marketId: 'poly_eth_etf', side: 'YES', amount: 100000, avgPrice: 12 },
            { marketId: 'poly_sol_ath', side: 'YES', amount: 5000, avgPrice: 24 }
        ];
    }
};

export default function PortfolioView({ onSelectMarket, selectedMarketId }: PortfolioViewProps) {
    const { user } = useUser();
    const { markets } = useUnifiedMarkets();
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);

    // Cash Out State
    const [cashOutModalOpen, setCashOutModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [isCashingOut, setIsCashingOut] = useState(false);
    const [cashOutSuccess, setCashOutSuccess] = useState(false);

    // Portfolio Metrics
    const [netLiquidation, setNetLiquidation] = useState(0);
    const [buyingPower, setBuyingPower] = useState(0);
    const [daysPnL, setDaysPnL] = useState(0);
    const [daysPnLPercent, setDaysPnLPercent] = useState(0);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const formatPrice = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

    useEffect(() => {
        async function loadPortfolioData() {
            if (!user?.wallet_address) {
                setPositions([]);
                setNetLiquidation(0);
                setBuyingPower(0);
                setDaysPnL(0);
                setDaysPnLPercent(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // 1. Fetch "On-Chain" Positions
                const rawPositions = await fetchOnChainPositions(user.wallet_address);

                // 2. Normalize & Calculate PnL using Live Market Data
                let totalValue = 0;
                let totalCost = 0;
                const normalizedPositions: Position[] = [];

                for (const raw of rawPositions) {
                    // Find matching market in our "Unified Market" index
                    // In a real app, we'd query by contract address or ID
                    // Here we'll do a fuzzy match or mock lookup since our market IDs might not match exactly
                    // For demo, we'll try to find a market that "looks" like the ID, or fallback to a default

                    let market = markets.find(m => m.id === raw.marketId) || markets[0]; // Fallback for demo

                    // Override title for specific mock IDs to make it look real
                    if (raw.marketId === 'poly_btc_100k') market = markets.find(m => m.title.includes('BTC')) || market;
                    if (raw.marketId === 'poly_fed_cut') market = markets.find(m => m.title.includes('Fed')) || market;

                    if (!market) continue;

                    const currentPrice = market.price / 100; // cents to dollars
                    const avgEntry = raw.avgPrice / 100;
                    const value = raw.amount * currentPrice;
                    const cost = raw.amount * avgEntry;

                    totalValue += value;
                    totalCost += cost;

                    normalizedPositions.push({
                        id: raw.marketId,
                        marketTitle: market.title,
                        marketUrl: market.url,
                        platform: raw.marketId.startsWith('kalshi') ? 'Kalshi' : 'Polymarket',
                        side: raw.side as 'YES' | 'NO',
                        size: raw.amount,
                        avgEntry,
                        currentPrice,
                        unrealizedPnL: value - cost,
                        pnlPercent: parseFloat((((value - cost) / cost) * 100).toFixed(1)),
                        expiresIn: '24d', // Mock expiry
                    });
                }

                // 3. Calculate Portfolio Totals
                const mockCash = 5420; // Simulated USDC balance
                const calculatedNetLiq = mockCash + totalValue;
                const calculatedDayPnL = totalValue - totalCost; // Simplified "Day PnL" as Total PnL for now
                const calculatedDayPnLPercent = totalCost > 0 ? (calculatedDayPnL / totalCost) * 100 : 0;

                setPositions(normalizedPositions);
                setNetLiquidation(calculatedNetLiq);
                setBuyingPower(mockCash);
                setDaysPnL(calculatedDayPnL);
                setDaysPnLPercent(parseFloat(calculatedDayPnLPercent.toFixed(2)));

            } catch (err) {
                console.error('Failed to load portfolio data:', err);
            } finally {
                setLoading(false);
            }
        }

        if (markets.length > 0) {
            loadPortfolioData();
        }
    }, [user?.wallet_address, markets]);

    const handleCashOutClick = (pos: Position, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPosition(pos);
        setCashOutModalOpen(true);
        setCashOutSuccess(false);
    };

    const confirmCashOut = async () => {
        if (!selectedPosition) return;

        setIsCashingOut(true);
        try {
            const response = await fetch('/api/user/portfolio/cashout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    positionId: selectedPosition.id,
                    closePrice: selectedPosition.currentPrice,
                    pnl: selectedPosition.unrealizedPnL
                })
            });

            if (response.ok) {
                setCashOutSuccess(true);
                // Remove position from local state after short delay
                setTimeout(() => {
                    setPositions(prev => prev.filter(p => p.id !== selectedPosition.id));
                    setCashOutModalOpen(false);
                    setSelectedPosition(null);
                }, 2000);
            }
        } catch (error) {
            console.error('Cash out failed:', error);
        } finally {
            setIsCashingOut(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 relative">
            {/* Cash Out Modal */}
            {cashOutModalOpen && selectedPosition && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-96 shadow-2xl transform transition-all">
                        {cashOutSuccess ? (
                            <div className="flex flex-col items-center text-center gap-4 py-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Cash Out Successful!</h3>
                                <p className="text-slate-400 text-sm">
                                    You realized <span className="text-green-400 font-mono font-bold">+{formatCurrency(selectedPosition.unrealizedPnL)}</span> in profit.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-6 text-amber-500">
                                    <AlertTriangle size={24} />
                                    <h3 className="text-lg font-bold uppercase tracking-wide">Confirm Cash Out</h3>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Market</span>
                                        <span className="text-slate-200 font-medium truncate max-w-[180px]">{selectedPosition.marketTitle}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Position</span>
                                        <span className={clsx("font-bold font-mono", selectedPosition.side === 'YES' ? "text-green-400" : "text-red-400")}>
                                            {selectedPosition.side} ({selectedPosition.size.toLocaleString()} shares)
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Current Value</span>
                                        <span className="text-slate-200 font-mono">{formatCurrency(selectedPosition.size * selectedPosition.currentPrice)}</span>
                                    </div>
                                    <div className="p-3 bg-slate-800/50 rounded border border-slate-700 flex justify-between items-center">
                                        <span className="text-xs text-slate-400 uppercase font-bold">Realized PnL</span>
                                        <span className="text-green-400 font-mono font-bold text-lg">+{formatCurrency(selectedPosition.unrealizedPnL)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setCashOutModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={confirmCashOut}
                                        disabled={isCashingOut}
                                        className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
                                    >
                                        {isCashingOut ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                        CONFIRM
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Header Stats & Allocation */}
            <div className="flex flex-col gap-4 bg-slate-900/20 border border-slate-800 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden">
                {/* Share Button */}
                <button className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-300 transition-colors rounded-full hover:bg-white/5">
                    <Share2 size={16} />
                </button>

                <div className="grid grid-cols-3 gap-8">
                    {/* Net Liq */}
                    <div>
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Net Liquidation Value</div>
                        <div className="text-3xl font-mono font-bold text-white">{formatCurrency(netLiquidation)}</div>
                    </div>

                    {/* Buying Power */}
                    <div>
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Buying Power</div>
                        <div className="text-3xl font-mono font-bold text-slate-300">{formatCurrency(buyingPower)}</div>
                    </div>

                    {/* Day PnL */}
                    <div>
                        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Unrealized PnL</div>
                        <div className={clsx(
                            "flex items-end gap-2",
                            daysPnL >= 0 ? "drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]" : "drop-shadow-[0_0_15px_rgba(248,113,113,0.25)]"
                        )}>
                            <div className={clsx(
                                "text-4xl font-mono font-bold",
                                daysPnL >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                                {daysPnL >= 0 ? '+' : ''}{formatCurrency(daysPnL)}
                            </div>
                            <div className={clsx(
                                "text-lg font-mono mb-1.5",
                                daysPnL >= 0 ? "text-green-500/80" : "text-red-500/80"
                            )}>
                                ({daysPnLPercent}%)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Allocation Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                        <span>Portfolio Allocation</span>
                        <div className="flex gap-3">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Polymarket (60%)</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Kalshi (30%)</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-600"></div>Cash (10%)</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-slate-800">
                        <div className="h-full bg-blue-500 w-[60%] shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                        <div className="h-full bg-green-500 w-[30%] shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                        <div className="h-full bg-slate-600 w-[10%]"></div>
                    </div>
                </div>
            </div>

            {/* Performance Chart */}
            <PerformanceChart />

            {/* Active Positions Table */}
            <div className="flex-1 bg-slate-900/20 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm flex flex-col">
                <div className="p-4 border-b border-slate-800 bg-slate-900/40">
                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Positions</h2>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/60 sticky top-0 z-10">
                            <tr>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Market</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Side</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Size</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Avg Entry</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Current</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Expires</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Unrealized PnL</th>
                                <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            Loading chain data...
                                        </div>
                                    </td>
                                </tr>
                            ) : positions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-slate-500">No active positions found on-chain.</td>
                                </tr>
                            ) : positions.map((pos) => (
                                <tr
                                    key={pos.id}
                                    onClick={() => onSelectMarket?.(pos.id, pos.marketTitle)}
                                    className={clsx(
                                        "transition-colors group cursor-pointer",
                                        selectedMarketId === pos.id ? "bg-slate-800/60 border-l-2 border-orange-500" : "hover:bg-slate-800/30 border-l-2 border-transparent"
                                    )}
                                >
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-medium text-slate-200 truncate max-w-[280px]">{pos.marketTitle}</div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={pos.marketUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={clsx(
                                                        "text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 hover:opacity-80 transition-opacity",
                                                        pos.platform === 'Polymarket' ? "bg-blue-950/50 text-blue-400" : "bg-green-950/50 text-green-400"
                                                    )}
                                                >
                                                    {pos.platform}
                                                    <ExternalLink size={8} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx(
                                            "font-bold font-mono",
                                            pos.side === 'YES' ? "text-green-400" : "text-red-400"
                                        )}>
                                            {pos.side}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-300">{pos.size.toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono text-slate-400">{formatPrice(pos.avgEntry)}</td>
                                    <td className="p-4 text-right font-mono text-slate-200">{formatPrice(pos.currentPrice)}</td>
                                    <td className="p-4 text-right font-mono text-slate-400 text-xs">{pos.expiresIn}</td>
                                    <td className="p-4 text-right">
                                        <div className={clsx(
                                            "font-mono font-bold",
                                            pos.unrealizedPnL >= 0 ? "text-green-400" : "text-red-400"
                                        )}>
                                            {pos.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(pos.unrealizedPnL)}
                                            <span className="text-xs opacity-70 ml-1">({pos.pnlPercent}%)</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        {pos.pnlPercent > 10 ? (
                                            <button
                                                onClick={(e) => handleCashOutClick(pos, e)}
                                                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-all shadow-lg shadow-emerald-900/20 w-40"
                                            >
                                                <Lock size={12} />
                                                CASH OUT {formatCurrency(pos.size * pos.currentPrice)}
                                            </button>
                                        ) : pos.unrealizedPnL < 0 ? (
                                            <button className="inline-flex items-center justify-center gap-1.5 border border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold px-3 py-1.5 rounded transition-all w-40">
                                                <Scissors size={12} />
                                                CLOSE POSITION
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-600 font-mono w-40 inline-block text-center">HOLD</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
