import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Prayas Kar | Evolving',
  description:
    'Not a portfolio. An exploration of a person in continuous emergence. Uncover the layers — origin, friction, alignment, resonance, work.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0C0908',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${instrumentSerif.variable}`}
      style={{ backgroundColor: '#0C0908' }}
      suppressHydrationWarning
    >
      <body className="antialiased" style={{ backgroundColor: '#0C0908' }} suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
