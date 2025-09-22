import '../styles/globals.css'
import React from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BinaKata - Platform Pembelajaran Adaptif untuk Anak Disleksia',
  description: 'Platform pembelajaran berbasis AI yang membantu anak penyandang disleksia mengembangkan kemampuan literasi dengan pendekatan multisensori yang dipersonalisasi',
  keywords: 'disleksia, pembelajaran adaptif, AI, multisensori, literasi, anak berkebutuhan khusus',
  authors: [{ name: 'Tim BinaKata' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen">
          {children}
          <div id="speech-permission" className="hidden" />
        </div>
        
        {/* Toast Container for notifications */}
        <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2"></div>
      </body>
    </html>
  )
}
