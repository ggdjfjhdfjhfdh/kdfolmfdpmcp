"use client";

// Definimos el tipo de dato esperado para cada noticia
interface NewsItem {
  title: string;
  rewrittenTitle: string;
  link: string;
  source: string;
  date: string;
  description: string; // For card summary
  content: string;     // For full article page
}

// Función para obtener las noticias desde nuestra API
// Usamos revalidate: 0 para evitar el caché y obtener noticias frescas en cada carga (esto puede tener coste)
// En producción, podrías querer un valor de revalidate más alto (ej. 3600 para 1 hora)
async function fetchNews(): Promise<{ news: NewsItem[] } | { error: string }> {
  try {
    // IMPORTANTE: En el servidor, necesitamos la URL completa.
    // Usamos localhost durante el desarrollo. En producción, esto debería ser la URL pública de tu app.
    const apiUrl = process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/news`
      : 'http://localhost:3000/api/news';

    console.log(`Fetching news from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, { 
      cache: 'no-store', // Bypass cache for this fetch
      // next: { 
      //   revalidate: 86400, // 24 horas de caché
      //   tags: ['news'] 
      // } 
    });

    if (!response.ok) {
      // Intentar leer el cuerpo del error si es posible
      let errorBody = 'Error desconocido';
      try {
        errorBody = await response.json();
      } catch { /* Ignorar si el cuerpo no es JSON */ }
      console.error(`Error fetching news: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('News fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido al obtener noticias';
    return { error: message };
  }
}

// Componente principal

import NewsCard from '@/components/NewsCard';
import NewsSidebar from '@/components/NewsSidebar';
import { useState, useEffect } from 'react';

// Utilidad para generar slug
function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Elimina acentos
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NewsPage() {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [news, setNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const NEWS_PER_PAGE = 8;

  useEffect(() => {
    async function fetchNews() {
      try {
        const apiUrl = process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/news`
          : 'http://localhost:3000/api/news';
        const response = await fetch(apiUrl, { next: { revalidate: 900 } }); // 15 minutos de caché
        if (!response.ok) throw new Error('Error al obtener noticias');
        const data = await response.json();
        // Normaliza fechas al cargar
        const newsWithIso = (data.news || []).map((item: any) => {
          if (!item.date) return { ...item, dateIso: null };
          const [d, m, y] = item.date.split('/');
          if (!d || !m || !y) return { ...item, dateIso: null };
          const day = d.padStart(2, '0');
          const month = m.padStart(2, '0');
          return { ...item, dateIso: `${y}-${month}-${day}` };
        });
        setNews(newsWithIso);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory ? (item.category || 'otros').toLowerCase() === selectedCategory : true;
    // Usa la fecha normalizada
    if (!item.dateIso) return false;
    let fromOk = true;
    let toOk = true;
    if (dateFrom) {
      fromOk = item.dateIso >= dateFrom;
    }
    if (dateTo) {
      toOk = item.dateIso <= dateTo;
    }
    return matchesCategory && fromOk && toOk;
  });

  // Reiniciar paginación si cambia el filtro
  useEffect(() => { setCurrentPage(1); }, [dateFrom, dateTo, selectedCategory]);

  // PAGINACIÓN
  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);
  const paginatedNews = filteredNews.slice((currentPage - 1) * NEWS_PER_PAGE, currentPage * NEWS_PER_PAGE);


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {[...Array(NEWS_PER_PAGE)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl shadow h-48 md:h-56 w-full" />
        ))}
      </div>
    );
  }
  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-start bg-white min-h-screen w-full">
      {/* Desktop: barra lateral fija */}
      <NewsSidebar
        news={news}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
      />
      <main className="flex-1 p-4 md:p-8 lg:p-12 bg-white">
        {/* Cabecera visual con fondo */}
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8">
          <img
            src="/news-bg.png"
            alt="Fondo sección noticias"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent" />
          <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold text-gray-800 px-6 pt-12 flex items-center justify-center text-center h-full">Noticias y Actualidad</h1>
        </div>
        {/* Filtro de fecha solo en móvil */}
        {/* Filtro de fecha en móvil */}
        <div className="block md:hidden w-full bg-white border border-gray-200 rounded-xl shadow px-4 py-5 mb-4">
          <span className="text-base font-semibold text-gray-700 mb-2">Filtrar por fecha</span>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            Desde:
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              max={dateTo || undefined}
            />
          </label>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            Hasta:
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              min={dateFrom || undefined}
            />
          </label>
        </div>
        {/* Filtro de categoría en móvil */}
        <div className="block md:hidden w-full bg-white border border-gray-200 rounded-xl shadow px-4 py-5 mb-6">
          <span className="text-base font-semibold text-gray-700 mb-2">Filtrar por categoría</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 -mx-2 px-2 py-1">
            <button
              className={`px-4 py-2 rounded-full text-base font-semibold border transition-all duration-150 whitespace-nowrap shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${selectedCategory === '' ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
              onClick={() => setSelectedCategory('')}
              aria-pressed={selectedCategory === ''}
              style={{ minWidth: 90 }}
            >
              Todas
            </button>
            {Array.from(new Set(news.map(n => (n.category || 'otros').toLowerCase())))
              .sort((a, b) => (a === 'otros' ? 1 : b === 'otros' ? -1 : a.localeCompare(b, 'es')))
              .map(cat => {
                const displayMap: Record<string, { label: string }> = {
                  'malware': { label: 'Malware' },
                  'vulnerabilidades': { label: 'Vulnerabilidades' },
                  'ataques': { label: 'Ataques' },
                  'brechas de datos': { label: 'Brechas de datos' },
                  'regulación': { label: 'Regulación' },
                  'infraestructura crítica': { label: 'Infraestructura crítica' },
                  'empresas': { label: 'Empresas' },
                  'tecnología': { label: 'Tecnología' },
                  'educación': { label: 'Educación' },
                  'otros': { label: 'Otros' }
                };
                const display = displayMap[cat as keyof typeof displayMap] || { label: cat };
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
        {/* Listado de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No se encontraron noticias.</div>
          ) : (
            paginatedNews.map((item, i) => (
              <NewsCard
                key={item.link || i}
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
      </main>
    </div>
  );
}
