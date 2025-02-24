"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useSidebar } from "./sidebar";

export default function SidebarSwitch() {
  const { open, animate } = useSidebar();
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center justify-start gap-2 py-2">
      <motion.div
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
      >
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </motion.div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm"
      >
        Teacher
      </motion.span>
    </div>
  );
} 