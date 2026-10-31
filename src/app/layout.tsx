import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DocuMorph — Multimodal Living Documentation & API Playground',
  description:
    'Transform static technical specifications and architecture docs into interactive living graphs and in-browser executable API sandboxes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
