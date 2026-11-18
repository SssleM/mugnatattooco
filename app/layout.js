import { Anton, Manrope, Pirata_One } from 'next/font/google';
import './globals.css';

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const gothic = Pirata_One({ subsets: ['latin'], weight: '400', variable: '--font-gothic', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: { default: 'MUGNA Tattoo Co. — Custom Tattoo Studio', template: '%s · MUGNA Tattoo Co.' },
  description:
    'MUGNA Tattoo Co. is an independent custom tattoo studio. Neo-traditional, fine line, blackwork and geometric tattoos, home service, and online booking with a GCash deposit.',
  openGraph: { title: 'MUGNA Tattoo Co.', description: 'Ink that is made, not copied.', images: ['/og.jpg'] },
};

export const viewport = { themeColor: '#0b0908' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${gothic.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
