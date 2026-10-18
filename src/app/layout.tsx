import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Satvik Caters and Events',
  description: 'A premium catering and food ordering website with real-time order tracking, event planning, payment simulation, and a dedicated AI culinary helper.',
  metadataBase: new URL('https://satvikcatersandevents.com'),
  alternates: {
    canonical: 'https://satvikcatersandevents.com/',
  },
  openGraph: {
    title: 'Satvik Caters and Events',
    description: 'A premium catering and food ordering website with real-time order tracking, event planning, payment simulation, and a dedicated AI culinary helper.',
    url: 'https://satvikcatersandevents.com/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satvik Caters and Events',
    description: 'Pure traditional Indian vegetarian cuisine and luxury catering for weddings, satsangs, and sacred celebrations.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Satvik Caters and Events',
  description: 'Pure vegetarian luxury catering and dining services for celebrations, corporate meets, and sacred rituals.',
  url: 'https://satvikcatersandevents.com',
  servesCuisine: 'Indian, Satvik, Jain',
  priceRange: '₹₹',
  openingHours: 'Mo-Su 07:00-23:00',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot No.255, Ward No.36 SBI Staff Housing Co-operative, Pushpa Nagar, Chandbad',
    addressLocality: 'Bhopal',
    addressRegion: 'MP',
    addressCountry: 'IN',
  },
  telephone: '+91 9981508165',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
