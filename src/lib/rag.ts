import { supabase } from './supabase';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'; // For chat
const OPENROUTER_EMBEDDING_URL = 'https://openrouter.ai/api/v1/embeddings';
const FIRECRAWL_API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;

// Note: OpenRouter supports OpenAI-compatible embeddings
// Model: openai/text-embedding-3-small (1536 dims)

export interface DocumentChunk {
    content: string;
    metadata?: any;
}

/**
 * Splits text into chunks of roughly equal size with overlap
 */
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }

    return chunks;
}

/**
 * Generates embeddings using OpenRouter (OpenAI model)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API Key is missing');
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'openai/text-embedding-3-small',
                input: text,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.error?.message || `Embedding failed: ${response.status}`);
        }

        const data = await response.json();
        return data.data[0].embedding;
    } catch (err) {
        console.error('Embedding Generation Error:', err);
        throw err;
    }
}

/**
 * Processes a document: chunks it, generates embeddings, and saves to Supabase
 */
export async function processDocument(documentId: string, content: string) {
    try {
        // 1. Update status to Processing
        await supabase.from('rag_documents').update({ status: 'Processing' }).eq('id', documentId);

        // 2. Chunk text
        const chunks = chunkText(content);
        let chunksProcessed = 0;

        for (const chunk of chunks) {
            // 3. Generate embedding for each chunk
            const embedding = await generateEmbedding(chunk);

            // 4. Save chunk to Supabase
            const { error } = await supabase.from('rag_chunks').insert({
                document_id: documentId,
                content: chunk,
                embedding: embedding,
                metadata: { chunk_index: chunksProcessed }
            });

            if (error) throw error;
            chunksProcessed++;
        }

        // 5. Update status to Indexed
        await supabase.from('rag_documents').update({
            status: 'Indexed',
            chunks_count: chunksProcessed
        }).eq('id', documentId);

        return { success: true, chunks: chunksProcessed };
    } catch (err) {
        console.error('Document Processing Error:', err);
        await supabase.from('rag_documents').update({ status: 'Error' }).eq('id', documentId);
        throw err;
    }
}

/**
 * Searches for relevant chunks based on a query
 */
export async function searchContext(query: string, matchThreshold: number = 0.5, matchCount: number = 5) {
    try {
        const queryEmbedding = await generateEmbedding(query);

        const { data, error } = await supabase.rpc('match_chunks', {
            query_embedding: queryEmbedding,
            match_threshold: matchThreshold,
            match_count: matchCount,
        });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Context Search Error:', err);
        return [];
    }
}

/**
 * Index all unindexed articles from the CMS into the RAG system
 */
export async function indexAllArticles(
    onProgress?: (current: number, total: number, name: string) => void
): Promise<{ indexed: number; errors: number }> {
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, content, snippet, category, author')
        .eq('is_rag_indexed', false);

    if (error || !articles) return { indexed: 0, errors: 0 };

    let indexed = 0;
    let errors = 0;

    for (const article of articles) {
        try {
            onProgress?.(indexed + errors + 1, articles.length, article.title);

            // Combine article fields into a single text for RAG
            const fullText = [
                `Judul: ${article.title}`,
                `Kategori: ${article.category}`,
                `Penulis: ${article.author}`,
                `Ringkasan: ${article.snippet || ''}`,
                `Konten: ${article.content}`
            ].join('\n\n');

            // Create a rag_document entry
            const { data: doc, error: docErr } = await supabase.from('rag_documents').insert({
                name: `[Artikel] ${article.title}`,
                type: 'CMS',
                size: `${(fullText.length / 1024).toFixed(1)} KB`,
                status: 'Processing',
                metadata: { source: 'articles', source_id: article.id }
            }).select().single();

            if (docErr || !doc) throw docErr;

            // Process document (chunk + embed)
            await processDocument(doc.id, fullText);

            // Mark article as indexed
            await supabase.from('articles').update({ is_rag_indexed: true }).eq('id', article.id);
            indexed++;
        } catch (err) {
            console.error(`Failed to index article: ${article.title}`, err);
            errors++;
        }
    }

    return { indexed, errors };
}

/**
 * Index all unindexed investigations from the CMS into the RAG system
 */
export async function indexAllInvestigations(
    onProgress?: (current: number, total: number, name: string) => void
): Promise<{ indexed: number; errors: number }> {
    const { data: investigations, error } = await supabase
        .from('investigations')
        .select('id, title, description, journalist, status, priority, tags')
        .eq('is_rag_indexed', false);

    if (error || !investigations) return { indexed: 0, errors: 0 };

    let indexed = 0;
    let errors = 0;

    for (const inv of investigations) {
        try {
            onProgress?.(indexed + errors + 1, investigations.length, inv.title);

            const fullText = [
                `Judul Investigasi: ${inv.title}`,
                `Status: ${inv.status}`,
                `Prioritas: ${inv.priority}`,
                `Jurnalis: ${inv.journalist}`,
                `Tags: ${(inv.tags || []).join(', ')}`,
                `Deskripsi: ${inv.description || ''}`
            ].join('\n\n');

            const { data: doc, error: docErr } = await supabase.from('rag_documents').insert({
                name: `[Investigasi] ${inv.title}`,
                type: 'CMS',
                size: `${(fullText.length / 1024).toFixed(1)} KB`,
                status: 'Processing',
                metadata: { source: 'investigations', source_id: inv.id }
            }).select().single();

            if (docErr || !doc) throw docErr;

            await processDocument(doc.id, fullText);

            await supabase.from('investigations').update({ is_rag_indexed: true }).eq('id', inv.id);
            indexed++;
        } catch (err) {
            console.error(`Failed to index investigation: ${inv.title}`, err);
            errors++;
        }
    }

    return { indexed, errors };
}

/**
 * Sync all CMS data (articles + investigations) into the RAG system
 */
export async function syncAllCMSData(
    onProgress?: (stage: string, current: number, total: number, name: string) => void
): Promise<{ articles: { indexed: number; errors: number }; investigations: { indexed: number; errors: number } }> {
    const articlesResult = await indexAllArticles((c, t, n) =>
        onProgress?.('Artikel', c, t, n)
    );

    const investigationsResult = await indexAllInvestigations((c, t, n) =>
        onProgress?.('Investigasi', c, t, n)
    );

    return { articles: articlesResult, investigations: investigationsResult };
}

/**
 * Scrape a URL using Firecrawl and index its content into the RAG system
 */
export async function scrapeAndIndexURL(
    url: string,
    onProgress?: (status: string) => void
): Promise<{ success: boolean; title: string; chunks: number }> {
    if (!FIRECRAWL_API_KEY) {
        throw new Error('Firecrawl API Key belum dikonfigurasi. Tambahkan VITE_FIRECRAWL_API_KEY di .env.local');
    }

    try {
        onProgress?.('Scraping halaman...');

        // 1. Scrape URL via Firecrawl
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url: url,
                formats: ['markdown'],
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Firecrawl HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json();
        if (!data.success || !data.data?.markdown) {
            throw new Error('Firecrawl gagal mengambil konten dari URL');
        }

        const content = data.data.markdown;
        const title = data.data.metadata?.title || url;

        onProgress?.('Menyimpan dokumen...');

        // 2. Create rag_document entry
        const { data: doc, error: docErr } = await supabase.from('rag_documents').insert({
            name: `[Web] ${title}`,
            type: 'URL',
            size: `${(content.length / 1024).toFixed(1)} KB`,
            status: 'Processing',
            metadata: { source: 'firecrawl', url: url }
        }).select().single();

        if (docErr || !doc) throw docErr;

        onProgress?.('Memproses dan mengindeks...');

        // 3. Process into RAG (chunk + embed)
        const result = await processDocument(doc.id, content);

        return { success: true, title, chunks: result.chunks };
    } catch (err: any) {
        console.error('Scrape & Index Error:', err);
        throw err;
    }
}

/**
 * Get all chunks for a specific document
 */
export async function getDocumentChunks(documentId: string) {
    const { data, error } = await supabase
        .from('rag_chunks')
        .select('id, content, metadata, created_at')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Delete a document and its chunks from the RAG system
 */
export async function deleteDocument(documentId: string) {
    // Chunks are cascade-deleted via FK
    const { error } = await supabase
        .from('rag_documents')
        .delete()
        .eq('id', documentId);

    if (error) throw error;
}

/**
 * Auto-crawl: Discover UU links from peraturan.go.id listing and batch-scrape them
 */
export async function crawlPeraturanUU(
    maxPages: number = 1,
    onProgress?: (status: string, current: number, total: number) => void
): Promise<{ discovered: number; indexed: number; skipped: number; errors: number }> {
    if (!FIRECRAWL_API_KEY) {
        throw new Error('Firecrawl API Key belum dikonfigurasi');
    }

    let allDetailLinks: string[] = [];

    // Step 1: Crawl listing pages to discover UU detail links
    for (let page = 1; page <= maxPages; page++) {
        onProgress?.(`Mengambil daftar UU halaman ${page}...`, 0, 0);

        const listUrl = page === 1
            ? 'https://peraturan.go.id/uu'
            : `https://peraturan.go.id/uu?page=${page}`;

        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({ url: listUrl, formats: ['links'] }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        if (!data.success) continue;

        const links = (data.data?.links || []) as string[];
        const detailLinks = links.filter((l: string) =>
            l.match(/peraturan\.go\.id\/id\/uu-no-/) && !l.includes('#')
        );
        allDetailLinks.push(...detailLinks);
    }

    // Deduplicate
    allDetailLinks = [...new Set(allDetailLinks)];

    // Step 2: Check which URLs are already indexed
    const { data: existingDocs } = await supabase
        .from('rag_documents')
        .select('metadata')
        .eq('type', 'URL');

    const existingUrls = new Set(
        (existingDocs || [])
            .map((d: any) => d.metadata?.url)
            .filter(Boolean)
    );

    const newLinks = allDetailLinks.filter(url => !existingUrls.has(url));
    const skipped = allDetailLinks.length - newLinks.length;

    let indexed = 0;
    let errors = 0;

    // Step 3: Scrape and index each new UU
    for (let i = 0; i < newLinks.length; i++) {
        const url = newLinks[i];
        onProgress?.(`Scraping ${url.split('/').pop()}...`, i + 1, newLinks.length);

        try {
            await scrapeAndIndexURL(url);
            indexed++;
        } catch (err) {
            console.error(`Failed to scrape ${url}:`, err);
            errors++;
        }

        // Rate limit: 1.5s delay between requests
        if (i < newLinks.length - 1) {
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    return {
        discovered: allDetailLinks.length,
        indexed,
        skipped,
        errors,
    };
}
