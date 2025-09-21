import './globals.css'
import React from 'react'

export const metadata = {
  title: 'BinaKata',
  description: 'Deteksi dini disleksia dan pembelajaran adaptif',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="max-w-5xl mx-auto p-4">{children}</div>
      </body>
    </html>
  )
}