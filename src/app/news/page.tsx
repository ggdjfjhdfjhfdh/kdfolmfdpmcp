"use client";

import NewsCard from '@/components/NewsCard';
import NewsSidebar from '@/components/NewsSidebar';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useI18n } from '@/lib/i18n';

interface NewsItem {
  title: string;
  rewrittenTitle?: string;
  link: string;
  source?: string;
  date: string;
  description: string;
  content: string;
  category?: string;
  dateIso?: string | null;
}

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NewsPage() {
  const t = useI18n();
  const { lang } = useLanguage();

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [originalNews, setOriginalNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [translating, setTranslating] = useState<boolean>(false);
  const NEWS_PER_PAGE = 8;

  async function translateText(text: string, targetLang = 'en'): Promise<string> {
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source: 'es', target: targetLang, format: 'text' }),
      });
      const data = await res.json();
      return data.translatedText || text;
    } catch {
      return text;
    }
  }

  // Fetch news on mount
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news', { next: { revalidate: 900 } });
        if (!response.ok) throw new Error('Error al obtener noticias');
        const { news: dataNews } = await response.json();
        const newsWithIso = dataNews.map((item: any) => {
          if (!item.date) return { ...item, dateIso: null };
          const [d, m, y] = item.date.split('/');
          const day = d?.padStart(2, '0');
          const month = m?.padStart(2, '0');
          return { ...item, dateIso: y && month && day ? `${y}-${month}-${day}` : null };
        });
        setNews(newsWithIso);
        setOriginalNews(newsWithIso);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // Auto-translate effect
  useEffect(() => {
    let cancelled = false;
    async function translateAllNews() {
      setTranslating(true);
      try {
        const translated = await Promise.all(
          originalNews.map(async (item) => {
            const [title, description, content] = await Promise.all([
              translateText(item.title),
              translateText(item.description),
              translateText(item.content),
            ]);
            return { ...item, title, description, content };
          })
        );
        if (!cancelled) setNews(translated);
      } finally {
        if (!cancelled) setTranslating(false);
      }
    }
    if (lang === 'EN' && originalNews.length > 0) {
      translateAllNews();
    } else if (lang === 'ES') {
      setNews(originalNews);
      setTranslating(false);
    }
    return () => { cancelled = true; };
  }, [lang, originalNews]);

  const filteredNews = news.filter((item) => {
    if (!item.dateIso) return false;
    const matchesCategory = selectedCategory
      ? (item.category || 'otros').toLowerCase() === selectedCategory
      : true;
    const fromOk = dateFrom ? item.dateIso >= dateFrom : true;
    const toOk = dateTo ? item.dateIso <= dateTo : true;
    return matchesCategory && fromOk && toOk;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, selectedCategory]);

  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {[...Array(NEWS_PER_PAGE)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 rounded-xl shadow h-48 md:h-56 w-full"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start bg-white min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <NewsSidebar
        news={news}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
      />
      <main className="flex-1 p-2 sm:p-4 md:p-8 lg:p-12 bg-white w-full">
        <div className="relative w-full h-40 sm:h-48 md:h-64 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-8">
          <img src="/news-bg.png" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm z-10" aria-hidden="true"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
            <h1 className="text-blue-200 text-2xl md:text-4xl font-extrabold drop-shadow-lg mb-2">{t('latestNews')}</h1>
            <p className="text-white text-base md:text-lg font-light drop-shadow-md max-w-2xl mx-auto">{t('newsHeroSubtitle')}</p>
          </div>
        </div>

        {/* Mobile filter */}
        <div className="block md:hidden w-full bg-white border border-gray-200 rounded-xl shadow px-4 py-5 mb-6">
          <span className="text-base font-semibold text-gray-700 mb-2">
            {t('filterByCategory')}
          </span>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 -mx-2 px-2 py-1">
            <button
              className={`px-4 py-2 rounded-full text-base font-semibold border transition-all duration-150 whitespace-nowrap shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${selectedCategory === '' ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
              onClick={() => setSelectedCategory('')}
              aria-pressed={selectedCategory === ''}
              style={{ minWidth: 90 }}
            >
              {t('all')}
            </button>
            {Array.from(new Set(news.map(n => (n.category || 'otros').toLowerCase())))
              .sort((a, b) => (a === 'otros' ? 1 : b === 'otros' ? -1 : a.localeCompare(b, 'es')))
              .map(cat => {
                const displayMap: Record<string, { label: string }> = {
                  'malware': { label: t('malware') },
                  'vulnerabilidades': { label: t('vulnerabilities') },
                  'ataques': { label: t('attacks') },
                  'brechas de datos': { label: t('dataBreaches') },
                  'regulación': { label: t('regulation') },
                  'infraestructura crítica': { label: t('criticalInfrastructure') },
                  'empresas': { label: t('companies') },
                  'tecnología': { label: t('technology') },
                  'educación': { label: t('education') },
                  'otros': { label: t('others') }
                };
                const display = displayMap[cat as keyof typeof displayMap] || { label: cat.charAt(0).toUpperCase() + cat.slice(1) };
                const selected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full text-base font-semibold border transition-all duration-150 whitespace-nowrap shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${selected ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selected}
                    style={{ minWidth: 90 }}
                  >
                    {display.label}
                  </button>
                );
              })}
          </div>
        </div>

        {translating && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-500 animate-pulse">
              {t('translating')}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              {t('noNews')}
            </div>
          ) : (
            paginatedNews.map((item) => (
              <NewsCard
                key={item.link}
                title={item.title}
                rewrittenTitle={item.rewrittenTitle}
                category={item.category}
                date={item.date}
                description={item.description}
                content={item.content}
                url={item.link}
                slug={slugify(item.title)}
              />
            ))
          )}
        </div>

        <div className="w-full flex justify-center mt-10">
          <nav className="flex flex-col items-center w-auto" aria-label="Paginación de noticias">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold shadow transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                <span className="hidden sm:inline">{t('previous')}</span>
              </button>
              <span className="flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-800 font-bold text-base shadow-sm">
                {t('page')} <span className="mx-1 text-blue-900 text-lg">{currentPage}</span> {t('of')} {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold shadow transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-100"
              >
                <span className="hidden sm:inline">{t('next')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </nav>
        </div>
      </main>
    </div>
  );
}
