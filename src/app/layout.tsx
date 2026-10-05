import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: "Ampère Eletrônicos · Tecnologia com atendimento de verdade",
  description:
    "Celulares, informática, games, casa e assistência técnica. Demonstração de loja com atendente de IA e CRM integrado, criada pela Concept Digital.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1e",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
