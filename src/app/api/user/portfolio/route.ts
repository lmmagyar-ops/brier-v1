import { NextResponse } from 'next/server';
import { PortfolioPosition } from '@/types/database';

// Mock Data for Phase 2
const MOCK_PORTFOLIO: PortfolioPosition[] = [
    {
        id: 'pos-1',
        user_id: 'mock-user',
        market_id: 'mock-1',
        market_title: 'Will Bitcoin hit $100k in 2024?',
        position_type: 'YES',
        shares: 1500,
        avg_price: 28,
        current_price: 32,
        created_at: new Date().toISOString(),
    },
    {
        id: 'pos-2',
        user_id: 'mock-user',
        market_id: 'mock-3',
        market_title: '2024 US Presidential Election Winner',
        position_type: 'NO', // Shorting
        shares: 500,
        avg_price: 55,
        current_price: 48,
        created_at: new Date().toISOString(),
    }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!walletAddress) {
        return NextResponse.json([]);
    }

    // Filter mock data by user_id (which we'll treat as wallet address for now)
    // In a real app, we'd query Supabase: .eq('user_id', walletAddress)
    const userPositions = MOCK_PORTFOLIO.filter(p => p.user_id === walletAddress || p.user_id === 'mock-user'); // Keep mock-user for demo

    return NextResponse.json(userPositions);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newPosition: PortfolioPosition = {
            id: `pos-${Date.now()}`,
            user_id: 'mock-user',
            created_at: new Date().toISOString(),
            ...body
        };

        // In a real app, we would save to Supabase here.
        // await supabase.from('portfolios').insert(newPosition);

        MOCK_PORTFOLIO.push(newPosition);

        return NextResponse.json(newPosition);
    } catch {
        return NextResponse.json({ error: 'Failed to save position' }, { status: 500 });
    }
}
