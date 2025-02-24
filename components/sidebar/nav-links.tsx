import React from "react";
import { Home, Settings, LogOut, Search, Book, ChartBar } from 'lucide-react';
import { signOutAction } from "@/components/sidebar/sign-out.action";

export interface NavigationLink {
  label: string;
  href?: string;
  action?: () => Promise<void>;
  icon: React.ReactNode;
}

export const navigationLinks: NavigationLink[] = [
  { label: "Home", href: "/main", icon: <Home /> },
  { label: "Search", href: "/main/search", icon: <Search /> },
  { label: "Settings", href: "/main/settings", icon: <Settings /> },
  {
    label: "Sign Out",
    action: signOutAction,
    icon: <LogOut />
  },
];

export const teacherNavigationLinks: NavigationLink[] = [
  { label: "Courses", href: "/main/teacher/courses", icon: <Book /> },
  { label: "Analytics", href: "/main/teacher/analytics", icon: <ChartBar /> },
];