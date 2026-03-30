const fs = require('fs');
const url = 'https://jdihn.go.id/index.php/file/download?id_dokumen=328700386&id_anggota=2098';

async function test() {
    console.log('Fetching PDF...');
    const env = fs.readFileSync('.env.local', 'utf8');
    const key = env.split('\n').find(l => l.startsWith('VITE_FIRECRAWL_API_KEY=')).split('=')[1].trim();
    
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({ url: url, formats: ['markdown'] })
    });
    const data = await res.json();
    console.log(data);
}
test();
