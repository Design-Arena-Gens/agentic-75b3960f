import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Watchlist Organizer',
  description: 'Movies and TV shows, organized beautifully.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-white/10 selection:text-white">
        {children}
      </body>
    </html>
  )
}
