import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Tipos
type NewsItem = {
  title: string;
  rewrittenTitle: string;
  link: string;
  source: string;
  date: string;
  description?: string;
  content?: string;
};

type CachedArticle = {
  title: string;
  content: string;
  date: string;
  source: string;
  link: string;
  description: string;
  rewrittenTitle: string;
  category: string;
  publishedAt?: string;
};

// Asigna una categoría general y excluyente a una noticia
function getCategoryForArticle(article: { title: string; description?: string; content?: string; }): string {
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  if (/malware|virus|gusano|troyano|spyware|adware|rootkit|botnet/.test(text)) return 'Malware';
  if (/vulnerabilidad|cve-|zero[- ]day|exploit|parche|patch|fallo de seguridad|bug/.test(text)) return 'Vulnerabilidades';
  if (/ataque|ransomware|phishing|ddos|suplantaci[oó]n|hackeo|ciberataque|intrusi[oó]n/.test(text)) return 'Ataques';
  if (/brecha de datos|filtraci[oó]n|exposici[oó]n de datos|leak|data breach/.test(text)) return 'Brechas de datos';
  if (/regulaci[oó]n|gdpr|ley|normativa|compliance|protecci[oó]n de datos/.test(text)) return 'Regulación';
  if (/infraestructura cr[ií]tica|energ[ií]a|agua|transporte|sanidad|hospital|eléctrica|eléctrico/.test(text)) return 'Infraestructura crítica';
  if (/empresa|compañ[ií]a|corporativo|negocio|sector privado|empleado/.test(text)) return 'Empresas';
  if (/tecnolog[ií]a|innovaci[oó]n|software|hardware|sistema|plataforma|aplicaci[oó]n/.test(text)) return 'Tecnología';
  if (/educaci[oó]n|concienciaci[oó]n|formaci[oó]n|curso|capacitaci[oó]n/.test(text)) return 'Educación';
  return 'Otros';
}


// Configuración
const newsApiKey = process.env.NEWS_API_KEY; // Kept for reference, but not used if SerpApi is primary
const serpApiKey = process.env.SERP_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

// Control de tasa
const MAX_CONCURRENT_REQUESTS = 2;
const REQUEST_INTERVAL_MS = 1000;
let activeRequests = 0;
let lastRequestTime = 0;

// Caché
const CACHE_PATH = path.join(process.cwd(), '.cache', 'news_cache.json');
console.log("Resolved CACHE_PATH:", CACHE_PATH);
let newsCache: { generated: CachedArticle[]; lastUpdated: string } = {
  generated: [],
  lastUpdated: new Date().toISOString()
};
// Precargar el caché desde .cache/news_cache.json al arrancar el servidor
try {
  const cacheDir = path.join(process.cwd(), '.cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
    console.log('[news] Carpeta .cache creada.');
  }
  if (fs.existsSync(CACHE_PATH)) {
    const cacheRaw = fs.readFileSync(CACHE_PATH, 'utf-8');
    const cacheData = JSON.parse(cacheRaw);
    if (cacheData && Array.isArray(cacheData.generated)) {
      newsCache = cacheData;
      console.log(`[news] Cache precargado con ${newsCache.generated.length} noticias desde .cache/news_cache.json.`);
    }
  }
} catch (err) {
  console.warn('[news] No se pudo precargar el caché de noticias:', err);
}


// Helpers
async function throttledOpenAIRequest(messages: any[]) {
  while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < REQUEST_INTERVAL_MS) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL_MS - timeSinceLast));
  }

  activeRequests++;
  lastRequestTime = Date.now();

  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });
    
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        return await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.7,
          max_tokens: 1000
        });
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  } finally {
    activeRequests--;
  }
}

function cleanContent(content: string): string {
  return content.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

// Función para normalizar títulos (eliminar caracteres especiales, espacios extras)
const normalizeTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúüñ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizePath = (path: string) => {
  return path.replace(/^\/+|\/+$/g, '').toLowerCase();
};

async function fetchNewsFromSerpApi(): Promise<any[]> {
  if (!serpApiKey) {
    console.error('SERP_API_KEY is not configured in .env file.');
    throw new Error('SERP_API_KEY is not configured.');
  }

  const query = `"ciberataque" OR "ataque informático" OR "brecha de datos" OR "vulnerabilidad crítica" OR "exploit" OR "zero-day" OR "CVE" OR "APT" OR "amenaza persistente" OR "phishing" OR "malware" OR "spyware" OR "rootkit" OR "troyano" OR "software malicioso" OR "ataque DDoS" OR "intrusión" OR "ingeniería social" OR "campaña de ciberataques" OR "incidente de seguridad" OR "grupo de amenaza" OR "actor malicioso" OR "ciberespionaje" OR "ciberterrorismo" OR "ciberguerra" OR "cyberattack" OR "data breach" OR "security incident" -curso -formación -aprende -tutorial -producto -comprar -tienda -oferta -descuento -publicidad -anuncio -reviews -opiniones -análisis -promoción -seminario -certificación -ebook -libro -podcast -evento -guía -manual`;
  
  const params = new URLSearchParams({
    engine: "google_news",
    q: query,
    hl: "es",
    gl: "ES",
    lr: "lang_es",
    api_key: serpApiKey,
    num: "70" // Fetching 70 articles
  });

  const url = `https://serpapi.com/search.json?${params.toString()}`;
  console.log('DEBUG: Fetching SerpApi Google News with URL:', url);

  try {
    const response = await fetch(url);
    console.log('DEBUG: SerpApi response status:', response.status, response.statusText);
    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = `Error fetching news from SerpApi: ${response.status} ${response.statusText}. Body: ${errorBody}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    // console.log('DEBUG: Raw data from SerpApi:', JSON.stringify(data, null, 2)); // Optional: log full raw data

    if (data.error) {
      const errorMessage = `SerpApi error: ${data.error}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const articles = data.news_results || [];
    console.log(`Fetched ${articles.length} articles from SerpApi (Google News) for query.`);
    
    return articles.map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.snippet, // SerpApi calls it snippet
      publishedAt: item.date,    // SerpApi provides a string like "2 days ago"
      source: String(item.source) || 'Desconocido', // Directly use the source string from SerpApi
      imageUrl: item.thumbnail // Keep original image url if available
    }));

  } catch (error: any) {
    const errorMessage = `Failed to fetch or process news from SerpApi: ${error.message}`;
    console.error(errorMessage, error);
    throw new Error(errorMessage); // Re-throw after logging
  }
}

async function fetchNewsFromAPI(): Promise<any[]> {
  if (!newsApiKey) {
    console.error('News API key is not configured.');
    throw new Error('News API key is not configured.');
  }

  const query = '("ciberataque" OR "brecha de datos" OR "ransomware" OR "vulnerabilidad" OR "APT" OR "malware" OR "phishing" OR "incidente seguridad") NOT (curso OR aprende OR guía OR tutorial OR oferta OR promoción OR evento OR review OR opinión)'; // Adapted from user's Google News query for NewsAPI
  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}&language=es&sortBy=publishedAt`;
  console.log('DEBUG: Fetching NewsAPI with URL:', url); // DEBUG LOG

  try {
    const response = await fetch(url);
    console.log('DEBUG: NewsAPI response status:', response.status, response.statusText); // DEBUG LOG
    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = `Error fetching news from API: ${response.status} ${response.statusText}. Body: ${errorBody}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log('DEBUG: Raw data from NewsAPI:', JSON.stringify(data, null, 2)); // DEBUG LOG
    if (data.status === 'error') {
      const errorMessage = `NewsAPI error: ${data.code} - ${data.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    console.log(`Fetched ${data.articles?.length || 0} articles from NewsAPI for query: ${query}`);
    return data.articles || [];
  } catch (error: any) { // Catching 'any' to re-throw with more specific message if needed
    const errorMessage = `Failed to fetch news from API: ${error.message}`;
    console.error(errorMessage, error);
    throw new Error(errorMessage); // Re-throw after logging
  }
}

// Al obtener noticias de NewsAPI, guardar en caché
async function cacheNewsArticles(articlesToProcess: any[]) {
  const newArticlesToCache: CachedArticle[] = [];
  console.log(`cacheNewsArticles received ${articlesToProcess.length} articles to potentially process.`);
  console.log('DEBUG cacheNewsArticles - First 2 articlesToProcess:', JSON.stringify(articlesToProcess.slice(0,2), null, 2));
  const articlesForOpenAI = articlesToProcess.slice(0, 10);
  const articlesToCacheDirectly = articlesToProcess.slice(10);
  let openAIProcessedCount = 0;

  console.log(`Will attempt OpenAI processing for ${articlesForOpenAI.length} articles.`);
  console.log(`Will attempt direct caching for ${articlesToCacheDirectly.length} articles.`);

  for (const article of articlesForOpenAI) {
    const normalizedApiTitle = normalizeTitle(article.title);
    if (newsCache.generated.some(cachedArticle => normalizeTitle(cachedArticle.title) === normalizedApiTitle)) {
      console.log(`Article "${article.title}" already in cache. Skipping OpenAI processing.`);
      continue; 
    }

    try {
      console.log(`Processing new article with OpenAI: "${article.title}"`);

      // 1. Rewrite Title
      const titleRewriteMessages = [
        { role: "system", content: "Eres un asistente de IA especializado en periodismo y titulares." },
        { role: "user", content: `Reescribe el siguiente titular de noticia para que sea más atractivo y conciso, manteniendo el significado original y el idioma: "${article.title}"` }
      ];
      const titleCompletion = await throttledOpenAIRequest(titleRewriteMessages);
      const rewrittenTitle = cleanContent(titleCompletion?.choices[0]?.message?.content?.trim() || article.title);
      console.log(`OpenAI - Rewritten Title for "${article.title}": "${rewrittenTitle}"`);

      // 2. Generate Summary and Content
      const summaryContentMessages = [
        { role: "system", content: "Eres un experto en ciberseguridad y redactor de contenido." },
        { role: "user", content: `Eres un experto en ciberseguridad. Dada la siguiente noticia (título y descripción originales), genera un resumen conciso (máximo 3-4 frases) para la clave 'rewritten_summary'. Luego, para la clave 'rewritten_content', genera un contenido ampliado y detallado (mínimo 300 palabras) que explique la noticia en profundidad, sus implicaciones y contexto. IMPORTANTE: El valor de 'rewritten_content' DEBE ser una cadena de texto que contenga HTML, con el contenido principal estructurado en párrafos usando etiquetas <p> (por ejemplo, "<p>Esto es un párrafo.</p><p>Esto es otro párrafo.</p>"). Devuelve toda la respuesta en un único objeto JSON con las claves 'rewritten_summary' y 'rewritten_content'. Título Original: ${article.title}. Descripción Original: ${article.description || 'No disponible'}.` }
      ];
      const summaryContentCompletion = await throttledOpenAIRequest(summaryContentMessages);
      const rawJsonString = summaryContentCompletion?.choices[0]?.message?.content?.trim();
      
      let rewrittenSummary = article.description || "Resumen no disponible.";
      let rewrittenContent = article.content && article.content.trim() !== ''
        ? article.content
        : (article.description && article.description.trim() !== '' ? article.description : "");

      if (rawJsonString) {
        try {
          const jsonMatch = rawJsonString.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
          const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : rawJsonString;
          
          const parsedContent = JSON.parse(jsonString);
          if (parsedContent.rewritten_summary && parsedContent.rewritten_summary.trim() !== "") {
            rewrittenSummary = cleanContent(parsedContent.rewritten_summary);
          }
          if (parsedContent.rewritten_content && parsedContent.rewritten_content.trim() !== "") {
            rewrittenContent = cleanContent(parsedContent.rewritten_content);
          } else {
            console.warn(`OpenAI - rewritten_content vacío para "${article.title}". Usando texto original disponible.`);
          }
          console.log(`OpenAI - Summary/Content parsed para "${article.title}"`);
        } catch (e: any) {
          console.error(`Error parsing OpenAI JSON response para summary/content de "${article.title}": ${e.message}. Raw response: ${rawJsonString}`);
          // Si hay error parseando, mantenemos el mejor texto original
        }
      } else {
         console.warn(`OpenAI - No content returned para summary/content de "${article.title}". Usando texto original disponible.`);
      }

      // Si tras todo esto el contenido sigue vacío, pon un aviso pero nunca 'Contenido no disponible' si hay texto original
      if (!rewrittenContent || rewrittenContent.trim() === "") {
        rewrittenContent = "Contenido completo no disponible.";
        console.warn(`Artículo "${article.title}" no tiene contenido disponible tras todos los intentos.`);
      }

      console.log(`DEBUG: Rewritten content final para "${article.title}":`, rewrittenContent);

      const processedArticle: CachedArticle = {
        title: article.title,
        rewrittenTitle: rewrittenTitle,
        link: article.url || article.link || '#',
        source: typeof article.source === 'string'
          ? article.source
          : (article.source?.name || article.source?.title || String(article.source) || 'Desconocido'),
        date: article.publishedAt || article.date || new Date().toISOString(),
        description: rewrittenSummary, 
        content: rewrittenContent,   
        category: getCategoryForArticle({
          title: article.title,
          description: rewrittenSummary,
          content: rewrittenContent
        })
      };
      // Solo cachear si el contenido es válido
      if (
        processedArticle.content &&
        processedArticle.content.length > 100 &&
        processedArticle.content.includes('<p>')
      ) {
        console.log('DEBUG cacheNewsArticles - processedArticle for OpenAI just before push:', JSON.stringify(processedArticle, null, 2));
        newArticlesToCache.push(processedArticle);
        console.log(`Article "${article.title}" processed with OpenAI and queued for cache.`);
        openAIProcessedCount++;
      } else {
        console.warn(`Descartado: "${processedArticle.title}" por no tener contenido reescrito válido tras OpenAI.`);
      }
    } catch (error: any) {
      console.error(`Failed to process article "${article.title}" with OpenAI: ${error.message}`, error);
      // Optionally, add to direct cache if OpenAI fails
      // newArticlesToCache.push({
      //   title: article.title,
      //   rewrittenTitle: article.title, // Use original title
      //   link: article.link || article.url || '#',
      //   source: article.source?.name || 'Desconocido',
      //   date: article.publishedAt || new Date().toISOString(),
      //   description: article.description || "Descripción no disponible.",
      //   content: article.description || "Contenido no disponible.", 
      // });
      // console.log(`Article "${article.title}" failed OpenAI processing, queued for direct cache.`);
    }
  }

  // Add articles that were designated for direct caching (beyond the first 4 new)
  for (const article of articlesToCacheDirectly) {
    console.log(`Directly caching article: "${article.title}"`);
    // Solo cachear directos si tienen content válido
    const directCacheArticle: CachedArticle = {
      title: article.title,
      rewrittenTitle: article.title, // Use original title
      link: article.link || article.url || '#',
      source: typeof article.source === 'string'
        ? article.source
        : (article.source?.name || article.source?.title || String(article.source) || 'Desconocido'),
      date: article.publishedAt || article.date || new Date().toISOString(),
      description: article.description || 'Descripción no disponible.',
      content: article.content && article.content.length > 100 && article.content.includes('<p>')
        ? article.content
        : '',
      category: getCategoryForArticle({
        title: article.title,
        description: article.description,
        content: article.content
      })
    };
    if (
      directCacheArticle.content &&
      directCacheArticle.content.length > 100 &&
      directCacheArticle.content.includes('<p>')
    ) {
      console.log('DEBUG cacheNewsArticles - directCacheArticle just before push:', JSON.stringify(directCacheArticle, null, 2));
      newArticlesToCache.push(directCacheArticle);
    } else {
      console.warn(`Direct cache descartado: "${article.title}" por no tener content válido.`);
    }
  }

  if (newArticlesToCache.length > 0) {
    newsCache.generated.unshift(...newArticlesToCache);
    // Ordenar por fecha descendente (más reciente primero)
    newsCache.generated.sort((a, b) => {
      // Intentar convertir a Date, si falla usar 0
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });
    newsCache.lastUpdated = new Date().toISOString();
    try {
      fs.writeFileSync(CACHE_PATH, JSON.stringify(newsCache, null, 2), 'utf-8');
      console.log(`Successfully wrote ${newArticlesToCache.length} newly processed articles to cache file: ${CACHE_PATH}`);
    } catch (error: any) {
      console.error(`Error writing updated cache to ${CACHE_PATH}: ${error.message}`, error);
    }
  } else {
    console.log("No new articles were processed and added to the cache (all might be duplicates or OpenAI processing failed for all).");
  }
}

// ...

export async function GET(request: Request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('accept') || '';
  const isHtmlRequest = acceptHeader.includes('text/html');
  const path = url.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (path === 'article' || path === 'api/news') {
    const { searchParams } = url;
    const title = searchParams.get('title');

    if (title) {
      try {
        const decodedTitle = decodeURIComponent(title).replace(/\+/g, ' ');
        const article = newsCache.generated.find(a => a.title === decodedTitle);

        if (!article) {
          return NextResponse.json(
            { error: 'Artículo no encontrado' }, 
            { status: 404 }
          );
        }

        if (isHtmlRequest) {
          return new Response(
            `<!DOCTYPE html>
            <html>
              <head><title>${article.title}</title></head>
              <body>
                <h1>${article.title}</h1>
                <p>${article.content}</p>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        }

        return NextResponse.json(article);
      } catch (error) {
        return NextResponse.json(
          { error: 'Error al procesar la solicitud' },
          { status: 400 }
        );
      }
    }

    // Return all news when no specific article is requested
    try {
      const now = Date.now();
      const cacheAge = now - new Date(newsCache.lastUpdated).getTime();

  let isCacheStale = cacheAge > CACHE_DURATION_MS || newsCache.generated.length === 0;
  console.log(`DEBUG: Initial isCacheStale: ${isCacheStale}, Cache Age: ${cacheAge}ms, Generated Length: ${newsCache.generated.length}`);
  const forceRefresh = true; // FORCE STALE FOR DEBUGGING
  if (forceRefresh) {
    isCacheStale = true;
    console.log(`DEBUG: Forcing cache refresh. isCacheStale is now: ${isCacheStale}`);
  }

  // If cache is NOT stale and client accepts JSON, serve from cache
  if (!isCacheStale && newsCache.generated.length > 0 && acceptHeader.includes('application/json')) {
        console.log('Serving news from fresh cache.');
        return NextResponse.json({ news: newsCache.generated, lastUpdated: newsCache.lastUpdated });
      }

      console.log('Cache is stale or empty, attempting to fetch fresh news.');
      const rawArticles = await fetchNewsFromSerpApi(); // This can now throw
      
      // If fetchNewsFromAPI was successful and returned articles
      if (rawArticles.length > 0) {
        const genuinelyNewArticles = rawArticles.filter(apiArticle => 
          !newsCache.generated.some(cachedArticle => 
            normalizeTitle(cachedArticle.title) === normalizeTitle(apiArticle.title)
          )
        );

        console.log(`Fetched ${rawArticles.length} articles from API. Found ${genuinelyNewArticles.length} genuinely new articles to process.`);

        if (genuinelyNewArticles.length > 0) {
          await cacheNewsArticles(genuinelyNewArticles);
          console.log('Finished processing and caching new articles.');
        } else {
          console.log('No genuinely new articles to process after filtering against cache.');
        }
      } else {
        console.log('No new articles found by API, serving from existing cache if available.');
      }
      console.log(`GET /api/news: Returning newsCache with ${newsCache.generated.length} articles. Last updated: ${newsCache.lastUpdated}`);
      // Solo noticias reescritas (las que tienen content largo y con <p>)
      // Filtrar solo noticias reescritas válidas
      let rewrittenNews = newsCache.generated.filter(
        n => typeof n.content === 'string' && n.content.length > 100 && n.content.includes('<p>')
      );
      // Ordenar por fecha descendente
      rewrittenNews = rewrittenNews.sort((a, b) => {
        const dateA = new Date(a.date || a.publishedAt || 0).getTime();
        const dateB = new Date(b.date || b.publishedAt || 0).getTime();
        return dateB - dateA;
      });
      // Eliminar duplicados por title o link
      const seen = new Set<string>();
      const uniqueNews = [];
      // Función para normalizar títulos
      function normalizeTitleForDedup(str: string): string {
        return (str || '')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
          .replace(/[^a-z0-9\s]/g, '') // solo letras y números
          .replace(/\b(el|la|los|las|un|una|unos|unas|de|del|en|por|para|con|y|o|que|a|ante|bajo|cabe|como|contra|desde|durante|entre|hacia|hasta|mediante|segun|sin|so|sobre|tras|versus|via)\b/g, '') // quita palabras vacías
          .replace(/\s+/g, ' ') // espacios simples
          .trim();
      }
      // Deduplicar por día y similitud de título
      const deduped: any[] = [];
      for (const n of rewrittenNews) {
        const nDate = (n.date || '').split('T')[0];
        const nNorm = normalizeTitleForDedup(n.title);
        // ¿Ya hay una noticia ese día con título muy similar?
        const isDuplicate = deduped.some(m => {
          const mDate = (m.date || '').split('T')[0];
          if (mDate !== nDate) return false;
          const mNorm = normalizeTitleForDedup(m.title);
          // Similitud: al menos 60% de palabras iguales
          const nWords = new Set(nNorm.split(' '));
          const mWords = new Set(mNorm.split(' '));
          const common = [...nWords].filter(w => mWords.has(w) && w.length > 3);
          const ratio = common.length / Math.max(nWords.size, 1);
          return ratio >= 0.6;
        });
        if (!isDuplicate) deduped.push(n);
        if (deduped.length >= 15) break;
      }
      return NextResponse.json({ news: deduped, lastUpdated: newsCache.lastUpdated });

    } catch (fetchError: any) {
      console.error(`Error during news fetch/cache process: ${fetchError.message}`, fetchError);
      if (newsCache.generated.length > 0) {
        console.warn('Serving stale news from cache due to API fetch error.');
        console.log(`GET /api/news (stale): Returning newsCache with ${newsCache.generated.length} articles. Last updated: ${newsCache.lastUpdated}`);
        return NextResponse.json({ news: newsCache.generated, lastUpdated: newsCache.lastUpdated }); // Serve stale cache
      } else {
        console.error('API fetch failed and cache is empty. Cannot serve news.');
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Could not fetch news.' },
          { status: 503 }
        );
      }
    }
  }

  return NextResponse.json(
    { error: 'Ruta no encontrada' },
    { status: 404 }
  );
}

export async function POST(request: Request) {
  let sampleNews: NewsItem[] = [];
  try {
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }

    const newArticle = {
      title,
      rewrittenTitle: '',
      link: `#${title.replace(/\s+/g, '-').toLowerCase()}`,
      source: "Generated Content",
      date: new Date().toISOString(),
      description,
      content: '<p>Contenido detallado sobre el artículo...</p>'
    };

    sampleNews.unshift(newArticle);

    return NextResponse.json(newArticle, { status: 201 });
    
  } catch (error) {
    console.error('Error en POST /api/news:', error);
    return NextResponse.json(
      {
        error: 'Error al generar artículo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
