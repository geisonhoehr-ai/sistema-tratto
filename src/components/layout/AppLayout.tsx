"use client"

import { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { SuperAdminSidebar } from "./SuperAdminSidebar"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface AppLayoutProps {
    children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const { user, isSuperAdmin } = useAuth()

    // Show appropriate sidebar based on user role
    const SidebarComponent = isSuperAdmin ? SuperAdminSidebar : Sidebar

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <SidebarComponent />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
