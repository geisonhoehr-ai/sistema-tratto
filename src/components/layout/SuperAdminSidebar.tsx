"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    Package,
    Settings,
    LogOut
} from "lucide-react"

const superAdminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin/dashboard" },
    { icon: Building2, label: "Empresas", href: "/super-admin/empresas" },
    { icon: Package, label: "Planos", href: "/super-admin/planos" },
    { icon: CreditCard, label: "Financeiro", href: "/super-admin/financeiro" },
    { icon: Settings, label: "Configurações", href: "/super-admin/configuracoes" },
]

export function SuperAdminSidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    return (
        <aside className="w-64 h-screen sticky top-0 border-r border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl flex flex-col z-40">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SA</span>
                    </div>
                    <div>
                        <span className="font-semibold text-sm tracking-tight text-foreground">Super Admin</span>
                        <p className="text-xs text-muted-foreground">BeautyFlow</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {superAdminMenuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm"
                                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-red-600 dark:text-red-400" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-black/5 dark:border-white/10 space-y-2">
                <div className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-muted-foreground">Logado como</p>
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>
        </aside>
    )
}
