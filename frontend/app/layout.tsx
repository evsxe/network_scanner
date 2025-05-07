import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scanner1726',
  description: 'Created with v0',
  generator: 'my-network-scanner',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
