import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "1Click Boost Ads - Ads Manager Pro",
  description: "Manage and optimize your advertising campaigns easily with 1Click Boost Ads",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km">
      <body>
        {children}
      </body>
    </html>
  );
}
