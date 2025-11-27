'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database';

interface UserContextType {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUser() {
            if (!isConnected || !address) {
                setUser(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // 1. Check if user exists
                // 1. Check if user exists
                const { error: fetchError } = await supabase
                    .from('users')
                    .select('*')
                // .eq('wallet_address', address) // Mock client doesn't support chaining yet
                // .single();

                // In our mock client, we just get an array. Let's simulate finding the user.
                // For now, we'll just assume if we get data, it's the user.
                // In a real app, we'd filter.

                if (fetchError) {
                    throw new Error(fetchError.message);
                }

                // 2. If not, create them
                // For this mock phase, we'll just synthesize a user object
                const userProfile: UserProfile = {
                    id: 'user_' + address.slice(0, 8),
                    wallet_address: address,
                    created_at: new Date().toISOString(),
                };

                // Simulate DB insert if "new" (mock logic)
                // await supabase.from('users').insert(userProfile);

                setUser(userProfile);
                console.log('User loaded:', userProfile);

            } catch (err: unknown) {
                console.error('Error loading user:', err);
                const errorMessage = err instanceof Error ? err.message : 'Failed to load user';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [address, isConnected]);

    return (
        <UserContext.Provider value={{ user, isLoading, error }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
