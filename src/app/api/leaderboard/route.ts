import { NextResponse } from 'next/server';

// Initial Mock Leaderboard
const MOCK_LEADERBOARD = [
    { rank: 1, name: 'Wintermute_Exec', pnl: 1245000, winRate: 88.5, brierScore: 98.2 },
    { rank: 2, name: 'Paradigm_Intern', pnl: 850000, winRate: 76.2, brierScore: 94.5 },
    { rank: 3, name: 'Vitalik_Burner', pnl: 620000, winRate: 72.1, brierScore: 91.0 },
    { rank: 4, name: 'SBF_Ghost', pnl: 450000, winRate: 68.4, brierScore: 88.7 },
    { rank: 5, name: 'Alameda_Research', pnl: 320000, winRate: 65.9, brierScore: 85.2 },
    { rank: 6, name: 'GCR_Classic', pnl: 280000, winRate: 64.2, brierScore: 84.1 },
    { rank: 7, name: 'Cobie_Substack', pnl: 210000, winRate: 62.8, brierScore: 82.5 },
    { rank: 8, name: 'Hsaka_Trades', pnl: 180000, winRate: 61.5, brierScore: 81.0 },
    { rank: 9, name: 'Pentoshi_WAGMI', pnl: 150000, winRate: 59.8, brierScore: 79.5 },
    { rank: 10, name: 'Rookie_Trader', pnl: 120000, winRate: 58.2, brierScore: 78.0 },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userWallet = searchParams.get('userWallet');
    const userPnL = searchParams.get('userPnL');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let leaderboard = [...MOCK_LEADERBOARD];

    // If user has PnL, inject them into the leaderboard
    if (userWallet && userPnL) {
        const pnlValue = parseFloat(userPnL);
        const userEntry = {
            rank: 0, // Will be recalculated
            name: 'YOU (' + userWallet.slice(0, 6) + ')',
            pnl: pnlValue,
            winRate: 100, // Mock win rate for demo
            brierScore: 92.5, // Mock score
            isUser: true
        };

        leaderboard.push(userEntry);

        // Sort by PnL descending
        leaderboard.sort((a, b) => b.pnl - a.pnl);

        // Re-assign ranks
        leaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));
    }

    return NextResponse.json(leaderboard);
}
