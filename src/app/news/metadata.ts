import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cybersecurity News & Updates',
  description: 'Stay informed with the latest cybersecurity news, threats, vulnerabilities, and industry updates. Expert analysis and daily updates on cyber threats.',
  keywords: ['cybersecurity news', 'security updates', 'cyber threats', 'data breaches', 'vulnerability alerts', 'security incidents', 'cyber attacks', 'information security news'],
  openGraph: {
    title: 'Cybersecurity News & Updates | Sesecpro',
    description: 'Stay informed with the latest cybersecurity news, threats, vulnerabilities, and industry updates.',
    type: 'website',
    url: 'https://sesecpro.es/news',
    images: [
      {
        url: '/news-og.png',
        width: 1200,
        height: 630,
        alt: 'Sesecpro Cybersecurity News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cybersecurity News & Updates | Sesecpro',
    description: 'Stay informed with the latest cybersecurity news and updates.',
    images: ['/news-twitter.png'],
  },
}
