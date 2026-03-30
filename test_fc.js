import fs from 'fs/promises';

async function test() {
    const env = await fs.readFile('.env.local', 'utf8');
    const key = env.split('\n').find(l => l.startsWith('VITE_FIRECRAWL_API_KEY=')).split('=')[1].trim();
    
    const url = 'https://jdihn.go.id/index.php/file/download?id_dokumen=328700386&id_anggota=2098';
    console.log('Fetching PDF via Firecrawl...', url);
    const pdfResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
            url: url,
            formats: ['markdown'],
        }),
    });

    if (pdfResponse.ok) {
        const pdfData = await pdfResponse.json();
        console.log('Success!', pdfData.data?.markdown?.slice(0, 500));
    } else {
        console.error('Failed:', await pdfResponse.text());
    }
}
test();
