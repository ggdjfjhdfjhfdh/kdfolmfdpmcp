import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sesecpro - Advanced Cybersecurity Solutions',
  description: 'Your cybersecurity partner. Advanced, simple, and business-adapted solutions. Real security with cutting-edge technology.',
  icons: {
    icon: '/favicon.ico',
    // También puedes añadir versiones en diferentes tamaños
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  // Configuración para redes sociales
  openGraph: {
    title: 'Sesecpro - Advanced Cybersecurity Solutions',
    description: 'Your cybersecurity partner. Advanced, simple, and business-adapted solutions.',
    url: 'https://sesecpro.es',
    siteName: 'Sesecpro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sesecpro Cybersecurity',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Configuración para Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Sesecpro - Advanced Cybersecurity Solutions',
    description: 'Your cybersecurity partner. Advanced, simple, and business-adapted solutions.',
    images: ['/twitter-image.png'],
  },
}
