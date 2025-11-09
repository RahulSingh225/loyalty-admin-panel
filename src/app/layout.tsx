import { Providers } from './providers'
import './globals.css'
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

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
        <AppRouterCacheProvider>
        <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}