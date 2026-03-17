import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Pacifico, Pinyon_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { COUPLE_NAME, WEDDING_DATE_DISPLAY } from '@/lib/wedding-config'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
})

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin', 'vietnamese'],
  variable: '--font-pacifico',
})

const pinyonScript = Pinyon_Script({
  weight: '400',
  subsets: ['latin', 'vietnamese'],
  variable: '--font-pinyon-script',
})

export const metadata: Metadata = {
  title: `${COUPLE_NAME} - Save Our Date | ${WEDDING_DATE_DISPLAY}`,
  description: `Chúng mình chính thức về chung một nhà. Hãy cùng chia sẻ niềm hạnh phúc với ${COUPLE_NAME} trong ngày trọng đại ${WEDDING_DATE_DISPLAY}.`,
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#d4919a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable} ${pacifico.variable} ${pinyonScript.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
