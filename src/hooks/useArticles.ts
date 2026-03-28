import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    status: string;
    image_url: string | null;
    author: string | null;
    author_id: string | null;
    is_premium: boolean;
    views: number;
    tags: string[];
    created_at: string;
}

export function useArticles(category?: string, limit: number = 10) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticles() {
            setLoading(true);
            try {
                let query = supabase
                    .from('articles')
                    .select('*')
                    .eq('status', 'Published')
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (category && category !== 'Semua') {
                    query = query.eq('category', category);
                }

                const { data, error: supabaseError } = await query;

                if (supabaseError) throw supabaseError;
                setArticles(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, [category, limit]);

    return { articles, loading, error };
}
