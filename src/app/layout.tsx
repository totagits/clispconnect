import type { Metadata } from "next";
import { getCurrentUser } from "../lib/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLISPConnect | Liberia National Community Leadership Registry",
  description: "CLISPConnect formalizes community leadership structures across Liberia, creates a national GIS-enabled registry (NRCL), and enables weekly ground-truth reporting to the Ministry of Local Government.",
  icons: {
    icon: "/clef-logo.png",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch current user on server
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {/* Load Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-canvas-light text-ink antialiased">
        {/* Core Layout Structure */}
        <Header currentUser={currentUser} />
        
        <main className="flex-grow flex flex-col relative">
          {/* Decorative subtle background design elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0A3D91]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[60%] bg-[#1D8F8A]/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
          
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
