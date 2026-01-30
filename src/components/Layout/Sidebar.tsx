"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
  Collapse,
  Tooltip,
  IconButton
} from '@mui/material'
import {
  Dashboard,
  Settings,
  Campaign,
  QrCode,
  Announcement,
  AccountBalance,
  Security,
  Assessment,
  AdminPanelSettings,
  IntegrationInstructions,
  Report,
  Build,
  ConfirmationNumber,
  Group,
  Tune,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material'
import Link from 'next/link'

interface NavigationItem {
  text: string
  icon: React.ReactNode
  path: string
  children?: NavigationItem[]
}

const menuItems: NavigationItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  // {
  //   text: 'Masters & Config',
  //   icon: <Settings />,
  //   path: '/masters-config',

  // },
  //{ text: 'Schemes & Campaigns', icon: <Campaign />, path: '/schemes-campaigns' },
  { text: 'QR Management', icon: <QrCode />, path: '/qr-management' },
  //{ text: 'Communication', icon: <Announcement />, path: '/communication' },
  //{ text: 'Finance & Compliance', icon: <AccountBalance />, path: '/finance-compliance' },
  //{ text: 'Fraud Detection', icon: <Security />, path: '/fraud-detection' },
  //{ text: 'MIS & Analytics', icon: <Assessment />, path: '/mis-analytics' },
  //{ text: 'Role Management', icon: <AdminPanelSettings />, path: '/role-management' },
  //{ text: 'Integrations', icon: <IntegrationInstructions />, path: '/integrations' },
  //{ text: 'Reports', icon: <Report />, path: '/reports' },
  //{ text: 'Process', icon: <Build />, path: '/process' },
  //{ text: 'Tickets', icon: <ConfirmationNumber />, path: '/tickets' },
  //{ text: 'Members', icon: <Group />, path: '/members' },
  //{ text: 'Configuration', icon: <Tune />, path: '/configuration' }
]

interface SidebarProps {
  currentPath: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ currentPath, collapsed = false, onToggleCollapse }: SidebarProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  const handleItemClick = (item: NavigationItem) => {
    if (collapsed) return; // Don't expand children if collapsed for now, or could expand sidebar

    if (item.children) {
      setOpenItems(prev =>
        prev.includes(item.text)
          ? prev.filter(i => i !== item.text)
          : [...prev, item.text]
      )
    } else {
      router.push(item.path)
    }
  }

  const isItemActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/')
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1, py: 1 }}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <Tooltip title={collapsed ? item.text : ""} placement="right">
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  selected={isItemActive(item.path)}
                  onClick={() => handleItemClick(item)}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 3,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'block' }}
                  />
                  {!collapsed && item.children && (
                    openItems.includes(item.text) ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>

            {!collapsed && item.children && (
              <Collapse in={openItems.includes(item.text)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding>
                      <ListItemButton
                        selected={isItemActive(child.path)}
                        component={Link}
                        href={child.path}
                        sx={{
                          pl: 4,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(37, 99, 235, 0.08)',
                            color: 'primary.main'
                          }
                        }}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>

      <Divider />

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', p: 1 }}>
          <IconButton onClick={onToggleCollapse}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}

      {session && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: collapsed ? 0 : 2 }}>
              {session.user.name?.charAt(0)}
            </Avatar>
            {!collapsed && (
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" fontWeight="medium" noWrap>
                  {session.user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {session.user.email}
                </Typography>
              </Box>
            )}
          </Box>
          {!collapsed && (
            <ListItemButton onClick={() => signOut()} sx={{ mt: 1 }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          )}
        </Box>
      )}
    </Box>
  )
}