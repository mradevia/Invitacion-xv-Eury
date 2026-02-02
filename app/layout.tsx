import React from "react"
import type { Metadata } from 'next'
import { Cinzel, Cinzel_Decorative, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700']
})

const cinzelDecorative = Cinzel_Decorative({ 
  subsets: ["latin"],
  variable: '--font-decorative',
  weight: ['400', '700', '900']
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['200', '300', '400']
})

export const metadata: Metadata = {
  title: 'XV | Eurythmi | Royal Invitation',
  description: 'Estás cordialmente invitado a los XV años de Eurythmi',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${cinzelDecorative.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#020a18] text-gold-400 overflow-x-hidden selection:bg-royal-800 selection:text-gold-100">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
