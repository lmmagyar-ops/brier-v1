import { useState, useEffect } from 'react';
import { Market } from '@/types/market';

export function useUnifiedMarkets() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMarkets() {
            try {
                const response = await fetch('/api/markets');
                if (!response.ok) throw new Error('Failed to fetch markets');
                const data = await response.json();
                setMarkets(data);
            } catch (err) {
                console.error('Failed to fetch markets:', err);
                // In a real app, we might handle this error more gracefully or show a toast.
                // For now, we just leave the list empty or previous state.
            } finally {
                setLoading(false);
            }
        }

        fetchMarkets();
    }, []);

    return { markets, loading };
}
