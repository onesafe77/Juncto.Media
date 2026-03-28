import { useState, useEffect } from 'react';
import { Clock, Loader2, Newspaper } from 'lucide-react';
import ArticleCard from '../components/workspace/ArticleCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Link } from 'react-router-dom';

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error: supabaseError } = await supabase
          .from('reading_history')
          .select(`
            id,
            last_read_at,
            articles (
              id,
              title,
              snippet,
              category,
              author,
              image_url,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .order('last_read_at', { ascending: false })
          .limit(50);

        if (supabaseError) throw supabaseError;
        setHistory(data || []);
      } catch (err: any) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const isYesterday = (dateStr: string) => {
    const d = new Date(dateStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
  };

  const todayItems = history.filter(item => isToday(item.last_read_at));
  const yesterdayItems = history.filter(item => isYesterday(item.last_read_at));
  const olderItems = history.filter(item => !isToday(item.last_read_at) && !isYesterday(item.last_read_at));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-bold text-[#8899AA]">Memuat riwayat...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">
            <Clock className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark relative inline-block">
            Riwayat Baca
            <div className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-primary"></div>
          </h1>
        </div>
        <p className="text-text-medium text-lg mt-6">Daftar artikel yang baru saja Anda baca.</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-off-white border-2 border-dashed border-blue-gray/50 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-blue-gray/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-text-light" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">Belum Ada Riwayat</h3>
          <p className="text-text-medium mb-8">Anda belum membaca artikel apapun hari ini. Mulailah membaca untuk melihat riwayat Anda di sini.</p>
          <Link to="/workspace" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors inline-block">
            Mulai Membaca
          </Link>
        </div>
      ) : (
        <div className="space-y-10 max-w-4xl">
          {todayItems.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-dark mb-4 border-b border-blue-gray/20 pb-2">Hari Ini</h2>
              <div className="space-y-6">
                {todayItems.map(item => (
                  <ArticleCard
                    key={item.id}
                    id={item.articles.id}
                    title={item.articles.title}
                    snippet={item.articles.snippet}
                    rubrik={item.articles.category.toLowerCase() as any}
                    author={item.articles.author}
                    time={`Dibaca ${new Date(item.last_read_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
                    imageUrl={item.articles.image_url}
                    tags={item.articles.tags || []}
                  />
                ))}
              </div>
            </div>
          )}

          {yesterdayItems.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-dark mb-4 border-b border-blue-gray/20 pb-2">Kemarin</h2>
              <div className="space-y-6">
                {yesterdayItems.map(item => (
                  <ArticleCard
                    key={item.id}
                    id={item.articles.id}
                    title={item.articles.title}
                    snippet={item.articles.snippet}
                    rubrik={item.articles.category.toLowerCase() as any}
                    author={item.articles.author}
                    time="Dibaca kemarin"
                    imageUrl={item.articles.image_url}
                    tags={item.articles.tags || []}
                  />
                ))}
              </div>
            </div>
          )}

          {olderItems.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-dark mb-4 border-b border-blue-gray/20 pb-2">Sebelumnya</h2>
              <div className="space-y-6">
                {olderItems.map(item => (
                  <ArticleCard
                    key={item.id}
                    id={item.articles.id}
                    title={item.articles.title}
                    snippet={item.articles.snippet}
                    rubrik={item.articles.category.toLowerCase() as any}
                    author={item.articles.author}
                    time={`Dibaca ${new Date(item.last_read_at).toLocaleDateString('id-ID')}`}
                    imageUrl={item.articles.image_url}
                    tags={item.articles.tags || []}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
