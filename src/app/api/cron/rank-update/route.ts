import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock User Data for Ranking
const MOCK_USERS = [
    { name: 'Wintermute_Exec', pnl: 1245000, winRate: 88.5, brierScore: 98.2 },
    { name: 'Paradigm_Intern', pnl: 850000, winRate: 76.2, brierScore: 94.5 },
    { name: 'Vitalik_Burner', pnl: 620000, winRate: 72.1, brierScore: 91.0 },
    { name: 'SBF_Ghost', pnl: 450000, winRate: 68.4, brierScore: 88.7 },
    { name: 'Alameda_Research', pnl: 320000, winRate: 65.9, brierScore: 85.2 },
    { name: 'GCR_Classic', pnl: 280000, winRate: 64.2, brierScore: 84.1 },
    { name: 'Cobie_Substack', pnl: 210000, winRate: 62.8, brierScore: 82.5 },
    { name: 'Hsaka_Trades', pnl: 180000, winRate: 61.5, brierScore: 81.0 },
    { name: 'Pentoshi_WAGMI', pnl: 150000, winRate: 59.8, brierScore: 79.5 },
    { name: 'Rookie_Trader', pnl: 120000, winRate: 58.2, brierScore: 78.0 },
];

export async function GET() {
    try {
        console.log('[Cron] Starting Daily Rank Update...');

        // 1. Simulate fetching all user PnL from DB
        // In a real app: const { data: users } = await supabase.from('users').select('*');

        // 2. Simulate some PnL changes
        const updatedUsers = MOCK_USERS.map(user => ({
            ...user,
            pnl: user.pnl + Math.floor(Math.random() * 10000) - 5000, // Random fluctuation
            winRate: Math.min(100, Math.max(0, user.winRate + (Math.random() - 0.5))),
            brierScore: Math.min(100, Math.max(0, user.brierScore + (Math.random() - 0.5)))
        }));

        // 3. Sort by PnL
        updatedUsers.sort((a, b) => b.pnl - a.pnl);

        // 4. Assign Ranks
        const newLeaderboard = updatedUsers.map((user, index) => ({
            rank: index + 1,
            ...user
        }));

        // 5. Update Leaderboard Table
        // We'll replace the entire table for simplicity
        const { error } = await supabase.from('leaderboard').upsert(newLeaderboard);

        if (error) throw error;

        console.log('[Cron] Leaderboard updated successfully.');

        return NextResponse.json({
            success: true,
            message: 'Leaderboard updated',
            topTrader: newLeaderboard[0].name
        });

    } catch (error) {
        console.error('[Cron] Rank Update Failed:', error);
        return NextResponse.json({ error: 'Rank Update Failed' }, { status: 500 });
    }
}
