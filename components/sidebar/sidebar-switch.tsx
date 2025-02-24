"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useSidebar } from "./sidebar";
import { useRouter, usePathname } from "next/navigation";

// Extract motion variants to avoid duplicate inline animation objects
const motionVariants = {
  show: { display: "inline-block", opacity: 1 },
  hide: { display: "none", opacity: 0 },
};

export default function SidebarSwitch() {
  const { open, animate } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize teacher mode based on current route
  const initialEnabled = pathname.startsWith("/main/teacher");
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleChange = (checked: boolean) => {
    setEnabled(checked);
    if (checked) {
      router.push("/main/teacher/courses");
    } else {
      router.push("/main");
    }
  };

  const animationState = animate ? (open ? "show" : "hide") : "show";

  return (
    <div className="flex items-center justify-start gap-2 py-2">
      <motion.div animate={animationState} variants={motionVariants}>
        <Switch checked={enabled} onCheckedChange={handleChange} />
      </motion.div>
      <motion.span
        animate={animationState}
        variants={motionVariants}
        className="text-sm"
      >
        Teacher
      </motion.span>
    </div>
  );
} 