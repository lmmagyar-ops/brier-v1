import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock Whale Data Generator
const generateWhaleTrades = () => {
    const tickers = ['BTC_100K_2024', 'ETH_FLIPPENING', 'SOL_ETF_APPROVAL', 'FED_RATE_DEC', 'US_ELECTION_2028'];
    const actions = ['BUY_YES', 'BUY_NO', 'SELL_YES', 'SELL_NO'];
    const whales = [
        { address: '0x3f...a9', name: 'Wintermute', isKnown: true },
        { address: '0x1c...44', name: 'Paradigm', isKnown: true },
        { address: '0x9d...ff', name: 'Unknown Whale', isKnown: false },
        { address: '0x7a...b2', name: 'Unknown Whale', isKnown: false },
        { address: '0x4e...11', name: 'Unknown Whale', isKnown: false },
    ];

    const trades = [];
    for (let i = 0; i < 5; i++) {
        const whale = whales[Math.floor(Math.random() * whales.length)];
        const ticker = tickers[Math.floor(Math.random() * tickers.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const amount = Math.floor(Math.random() * 1000000) + 10000; // $10k - $1M

        trades.push({
            id: `tx-${Date.now()}-${i}`,
            walletAddress: whale.address,
            isKnownWhale: whale.isKnown,
            whaleName: whale.name,
            action,
            marketTicker: ticker,
            amount,
            timestamp: 'Just now',
            marketSentiment: Math.floor(Math.random() * 100),
        });
    }
    return trades;
};

export async function GET() {
    try {
        console.log('[Cron] Starting Whale Scan...');

        // 1. Simulate fetching from chain
        const newTrades = generateWhaleTrades();

        // 2. Write to Supabase
        // In a real app, we might want to append, but for this demo we'll just keep the latest list or append
        // Let's append to the mock store
        const { error } = await supabase.from('whale_transactions').insert(newTrades);

        if (error) throw error;

        console.log(`[Cron] Successfully indexed ${newTrades.length} whale trades.`);

        return NextResponse.json({
            success: true,
            message: `Indexed ${newTrades.length} trades`,
            trades: newTrades
        });
    } catch (error) {
        console.error('[Cron] Whale Scan Failed:', error);
        return NextResponse.json({ error: 'Whale Scan Failed' }, { status: 500 });
    }
}
