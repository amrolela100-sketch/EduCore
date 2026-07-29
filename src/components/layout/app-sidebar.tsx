"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Code2,
  FileText,
  Cpu,
  BarChart3,
  Shield,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Search,
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

type RoleKey = "SYSTEM_ADMIN" | "HR_ADMIN" | "TECH_ADMIN" | "CANDIDATE";

const NAV_ITEMS: Record<RoleKey, NavItem[]> = {
  SYSTEM_ADMIN: [
    { id: "system", label: "System Control", href: "/admin/system", icon: <Shield className="w-4.5 h-4.5" /> },
    { id: "hr", label: "HR Audit Panel", href: "/admin/hr", icon: <FileText className="w-4.5 h-4.5" /> },
    { id: "tech", label: "Tech Review", href: "/admin/tech", icon: <Code2 className="w-4.5 h-4.5" /> },
    { id: "users", label: "Users & Roles", href: "/admin/system?tab=users", icon: <Users className="w-4.5 h-4.5" /> },
    { id: "companies", label: "Companies", href: "/admin/system?tab=companies", icon: <Building2 className="w-4.5 h-4.5" /> },
    { id: "ai", label: "AI Settings", href: "/admin/system?tab=ai", icon: <Cpu className="w-4.5 h-4.5" /> },
  ],
  HR_ADMIN: [
    { id: "hr", label: "HR Dashboard", href: "/admin/hr", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: "applications", label: "Applications", href: "/admin/hr", icon: <Briefcase className="w-4.5 h-4.5" /> },
    { id: "audit", label: "Audit Timeline", href: "/admin/hr", icon: <BarChart3 className="w-4.5 h-4.5" /> },
  ],
  TECH_ADMIN: [
    { id: "tech", label: "Tech Dashboard", href: "/admin/tech", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: "code", label: "Code Review", href: "/admin/tech", icon: <Code2 className="w-4.5 h-4.5" /> },
    { id: "telemetry", label: "Telemetry", href: "/admin/tech", icon: <Cpu className="w-4.5 h-4.5" /> },
  ],
  CANDIDATE: [
    { id: "candidate", label: "Dashboard", href: "/candidate", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: "jobs", label: "Open Roles", href: "/candidate", icon: <Briefcase className="w-4.5 h-4.5" /> },
    { id: "interviews", label: "Interviews", href: "/candidate", icon: <Cpu className="w-4.5 h-4.5" /> },
  ],
};

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

interface AppSidebarProps {
  role: RoleKey;
  userName?: string | null;
}

export function AppSidebar({ role, userName }: AppSidebarProps) {
  const pathname = usePathname();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const items = NAV_ITEMS[role] ?? [];
  const sidebarWidth = collapsed ? "72px" : "260px";

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-[#0A0A0A] text-white border-r border-[#222] flex flex-col lg:hidden"
            >
              <SidebarContent role={role} userName={userName} isMobile items={items} pathname={pathname} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.aside
        layout
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="hidden lg:flex fixed top-0 left-0 bottom-0 z-30 flex-col bg-[#0A0A0A] text-white border-r border-[#222]"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent
          role={role}
          userName={userName}
          items={items}
          pathname={pathname}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </motion.aside>
    </>
  );
}

interface SidebarContentProps {
  role: RoleKey;
  userName?: string | null;
  items: NavItem[];
  pathname: string;
  isMobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

function SidebarContent({
  role,
  userName,
  items,
  pathname,
  isMobile,
  collapsed,
  onToggleCollapse,
  onClose,
}: SidebarContentProps) {
  const roleLabels: Record<RoleKey, string> = {
    SYSTEM_ADMIN: "System Administrator",
    HR_ADMIN: "HR Director",
    TECH_ADMIN: "Lead Engineer",
    CANDIDATE: "Applicant",
  };

  return (
    <div className="flex flex-col h-full font-body-sm">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 h-16 border-b border-[#222] shrink-0",
        isMobile ? "px-5" : (collapsed ? "px-4 justify-center" : "px-5")
      )}>
        <Link href="/" className="flex items-center gap-2 group" onClick={onClose}>
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-editorial font-bold rounded-sm">
            EC
          </div>
          {(!collapsed || isMobile) && (
            <span className="font-editorial text-xl tracking-tight leading-none text-white">
              EduCore
            </span>
          )}
        </Link>
        {isMobile && (
          <button onClick={onClose} className="ml-auto p-1.5 text-white/50 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className={cn("shrink-0", isMobile ? "px-4 pt-4" : (collapsed ? "px-3 pt-3" : "px-4 pt-4"))}>
        <button
          className={cn(
            "w-full flex items-center gap-2.5 rounded-md border border-[#333] bg-[#111] text-white/50 text-xs transition-all duration-200 hover:border-[#555] hover:text-white",
            isMobile || !collapsed ? "px-3 py-2" : "p-2 justify-center"
          )}
        >
          <Search className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="flex-1 text-left font-body-sm">Search CRM...</span>
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        isMobile ? "px-3 py-6 space-y-1" : (collapsed ? "px-2 py-6 space-y-1" : "px-3 py-6 space-y-1")
      )}>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href.split("?")[0]);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-md font-body-sm transition-all duration-200",
                isMobile || !collapsed ? "px-3 py-2.5" : "p-2.5 justify-center",
                isActive
                  ? "bg-white/10 text-white font-medium shadow-[inset_2px_0_0_0_#fff]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className={cn("shrink-0", isActive ? "text-coral" : "text-white/40 group-hover:text-white/80")}>
                {item.icon}
              </span>
              {(!collapsed || isMobile) && (
                <span className="whitespace-nowrap flex-1 truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className={cn("shrink-0 border-t border-[#222]", isMobile ? "p-4" : (collapsed ? "p-3" : "p-4"))}>
        <div className={cn(
          "flex items-center gap-3 rounded-md hover:bg-white/5 transition-colors cursor-pointer",
          isMobile || !collapsed ? "px-2 py-2" : "p-2 justify-center"
        )}>
          <div className="w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-lg">
            {userName ? userName[0].toUpperCase() : "U"}
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="font-body-sm font-medium text-white truncate">{userName ?? "Guest"}</p>
              <p className="text-[10px] text-white/50 font-label-caps">{roleLabels[role]}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      {!isMobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center h-10 border-t border-[#222] text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export function MobileSidebarButton({ className }: { className?: string }) {
  const { setMobileOpen } = useSidebar();
  return (
    <button
      onClick={() => setMobileOpen(true)}
      className={cn("lg:hidden p-2 text-foreground hover:bg-foreground/5 rounded-md transition-colors cursor-pointer", className)}
    >
      <PanelLeftOpen className="w-5 h-5" />
    </button>
  );
}
