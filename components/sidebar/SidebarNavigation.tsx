"use client";

import { usePathname } from "next/navigation";
import { SidebarLink } from "@/components/sidebar/sidebar";
import { navigationLinks, teacherNavigationLinks } from "@/components/sidebar/nav-links";
import { useMemo } from "react";

export default function SidebarNavigation() {
  const pathname = usePathname();
  const isTeacherMode = pathname.startsWith("/main/teacher");

  // Memoize the link array based on the teacher mode
  const links = useMemo(
    () => (isTeacherMode ? teacherNavigationLinks : navigationLinks),
    [isTeacherMode]
  );

  return (
    <div className="mt-8 flex flex-col gap-2">
      {links.map((link) => (
        // Use a unique key: prefer href if available, otherwise fallback to label
        <SidebarLink key={link.href || link.label} link={link} />
      ))}
    </div>
  );
} 