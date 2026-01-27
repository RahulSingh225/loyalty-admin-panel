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

    </Box>
  );
}