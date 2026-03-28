import { useState, useEffect } from 'react';
import { Bookmark, Loader2, AlertCircle, Newspaper } from 'lucide-react';
import ArticleCard from '../components/workspace/ArticleCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Link } from 'react-router-dom';

export default function Bookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookmarks() {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Fetch Article Bookmarks from DB
        const { data: articleData, error: articleError } = await supabase
          .from('bookmarks')
          .select(`
            id,
            created_at,
            articles (
              id,
              title,
              snippet,
              category,
              author,
              image_url,
              tags,
              created_at
            )
          `)
          .eq('user_id', user.id);

        if (articleError) throw articleError;

        // 2. Fetch Investigation Bookmarks from localStorage
        const invIds = JSON.parse(localStorage.getItem('inv_bookmarks') || '[]');
        let invData: any[] = [];
        if (invIds.length > 0) {
          const { data: investigations, error: invError } = await supabase
            .from('investigations')
            .select('*')
            .in('id', invIds);

          if (!invError && investigations) {
            invData = investigations.map(inv => ({
              id: `inv-${inv.id}`,
              created_at: inv.created_at, // Use creation date as fallback for bookmark date
              isInvestigation: true,
              data: inv
            }));
          }
        }

        // 3. Combine and Sort
        const combined = [
          ...(articleData || []).map(b => ({ ...b, isInvestigation: false })),
          ...invData
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setBookmarks(combined);
      } catch (err: any) {
        console.error('Error fetching bookmarks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-bold text-[#8899AA]">Memuat bookmark...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">
            <Bookmark className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-dark relative inline-block">
            Bookmark Saya
            <div className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-primary"></div>
          </h1>
        </div>
        <p className="text-text-medium text-lg mt-6">Kumpulan artikel dan investigasi yang Anda simpan untuk dibaca nanti.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-off-white border-2 border-dashed border-blue-gray/50 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-blue-gray/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-8 h-8 text-text-light" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">Belum Ada Bookmark</h3>
          <p className="text-text-medium mb-8">Anda belum menyimpan artikel atau investigasi apapun. Telusuri berita terbaru dan simpan yang menarik bagi Anda.</p>
          <Link to="/workspace" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors inline-block">
            Mulai Menjelajah
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {bookmarks.map((bookmark) => {
            if (bookmark.isInvestigation) {
              const inv = bookmark.data;
              return (
                <Link
                  key={bookmark.id}
                  to={`/workspace/investigasi/${inv.id}`}
                  className="bg-white rounded-2xl border border-blue-gray/30 overflow-hidden hover:shadow-lg transition-shadow group flex flex-row p-4 sm:p-6 min-w-0"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-[75px] lg:w-32 lg:h-[90px] rounded-lg relative overflow-hidden shrink-0">
                    <img
                      src={inv.image_url || `https://picsum.photos/seed/${inv.id}/300/200`}
                      alt={inv.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 pl-4 sm:pl-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#E31B23] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          INVESTIGASI
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base lg:text-lg font-heading font-bold text-dark leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {inv.title}
                      </h2>
                    </div>
                    <div className="text-xs sm:text-sm text-text-light font-medium mt-2">
                      {inv.journalist || 'Tim Redaksi'} • Disimpan {new Date(bookmark.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </Link>
              );
            }

            const article = bookmark.articles;
            if (!article) return null;

            return (
              <ArticleCard
                key={bookmark.id}
                id={article.id}
                title={article.title}
                snippet={article.snippet}
                rubrik={article.category.toLowerCase() as any}
                author={article.author}
                time={`Disimpan ${new Date(bookmark.created_at).toLocaleDateString('id-ID')}`}
                imageUrl={article.image_url}
                tags={article.tags || []}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
