"use client"

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from '../theme'

const themes = {
  light: lightTheme,
  dark: darkTheme
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={themes.light}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}