/**
 * Test Script: Firecrawl + peraturan.go.id
 * Jalankan: npx tsx scripts/test-firecrawl.ts
 */

const FIRECRAWL_API_KEY = 'fc-1f61841a81ff4125a66965cefd6f6c47';
const FIRECRAWL_URL = 'https://api.firecrawl.dev/v1/scrape';

async function testScrape() {
    console.log('🔥 Testing Firecrawl on peraturan.go.id...\n');

    try {
        // Test 1: Scrape halaman utama
        console.log('📄 Test 1: Scraping halaman utama...');
        const response = await fetch(FIRECRAWL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url: 'https://peraturan.go.id/',
                formats: ['markdown'],
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error(`❌ HTTP ${response.status}: ${err}`);
            return;
        }

        const data = await response.json();

        if (data.success) {
            console.log('✅ Berhasil scrape halaman utama!');
            console.log(`   - Judul: ${data.data?.metadata?.title || 'N/A'}`);
            console.log(`   - Panjang konten: ${data.data?.markdown?.length || 0} karakter`);
            console.log(`   - Preview (500 char pertama):\n`);
            console.log(data.data?.markdown?.slice(0, 500));
            console.log('\n---\n');
        } else {
            console.error('❌ Gagal:', data);
            return;
        }

        // Test 2: Scrape salah satu halaman peraturan (contoh UU)
        console.log('📄 Test 2: Scraping halaman daftar peraturan...');
        const response2 = await fetch(FIRECRAWL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            },
            body: JSON.stringify({
                url: 'https://peraturan.go.id/peraturan/index?page=1',
                formats: ['markdown'],
            }),
        });

        if (!response2.ok) {
            const err = await response2.text();
            console.error(`❌ HTTP ${response2.status}: ${err}`);
            return;
        }

        const data2 = await response2.json();

        if (data2.success) {
            console.log('✅ Berhasil scrape halaman daftar!');
            console.log(`   - Judul: ${data2.data?.metadata?.title || 'N/A'}`);
            console.log(`   - Panjang konten: ${data2.data?.markdown?.length || 0} karakter`);
            console.log(`   - Preview (500 char pertama):\n`);
            console.log(data2.data?.markdown?.slice(0, 500));
        } else {
            console.error('❌ Gagal:', data2);
        }

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testScrape();
