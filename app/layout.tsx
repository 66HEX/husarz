import type { Metadata } from "next";

import "./globals.css";
import Footer from "@/app/components/Footer/footer";
import localFont from 'next/font/local'
import Navbar from "@/app/components/Navbar/navbar";
import SmoothScrolling from "@/app/components/SmoothScrolling/smoothScrolling";
import { LanguageProvider } from "@/app/i18n/LanguageContext";
import { en, pl } from "@/app/i18n";

const hoves = localFont({
    src: [
        {
            path: './fonts/TT_Hoves_Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/TT_Hoves_Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-hoves'
})

// Funkcja generująca metadane w zależności od języka
export async function generateMetadata(
  { params, searchParams }: { params: any, searchParams: any },
): Promise<Metadata> {
  // Czekaj na rozwiązanie promisa, jeśli to konieczne
  const resolvedParams = params instanceof Promise ? await params : params;
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  
  // Sprawdź parametr lang
  // Pobierz język z parametrów URL
  const langParam = resolvedSearchParams?.lang;
  const isEnglish = langParam === 'en';

  // Sprawdź URL żądania, jeśli to możliwe
  let requestUrl = '';
  if (typeof window !== 'undefined') {
    requestUrl = window.location.href;
  }
  
  // Metadane dla języka angielskiego
  if (isEnglish) {
    return {
      title: "Husarz Gym | Professional Sports Club",
      description: en.sections.hero.description,
      keywords: ["gym", "powerlifting", "martial arts", "armwrestling", "training", "Husarz", "gym"],
      authors: [{ name: "Husarz Gym" }],
      creator: "Husarz Gym",
      publisher: "Husarz Gym",
      openGraph: {
        title: "Husarz Gym | Professional Sports Club",
        description: en.sections.hero.description,
        locale: "en_US",
        url: "https://husarzgym.pl?lang=en",
        siteName: "Husarz Gym",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Husarz Gym | Professional Sports Club",
        description: en.sections.hero.description,
      },
      alternates: {
        languages: {
          'en': 'https://husarzgym.pl?lang=en',
          'pl': 'https://husarzgym.pl'
        },
        canonical: 'https://husarzgym.pl?lang=en'
      },
    };
  }
  
  // Metadane dla języka polskiego (domyślne)
  return {
    title: "Husarz Gym | Profesjonalny klub sportowy",
    description: pl.sections.hero.description,
    keywords: ["siłownia", "trójbój siłowy", "powerlifting", "sztuki walki", "armwrestling", "trening", "Husarz", "gym"],
    authors: [{ name: "Husarz Gym" }],
    creator: "Husarz Gym",
    publisher: "Husarz Gym",
    openGraph: {
      title: "Husarz Gym | Profesjonalny klub sportowy",
      description: pl.sections.hero.description,
      url: "https://husarzgym.pl",
      siteName: "Husarz Gym",
      locale: "pl_PL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Husarz Gym | Profesjonalny klub sportowy",
      description: pl.sections.hero.description,
    },
    alternates: {
      languages: {
        'en': 'https://husarzgym.pl?lang=en',
        'pl': 'https://husarzgym.pl'
      },
      canonical: 'https://husarzgym.pl'
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Domyślny język to 'pl', ale będzie on nadpisany przez useEffect w LanguageProvider
  const initialLang = 'pl';
  
  return (
    <html lang={initialLang} className={hoves.variable} suppressHydrationWarning>
      <body className="dark bg-background text-foreground">
        <LanguageProvider>
          <SmoothScrolling>
            <Navbar/>
            {children}
            <Footer/>
          </SmoothScrolling>
        </LanguageProvider>
      </body>
    </html>
  );
}