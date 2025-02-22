import { Home, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/auth';

export const navigationLinks = [
  { label: "Home", href: "/main", icon: <Home /> },
  { label: "Settings", href: "/main/settings", icon: <Settings /> },
  {
    label: "Sign Out",
    action: async () => {
      'use server';
      await signOut();
    },
    icon: <LogOut />
  },
];

