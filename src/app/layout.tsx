import './globals.css';

export const metadata = {
  title: 'Executive Partners – Private Banking Recruitment',
  description: 'Private Banking & Wealth Management Recruitment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}