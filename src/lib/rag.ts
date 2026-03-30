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
 * Cleans scraped markdown content by removing navigation, ads, login prompts, etc.
 */
export function cleanScrapedContent(markdown: string): string {
    let cleaned = markdown;

    // Remove entire blocks that are clearly navigation/promo (multi-line patterns)
    cleaned = cleaned.replace(/Amar Putusan:.*?Untuk Akses Fitur Ini/gis, 'Amar Putusan: [Konten memerlukan akses premium]');
    cleaned = cleaned.replace(/\[Login\].*?Untuk Akses Fitur Ini/gis, '');
    cleaned = cleaned.replace(/\[Berlangganan\].*?Untuk Akses Fitur Ini/gis, '');
    cleaned = cleaned.replace(/Untuk Akses Fitur Ini/gi, '');
    cleaned = cleaned.replace(/returnUrl=.*?(?=\n|$)/gm, '');

    // Remove common noise patterns (line-by-line)
    const noisePatterns = [
        // Login/Auth
        /^.*\[Login\]\(https?:\/\/.*\).*$/gim,
        /^.*\[Berlangganan\]\(https?:\/\/.*\).*$/gim,
        /^.*\[Daftar\]\(https?:\/\/.*\).*$/gim,
        /^.*\[Masuk\]\(https?:\/\/.*\).*$/gim,
        /^.*\[Sign[\s-]?[Ii]n\].*$/gim,
        /^.*\[Sign[\s-]?[Uu]p\].*$/gim,
        /^.*\[Register\].*$/gim,
        // HukumOnline-specific
        /^.*hukumonline\.com\/user\/login.*$/gim,
        /^.*pro\.hukumonline\.com\/paket.*$/gim,
        /^.*utm_source=website.*$/gim,
        /^.*utm_medium=navbar.*$/gim,
        /^.*utm_campaign=.*$/gim,
        /^.*"Login"\) Atau \["Berlangganan"\].*$/gim,
        /^.*Untuk Akses Fitur Ini.*$/gim,
        /^.*returnUrl=.*$/gim,
        // Navigation/Footer
        /^\s*\[?(Home|Beranda|Menu|Navigasi|Navigation|Breadcrumb)\]?.*$/gim,
        /^\s*Buat Akun.*$/gim,
        /^\s*Masuk ke akun anda.*$/gim,
        /^\s*Copyright ©.*$/gim,
        /^\s*All Rights Reserved.*$/gim,
        /^\s*Hubungi Kami.*$/gim,
        /^\s*KONTAK KAMI.*$/gim,
        /^\s*Follow us.*$/gim,
        /^\s*Ikuti kami.*$/gim,
        /^\s*Share this.*$/gim,
        /^\s*Bagikan.*$/gim,
        /^\s*Tags?:.*$/gim,
        /^\s*Kata Kunci:.*$/gim,
        /^\s*Related Articles.*$/gim,
        /^\s*Artikel Terkait.*$/gim,
        /^\s*Baca juga.*$/gim,
        /^\s*Download App.*$/gim,
        /^\s*Newsletter.*$/gim,
        /^\s*Sosial Media.*$/gim,
        /^\s*TAUTAN.*$/gim,
        /^\s*JURNAL HUKUM.*$/gim,
        /^\s*\[.*\]\(javascript:void.*\)$/gim,
    ];

    for (const pattern of noisePatterns) {
        cleaned = cleaned.replace(pattern, '');
    }

    // Remove lines that are just markdown links (navigation)
    cleaned = cleaned.split('\n').filter(line => {
        const trimmed = line.trim();
        // Remove lines that are ONLY a markdown link with no real text
        if (/^\[.*\]\(https?:\/\/.*\)\s*$/.test(trimmed) && trimmed.length < 200) {
            // Keep if it looks like a real reference (has descriptive text)
            const linkText = trimmed.match(/^\[(.*)\]/);
            if (linkText && linkText[1].length > 30) return true; // Descriptive links kept
            return false; // Short navigation links removed
        }
        // Remove lines with login/berlangganan URLs
        if (/\/(login|signup|register|berlangganan|paket)/.test(trimmed) && !/^(PUTUSAN|Nomor|Pasal|ayat|Undang|Peraturan)/i.test(trimmed)) return false;
        return true;
    }).join('\n');

    // Remove excessive blank lines
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n');

    return cleaned.trim();
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
                formats: ['markdown', 'links'],
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

        let content = data.data.markdown;
        const title = data.data.metadata?.title || url;
        const links = (data.data?.links || []) as string[];

        // 2. Auto-detect PDF links and extract PDF content
        const pdfLinks = links.filter((l: string) =>
            l.match(/\.(pdf)($|\?)/i) || l.includes('/file/download') || l.includes('/download/')
        );

        // Also check markdown content for PDF links
        const markdownPdfMatches = content.match(/\(https?:\/\/[^)]*(?:\.pdf|file\/download|\/download\/)[^)]*\)/gi) || [];
        for (const match of markdownPdfMatches) {
            const pdfUrl = match.slice(1, -1); // Remove parentheses
            if (!pdfLinks.includes(pdfUrl)) pdfLinks.push(pdfUrl);
        }

        let pdfContent = '';
        if (pdfLinks.length > 0) {
            onProgress?.(`Mengambil isi PDF (${pdfLinks.length} file)...`);

            for (const pdfUrl of pdfLinks.slice(0, 3)) { // Max 3 PDFs per page
                try {
                    const pdfResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                        },
                        body: JSON.stringify({
                            url: pdfUrl,
                            formats: ['markdown'],
                        }),
                    });

                    if (pdfResponse.ok) {
                        const pdfData = await pdfResponse.json();
                        if (pdfData.success && pdfData.data?.markdown) {
                            pdfContent += '\n\n--- ISI DOKUMEN PDF ---\n\n' + pdfData.data.markdown;
                        }
                    }

                    // Rate limit between PDF fetches
                    await new Promise(r => setTimeout(r, 1000));
                } catch (pdfErr) {
                    console.warn(`Failed to extract PDF from ${pdfUrl}:`, pdfErr);
                }
            }
        }

        // Combine: metadata page + PDF content
        const fullContent = pdfContent
            ? content + '\n\n' + pdfContent
            : content;

        onProgress?.('Menyimpan dokumen...');

        // 3. Create rag_document entry
        const { data: doc, error: docErr } = await supabase.from('rag_documents').insert({
            name: `[Web] ${title}`,
            type: 'URL',
            size: `${(fullContent.length / 1024).toFixed(1)} KB`,
            status: 'Processing',
            metadata: { source: 'firecrawl', url: url, hasPdf: pdfContent.length > 0 }
        }).select().single();

        if (docErr || !doc) throw docErr;

        onProgress?.('Memproses dan mengindeks...');

        // 4. Clean the content before processing
        const cleanedContent = cleanScrapedContent(fullContent);

        // 5. Process into RAG (chunk + embed)
        const result = await processDocument(doc.id, cleanedContent);

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

/**
 * Auto-crawl: Discover regulations from jdihn.go.id and batch-scrape them
 * Uses Firecrawl /map endpoint for URL discovery since JDIHN uses JS rendering
 */
export async function crawlJDIHN(
    maxResults: number = 10,
    onProgress?: (status: string, current: number, total: number) => void
): Promise<{ discovered: number; indexed: number; skipped: number; errors: number }> {
    if (!FIRECRAWL_API_KEY) {
        throw new Error('Firecrawl API Key belum dikonfigurasi');
    }

    onProgress?.('Menemukan halaman di JDIHN...', 0, 0);

    let allDetailLinks: string[] = [];

    // Strategy 1: Use Firecrawl /map endpoint to discover URLs
    try {
        const mapResponse = await fetch('https://api.firecrawl.dev/v1/map', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url: 'https://jdihn.go.id',
                search: 'undang-undang peraturan',
                limit: 50,
            }),
        });

        if (mapResponse.ok) {
            const mapData = await mapResponse.json();
            if (mapData.success && mapData.links) {
                allDetailLinks = (mapData.links as string[]).filter((l: string) =>
                    l.includes('jdihn.go.id') &&
                    !l.endsWith('jdihn.go.id/') &&
                    !l.endsWith('jdihn.go.id') &&
                    !l.includes('#') && !l.includes('javascript')
                );
            }
        }
    } catch (e) {
        console.warn('Map endpoint failed:', e);
    }

    // Strategy 2: Fallback - scrape the homepage for links
    if (allDetailLinks.length === 0) {
        onProgress?.('Map gagal, mencoba scrape homepage...', 0, 0);
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({ url: 'https://jdihn.go.id', formats: ['links', 'markdown'] }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                const links = (data.data?.links || []) as string[];
                allDetailLinks = links.filter((l: string) =>
                    l.includes('jdihn.go.id') &&
                    !l.endsWith('jdihn.go.id/') &&
                    !l.endsWith('jdihn.go.id') &&
                    !l.includes('#') && !l.includes('javascript') && !l.includes('mailto')
                );
            }
        }
    }

    // Deduplicate and limit
    allDetailLinks = [...new Set(allDetailLinks)].slice(0, maxResults);

    if (allDetailLinks.length === 0) {
        throw new Error('Tidak ditemukan link detail peraturan di JDIHN. Situs ini menggunakan JavaScript rendering yang membatasi scraping.');
    }

    // Check existing
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

    // Index
    for (let i = 0; i < newLinks.length; i++) {
        const url = newLinks[i];
        onProgress?.(`Scraping JDIH ${i + 1}/${newLinks.length}...`, i + 1, newLinks.length);

        try {
            await scrapeAndIndexURL(url);
            indexed++;
        } catch (err) {
            console.error(`Failed to scrape ${url}:`, err);
            errors++;
        }

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

/**
 * Auto-crawl: Discover putusan (court decisions) from hukumonline.com
 */
export async function crawlHukumOnline(
    maxResults: number = 20,
    onProgress?: (status: string, current: number, total: number) => void
): Promise<{ discovered: number; indexed: number; skipped: number; errors: number }> {
    if (!FIRECRAWL_API_KEY) {
        throw new Error('Firecrawl API Key belum dikonfigurasi');
    }

    onProgress?.('Menemukan putusan di HukumOnline...', 0, 0);

    let allDetailLinks: string[] = [];

    // Use Firecrawl /map to discover putusan URLs
    try {
        const mapResponse = await fetch('https://api.firecrawl.dev/v1/map', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url: 'https://www.hukumonline.com/pusatdata/putusan',
                search: 'putusan pengadilan',
                limit: 100,
            }),
        });

        if (mapResponse.ok) {
            const mapData = await mapResponse.json();
            if (mapData.success && mapData.links) {
                allDetailLinks = (mapData.links as string[]).filter((l: string) =>
                    l.includes('hukumonline.com/pusatdata/') &&
                    l.split('/').length > 5 &&
                    !l.includes('#') && !l.includes('?') &&
                    !l.endsWith('/pusatdata/') &&
                    !l.endsWith('/putusan') &&
                    !l.endsWith('/putusan/')
                );
            }
        }
    } catch (e) {
        console.warn('Map endpoint failed for HukumOnline:', e);
    }

    // Fallback: try scraping the putusan listing page
    if (allDetailLinks.length === 0) {
        onProgress?.('Map gagal, mencoba scrape listing...', 0, 0);
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({ url: 'https://www.hukumonline.com/pusatdata/putusan', formats: ['links'] }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                const links = (data.data?.links || []) as string[];
                allDetailLinks = links.filter((l: string) =>
                    l.includes('hukumonline.com/pusatdata/') &&
                    l.split('/').length > 5 &&
                    !l.includes('#') && !l.includes('javascript')
                );
            }
        }
    }

    allDetailLinks = [...new Set(allDetailLinks)].slice(0, maxResults);

    if (allDetailLinks.length === 0) {
        throw new Error('Tidak ditemukan link putusan di HukumOnline. Coba gunakan Tambah URL manual.');
    }

    // Check existing
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

    for (let i = 0; i < newLinks.length; i++) {
        const url = newLinks[i];
        onProgress?.(`Scraping putusan ${i + 1}/${newLinks.length}...`, i + 1, newLinks.length);

        try {
            await scrapeAndIndexURL(url);
            indexed++;
        } catch (err) {
            console.error(`Failed to scrape ${url}:`, err);
            errors++;
        }

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

