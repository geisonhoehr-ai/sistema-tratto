"use client"

import { Bell, ChevronDown, Check, Search, Command } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTenant } from "@/contexts/tenant-context"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { notifications as initialNotifications } from "@/mocks/notifications"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export function Header() {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean)
    const pageTitle = pathSegments[0]?.charAt(0).toUpperCase() + pathSegments[0]?.slice(1) || "Dashboard"

    const { currentTenant, setCurrentTenant, allTenants } = useTenant()
    const { isSuperAdmin } = useAuth()
    const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [notifications, setNotifications] = useState(initialNotifications)

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const getNotificationIcon = (type: string) => {
        const icons = {
            appointment: '📅',
            payment: '💰',
            system: '⚙️',
            reminder: '⏰'
        }
        return icons[type as keyof typeof icons] || '📢'
    }

    return (
        <header className="h-20 sticky top-0 z-30 flex items-center justify-between px-8 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
            {/* Left: Page Title & Search Bar */}
            <div className="flex items-center gap-8 flex-1">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white hidden md:block">{pageTitle}</h1>

                {/* Command+K Search Mockup */}
                <div className="relative max-w-md w-full group hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por clientes, funcionários..."
                        className="w-full h-11 bg-slate-100 dark:bg-zinc-900 border-none rounded-2xl pl-11 pr-12 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm pointer-events-none">
                        <Command className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400">K</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-zinc-800">
                    <ThemeToggle />

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors group"
                        >
                            <Bell className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-[400px] bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden z-50 p-6 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Notificações</h3>
                                            <button onClick={markAllAsRead} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                                                Limpar Todas
                                            </button>
                                        </div>

                                        <div className="max-h-[450px] overflow-y-auto space-y-2 -mx-2 px-2 scrollbar-none">
                                            {notifications.length === 0 ? (
                                                <div className="py-20 text-center space-y-2">
                                                    <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                                        <Bell className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-400">Tudo limpo por aqui!</p>
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => markAsRead(n.id)}
                                                        className={cn(
                                                            "p-4 rounded-2xl flex gap-4 cursor-pointer transition-all group",
                                                            !n.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                                                        )}
                                                    >
                                                        <div className="text-2xl mt-0.5">{getNotificationIcon(n.type)}</div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <p className="font-bold text-sm text-slate-900 dark:text-white leading-none">{n.title}</p>
                                                                {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                                            </div>
                                                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">{n.message}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Tenant & User Profile */}
                <button
                    onClick={() => isSuperAdmin && setIsTenantMenuOpen(!isTenantMenuOpen)}
                    className="flex items-center gap-3 p-1 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                        {currentTenant.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block pr-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{currentTenant.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isSuperAdmin ? 'Super Admin' : 'Administrador'}</p>
                    </div>
                    {isSuperAdmin && <ChevronDown className="w-4 h-4 text-slate-400 mr-2 group-hover:text-primary transition-colors" />}
                </button>
            </div>
        </header>
    )
}
