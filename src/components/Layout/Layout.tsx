"use client"

import { useState, ReactNode } from 'react'
import { Box, AppBar, Toolbar, useTheme, useMediaQuery, IconButton, Drawer } from '@mui/material'
import { MenuOpen, Menu } from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import TopBar from './Topbar'
import { TOPBAR_CONFIG } from '@/config/topBarconfig'

interface LayoutProps {
  children: ReactNode
}

const drawerWidth = 240

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const pathname = usePathname()

  

  // Get config for current page
  const pageConfig = TOPBAR_CONFIG[pathname] || {
    title: "Dashboard",
    subtitle: "Welcome to the admin panel",
    actions: []
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Box
          component="img"
          src="https://ik.imagekit.io/ewxcertfq/Sturlite%20Logo%20Dark.png?updatedAt=1759736719970"
          alt="Sturlite Logo"
          sx={{ height: 40 }}
        />
      </Toolbar>
      <Sidebar currentPath={pathname} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            {mobileOpen ? <MenuOpen /> : <Menu />}
          </IconButton>
          <TopBar
            title={pageConfig.title}
            subtitle={pageConfig.subtitle}
            actions={pageConfig.actions}
          />
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* The implementation */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}