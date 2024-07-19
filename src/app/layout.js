import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'Design Handoff Checklist',
  description: 'A checklist for design handoff process',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}