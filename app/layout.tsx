import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'CAT Compass - CAT Exam Prep Companion',
  description:
    'A free, provider-independent CAT exam preparation companion that turns fragmented practice data into a prioritised, actionable study plan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9fc] text-slate-900 flex flex-col font-sans">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white/50 py-6 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto px-4">
              <p>CAT Compass • Free, provider-independent preparation intelligence for CAT aspirants.</p>
              <p className="mt-1 text-gray-400">All data is kept 100% locally in your browser.</p>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
