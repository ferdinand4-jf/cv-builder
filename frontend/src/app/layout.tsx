// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// @ts-ignore: allow side-effect CSS import without module declarations
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthHydrator } from '@/components/providers/AuthHydrator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CV Builder - Create Professional CVs Online',
  description: 'Build stunning professional CVs with our easy-to-use online CV builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthHydrator>
          {children}
        </AuthHydrator>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}