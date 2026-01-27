"use client"

import { useState, ReactNode, useEffect } from 'react'
import { Box, AppBar, Toolbar, useTheme, useMediaQuery, IconButton, Drawer } from '@mui/material'
import { MenuOpen, Menu } from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import TopBar from './Topbar'
import { TOPBAR_CONFIG } from '@/config/topBarconfig'

interface LayoutProps {
  children: ReactNode
}

const DRAWER_WIDTH = 240
const COLLAPSED_DRAWER_WIDTH = 70

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(!isLargeScreen)
  const [isHovered, setIsHovered] = useState(false)

  // We use useEffect to handle screen size changes after initial render
  useEffect(() => {
    if (!isMobile) {
      setCollapsed(!isLargeScreen)
    }
  }, [isLargeScreen, isMobile])

  // Get config for current page
  const pageConfig = TOPBAR_CONFIG[pathname] || {
    title: "Dashboard",
    subtitle: "Welcome to the admin panel",
    actions: []
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed)
  }

  // The sidebar is visually expanded if it's NOT collapsed OR if it's being hovered
  const isEffectivelyExpanded = !collapsed || isHovered
  const currentDrawerWidth = isEffectivelyExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH

  // The layout/main content width should only care about the base 'collapsed' state
  // This ensures the sidebar overlaps the content on hover instead of pushing it
  const layoutDrawerWidth = collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Toolbar sx={{ justifyContent: !isEffectivelyExpanded ? 'center' : 'flex-start', px: !isEffectivelyExpanded ? 1 : 2 }}>
        <Box
          component="img"
          src="https://ik.imagekit.io/ewxcertfq/Sturlite%20Logo%20Dark.png?updatedAt=1759736719970"
          alt="Sturlite Logo"
          sx={{ height: 40, width: !isEffectivelyExpanded ? 40 : 'auto', objectFit: 'contain' }}
        />
      </Toolbar>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Sidebar
          currentPath={pathname}
          collapsed={!isEffectivelyExpanded}
          onToggleCollapse={!isMobile ? handleCollapseToggle : undefined}
        />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${layoutDrawerWidth}px)` },
          ml: { md: `${layoutDrawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: (theme) => theme.zIndex.drawer + 1, // Stay above drawer paper if needed, or matched
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
        sx={{
          width: { md: layoutDrawerWidth },
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          position: 'relative',
          zIndex: (theme) => theme.zIndex.drawer
        }}
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }, // Mobile always full width
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: currentDrawerWidth,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                overflowX: 'hidden',
                boxShadow: isHovered && collapsed ? '4px 0px 10px rgba(0,0,0,0.1)' : 'none'
              },
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
          width: { md: `calc(100% - ${layoutDrawerWidth}px)` },
          mt: '64px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  )
}