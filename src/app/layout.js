import './globals.css'

export const metadata = {
  title: 'Design Handoff Checklist',
  description: 'A checklist for design handoff process',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}