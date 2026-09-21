import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'अध्ययन | MoSPI & iGOT Karmayogi FRAC Official Statistical System',
  description: 'Next-generation AI competency gap analysis, RAG assessment generator, and iGOT Karmayogi course recommendation engine tailored for India’s Official Statistical System (MoSPI).',
  keywords: 'MoSPI, Indian Statistical Service, ISS, iGOT Karmayogi, FRAC, NSSO, CPI, IIP, National Accounts, Capacity Building, RAG Assessment',
  authors: [{ name: 'Ministry of Statistics and Programme Implementation' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Yatra+One&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-sand-100 text-slatenavy-900 min-h-screen antialiased selection:bg-electric-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
