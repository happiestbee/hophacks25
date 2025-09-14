import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AuthProvider from '@/components/providers/session-provider'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar'
import { UserFlowHandler } from '@/components/auth/UserFlowHandler'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Pedal - FHA Recovery',
  description:
    'A gentle, supportive space for your FHA recovery journey. Track, learn, and thrive with compassion.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <UserFlowHandler />
          <ConditionalNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
