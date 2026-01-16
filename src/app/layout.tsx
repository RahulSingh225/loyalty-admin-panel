import { Providers } from './providers'
import QueryProvider from '@/providers/QueryProvider'
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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <QueryProvider>
            <Providers>{children}</Providers>
          </QueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}