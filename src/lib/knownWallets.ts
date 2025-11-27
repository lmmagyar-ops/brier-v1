export interface WalletInfo {
    name: string;
    tier: 'gold' | 'blue';
}

export const KNOWN_WALLETS: Record<string, WalletInfo> = {
    // Market Makers & Funds
    '0x3f...a9': { name: 'Wintermute', tier: 'gold' },
    '0x1c...44': { name: 'Paradigm', tier: 'gold' },
    '0x9d...ff': { name: 'Alameda (Legacy)', tier: 'gold' },
    '0x88...21': { name: 'Jump Trading', tier: 'gold' },
    '0x55...ab': { name: 'GSR Markets', tier: 'gold' },

    // Notable Individuals / Whales
    '0x77...11': { name: 'Vitalik.eth', tier: 'gold' },
    '0xaa...bb': { name: 'Whale 0xAA', tier: 'blue' },
    '0xcc...dd': { name: 'Whale 0xCC', tier: 'blue' },
    '0xee...ff': { name: 'Whale 0xEE', tier: 'blue' },
};

export function getWalletLabel(address: string): WalletInfo | null {
    return KNOWN_WALLETS[address] || null;
}
