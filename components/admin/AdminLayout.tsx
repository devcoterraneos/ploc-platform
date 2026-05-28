"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  LogOut,
} from "lucide-react";
import Logo from "@/components/Logo";
import supabase from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin",              label: "Dashboard",     icon: LayoutDashboard, exact: true },
  { href: "/admin/campanas",     label: "Campañas",      icon: Megaphone },
  { href: "/admin/donantes",     label: "Donantes",      icon: Heart },
  { href: "/admin/socios",       label: "Socios",        icon: Users },
  { href: "/admin/configuracion",label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]             = useState<User | null>(null);
  // No spinner needed on the login page itself
  const [checking, setChecking]     = useState(!isLoginPage);

  useEffect(() => {
    // Login page doesn't need auth check
    if (isLoginPage) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
        setChecking(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  // Login page: render without admin shell (no spinner, no sidebar)
  if (isLoginPage) return <>{children}</>;

  // Show spinner while verifying session for other admin pages
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-200 ${
        !mobile && (collapsed ? "w-16" : "w-56")
      } ${mobile ? "w-64" : ""}`}
    >
      {/* Logo */}
      <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-100 ${collapsed && !mobile ? "px-3" : ""}`}>
        {(!collapsed || mobile) && <Logo size="sm" />}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                active
                  ? "bg-red-50 text-[#8B1A1A]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed && !mobile ? "justify-center px-0 mx-1" : ""}`}
              title={collapsed && !mobile ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[#8B1A1A]" : ""}`} />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: view site + logout */}
      <div className={`p-3 border-t border-gray-100 space-y-1 ${collapsed && !mobile ? "flex flex-col items-center" : ""}`}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-xs text-gray-400 hover:text-[#8B1A1A] transition-colors p-2 rounded-lg hover:bg-gray-50 ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || mobile) && "Ver sitio"}
        </a>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 text-xs text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 w-full ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || mobile) && "Cerrar sesión"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          {user && (
            <span className="text-xs text-gray-400 hidden sm:block">
              {user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
