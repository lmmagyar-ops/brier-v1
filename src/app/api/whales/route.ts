import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch latest whale transactions from Supabase
        const { data, error } = await supabase.from('whale_transactions').select('*');

        if (error) throw error;

        // If no data (e.g. cron hasn't run yet), return empty array or fallback
        // The frontend handles empty states

        // Sort by timestamp if needed, but for now just return
        // In a real DB we'd use .order('created_at', { ascending: false })

        // Reverse to show newest first if we just appended
        const reversedData = [...(data || [])].reverse();

        return NextResponse.json(reversedData);
    } catch (error) {
        console.error('Failed to fetch whale data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
