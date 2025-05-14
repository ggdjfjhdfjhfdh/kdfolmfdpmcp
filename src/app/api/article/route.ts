import { NextResponse } from 'next/server';

const articles = [
  {
    title: 'Ejemplo de artículo',
    content: '<p>Este es un artículo de ejemplo con contenido en HTML</p>',
    author: 'Redacción',
    publishedAt: new Date().toISOString(),
    description: 'Descripción de ejemplo'
  }
  // Agrega más artículos según sea necesario
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  
  if (!title) {
    return NextResponse.json(
      { error: 'El parámetro title es requerido' },
      { status: 400 }
    );
  }

  // Buscar el artículo por título
  const article = articles.find(art => 
    art.title.toLowerCase() === decodeURIComponent(title).toLowerCase()
  );

  if (!article) {
    return NextResponse.json(
      { error: 'Artículo no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}
