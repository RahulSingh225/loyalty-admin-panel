import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'Sturlite Admin Panel',
  description: 'Admin panel for Sturlite Loyalty Program',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}