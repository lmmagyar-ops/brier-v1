export interface PortfolioPosition {
    id: string;
    user_id: string;
    market_id: string;
    market_title: string; // Denormalized for easier display in this phase
    position_type: 'YES' | 'NO';
    shares: number;
    avg_price: number; // in cents
    current_price: number; // in cents, usually fetched live, but stored for snapshot
    created_at: string;
}

export interface UserProfile {
    id: string;
    wallet_address: string;
    created_at: string;
}
