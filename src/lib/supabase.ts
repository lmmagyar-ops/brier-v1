/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// This is a mock Supabase client for Phase 2.
// In Phase 3, we will replace this with the actual @supabase/supabase-js client.

// Mock In-Memory Store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_STORE: Record<string, any[]> = {
    whale_transactions: [],
    leaderboard: [
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
    ],
    portfolios: []
};

export const supabase = {
    from: (table: string) => {
        // Initialize table if not exists
        if (!MOCK_STORE[table]) {
            MOCK_STORE[table] = [];
        }

        return {
            select: async (columns: string) => {
                // console.log(`Mock Supabase: Selecting ${columns} from ${table}`);
                // Return copy of data
                return { data: [...MOCK_STORE[table]], error: null as null | { message: string } };
            },
            insert: async (data: any) => {
                // console.log(`Mock Supabase: Inserting into ${table}`, data);
                if (Array.isArray(data)) {
                    MOCK_STORE[table].push(...data);
                } else {
                    MOCK_STORE[table].push(data);
                }
                return { data: [data], error: null as null | { message: string } };
            },
            upsert: async (data: any) => {
                // console.log(`Mock Supabase: Upserting into ${table}`, data);
                // Simple replace logic for mock
                if (Array.isArray(data)) {
                    // In a real app, we'd check IDs. Here we just replace the whole table for simplicity if it's a bulk update like leaderboard
                    if (table === 'leaderboard') {
                        MOCK_STORE[table] = data;
                    } else {
                        MOCK_STORE[table].push(...data);
                    }
                }
                return { data: [data], error: null as null | { message: string } };
            },
            delete: () => ({
                eq: async (column: string, value: any) => {
                    MOCK_STORE[table] = MOCK_STORE[table].filter((row: any) => row[column] !== value);
                    return { error: null };
                }
            })
        };
    },
};
