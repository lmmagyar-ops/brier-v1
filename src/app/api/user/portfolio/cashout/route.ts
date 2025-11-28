import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { positionId, closePrice, pnl } = body;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log(`[Mock API] Cashing out position ${positionId} at ${closePrice} with PnL ${pnl}`);

        // In a real app, we would:
        // 1. Verify ownership
        // 2. Execute trade on-chain or update DB
        // 3. Record realized PnL

        return NextResponse.json({
            success: true,
            message: 'Position closed successfully',
            realizedPnL: pnl
        });
    } catch {
        return NextResponse.json({ error: 'Failed to process cash out' }, { status: 500 });
    }
}
