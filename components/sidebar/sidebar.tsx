"use client";

import React, { useState, createContext, useContext } from "react";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { geistMono } from "@/components/fonts";

// Define the shape of a navigation link.
interface NavigationLink {
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => Promise<void>;
}

// Define a context to manage sidebar state.
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

// Custom hook to consume the sidebar context.
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

/**
 * Sidebar Provider to wrap sidebar components.
 */
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Sidebar component that wraps its children with the SidebarProvider.
 */
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

/**
 * SidebarTitle that displays the logo and name.
 */
export const SidebarTitle = () => {
  const { open, animate } = useSidebar();

  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={50}
        height={50}
        className="h-7 w-7 flex-shrink-0"
      />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={`${geistMono.className} text-xl font-semibold`}
      >
        AceAnswer
      </motion.span>
    </div>
  );
};

/**
 * Reusable component for rendering animated sidebar label text.
 */
const SidebarLabel: React.FC<{ label: string; open: boolean; animate: boolean }> = ({
  label,
  open,
  animate,
}) => {
  return (
    <motion.span
      animate={{
        display: animate ? (open ? "inline-block" : "none") : "inline-block",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
    >
      {label}
    </motion.span>
  );
};

/**
 * SidebarBody renders different sidebar components for desktop and mobile.
 */
export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

/**
 * DesktopSidebar for wide screens. It toggles its width on hover.
 */
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-card border-t border-r border-secondary shadow-inner rounded-tr-3xl w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "200px" : "60px") : "200px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * MobileSidebar renders a collapsible sidebar for mobile devices.
 */
export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-card border-b border-secondary shadow-inner rounded-b-xl w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-card border border-secondary shadow-inner p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

/**
 * SidebarLink renders either a Next.js Link or a button, depending on whether a href is provided.
 */
export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: NavigationLink;
  className?: string;
  props?: Omit<LinkProps, "href">;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = link.href ? pathname === link.href : false;

  // Clone the icon element to inject conditional styling.
  const iconElement = React.isValidElement(link.icon)
    ? React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, {
        className: cn(
          (link.icon as React.ReactElement<{ className?: string }>).props.className,
          isActive ? "text-primary" : "text-black dark:text-white"
        ),
      })
    : link.icon;

  // Use Next.js Link if href exists; otherwise, render a button.
  if (link.href) {
    return (
      <Link
        href={link.href}
        className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)}
        {...props}
      >
        <span className="flex-shrink-0">{iconElement}</span>
        <SidebarLabel label={link.label} open={open} animate={animate} />
      </Link>
    );
  }

  return (
    <button
      onClick={() => link.action?.()}
      className={cn("flex items-center justify-start gap-2 group/sidebar py-2 w-full", className)}
      {...props}
    >
      <span className="flex-shrink-0">{iconElement}</span>
      <SidebarLabel label={link.label} open={open} animate={animate} />
    </button>
  );
};
