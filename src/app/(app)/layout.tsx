"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { TenantProvider } from "@/contexts/tenant-context"
import { ThemeApplier } from "@/components/theme-applier"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <TenantProvider>
            <ThemeApplier />
            <AppLayout>{children}</AppLayout>
        </TenantProvider>
    )
}

