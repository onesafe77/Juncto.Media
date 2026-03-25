const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `Kamu adalah Juncto AI Legal Assistant — asisten hukum digital berbahasa Indonesia.
Peranmu:
- Menganalisis pertanyaan hukum dan memberikan konteks hukum yang relevan.
- Menjelaskan pasal-pasal dari UU, KUHPerdata, KUHP, dan regulasi Indonesia lainnya.
- Memberikan panduan prosedural (bukan nasihat hukum resmi).
- Menjawab dalam Bahasa Indonesia yang jelas dan mudah dipahami.
- Selalu menyertakan disclaimer bahwa ini bukan nasihat hukum resmi.
Jangan pernah memberikan jawaban di luar konteks hukum Indonesia.`;

export interface AIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function askAI(messages: AIMessage[]): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        return 'API Key OpenRouter belum dikonfigurasi. Silakan tambahkan VITE_OPENROUTER_API_KEY di file .env.local Anda.';
    }

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Juncto.Media AI Legal Assistant',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memberikan respons saat ini.';
    } catch (error: any) {
        console.error('OpenRouter AI Error:', error);
        return `Terjadi kesalahan saat menghubungi AI: ${error.message}`;
    }
}
