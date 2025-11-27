export interface Market {
    id: string;
    title: string;
    platform: 'Polymarket' | 'Kalshi';
    outcome: string;
    price: number; // in cents
    change24h: number; // percentage
    trend7d: number[]; // array of 7 numbers for sparkline
    volume: string;
    url: string;
    isArbGroup?: boolean;
    category: 'Crypto' | 'Politics' | 'Economy' | 'Science';
}
