// src/components/TopBar.tsx
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import {
  Notifications,
  Settings,
  Logout,
  AccountCircle,
  DarkMode,
  LightMode
} from "@mui/icons-material";

export type ActionButton = {
  label: string;
  icon: string;            // FontAwesome class (e.g. "fas fa-sync-alt")
  onClick?: () => void;    // optional – you can pass a handler from the page
  variant?: "primary" | "secondary" | "danger";
};

type TopBarProps = {
  title: string;
  subtitle: string;
  /** Optional array of action buttons that appear on the right side */
  actions?: ActionButton[];
};

export default function TopBar({ title, subtitle, actions = [] }: TopBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false)

  const handleProfileOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleProfileClose();
    signOut();
  };
const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // Add theme switching logic here if needed
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px: { xs: 2, md: 3 },
        py: 2,
      }}
    >
      {/* ---- LEFT – Title / Subtitle ---- */}
      <Box>
        <Typography variant="h5" component="h1" className="font-bold text-primary">
          {title}
        </Typography>
        <Typography variant="body2" className="text-tertiary">
          {subtitle}
        </Typography>
      </Box>

      {/* ---- RIGHT – Actions + Icons ---- */}
      <Box className="flex items-center space-x-3">
        {/* Page-specific action buttons */}
        {actions.map((btn, idx) => {
          const bg =
            btn.variant === "danger"
              ? "bg-red-600 hover:bg-red-700"
              : btn.variant === "secondary"
              ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              : "bg-blue-600 hover:bg-blue-700";

          return (
            <Button
            variant="contained"
              key={idx}
              onClick={btn.onClick}
              className={`px-4 py-2 ${bg} text-white text-sm font-medium rounded-lg transition flex items-center space-x-1 row-gap-2`}
            >
                
              <i className={btn.icon} />
              <span>{btn.label}</span>
            </Button>
          );
        })}
<Tooltip title="Toggle Dark Mode">
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        {/* Notification */}
        <Tooltip title="Notifications">
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
          </IconButton>
        </Tooltip>

        {/* Settings */}
        <Tooltip title="Settings">
          <IconButton className="text-tertiary">
            <i className="fas fa-cog" />
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Tooltip title="Profile">
          <IconButton onClick={handleProfileOpen} className="text-tertiary">
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
            >
              {session?.user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Profile menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleProfileClose}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleProfileClose}>
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}