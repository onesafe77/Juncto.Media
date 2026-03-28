import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: string | null;
    isAdmin: boolean;
    loading: boolean;
    signUp: (identifier: string, password: string, fullName: string, occupation: string) => Promise<{ error: any }>;
    signIn: (identifier: string, password: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchProfile(userId: string, userMetadata?: any) {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (data) {
            setRole(data.role);
        } else if (error && error.code === 'PGRST116') {
            // Profile missing, try to create it (fallback if trigger failed)
            const { data: newData } = await supabase
                .from('profiles')
                .insert([
                    { id: userId, full_name: userMetadata?.full_name || '', role: 'user' }
                ])
                .select()
                .single();
            if (newData) setRole(newData.role);
        }
    }

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.user_metadata);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.user_metadata);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const isPhoneNumber = (identifier: string) => {
        // Basic check for phone numbers (contains only digits, spaces, plus, dashes, and is at least 8 chars long)
        // Adjust regex based on expected phone formats
        return /^[+\d\s-]{8,}$/.test(identifier.trim());
    };

    const signUp = async (identifier: string, password: string, fullName: string, occupation: string) => {
        const _isPhone = isPhoneNumber(identifier);
        const credentials = _isPhone ? { phone: identifier.trim() } : { email: identifier.trim() };

        const { error } = await supabase.auth.signUp({
            ...credentials,
            password,
            options: {
                data: {
                    full_name: fullName,
                    registered_name: fullName, // Protected custom custom field
                    occupation: occupation
                },
            },
        });
        return { error };
    };

    const signIn = async (identifier: string, password: string) => {
        const _isPhone = isPhoneNumber(identifier);
        const credentials = _isPhone ? { phone: identifier.trim() } : { email: identifier.trim() };

        const { error } = await supabase.auth.signInWithPassword({
            ...credentials,
            password
        });
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth`
            }
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, role, isAdmin: role === 'admin', loading, signUp, signIn, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
