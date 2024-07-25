import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Design Handoff Checklist',
  description: 'A comprehensive checklist for design handoff process',
  openGraph: {
    title: 'Design Handoff Checklist',
    description: 'A comprehensive checklist for design handoff process',
    images: [
      {
        url: 'https://your-website-url.com/path-to-your-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Design Handoff Checklist',
      },
    ],
    url: 'https://your-website-url.com',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}