"use client"

import { useMemo } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    ChevronLeft,
    Calendar,
    Clock,
    User,
    MapPin,
    ExternalLink,
    Sparkles,
    History,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tenants } from "@/mocks/tenants"
import { appointments } from "@/mocks/data"
import { services } from "@/mocks/services"
import { cn } from "@/lib/utils"

export default function CustomerProfilePage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const tenantSlug = params.tenantSlug as string
    const customerEmail = searchParams.get('email')

    const tenant = useMemo(() => {
        return tenants.find(t => t.slug === tenantSlug) || tenants[0]
    }, [tenantSlug])

    // Find all appointments for this email
    const allAppointments = useMemo(() => {
        if (!customerEmail) return []
        // In a real app, this would be an API call matching by email
        // We use mock data and filter by customer name as a proxy for the mockup
        return appointments.filter(apt => apt.customer.toLowerCase().includes(customerEmail.split('@')[0].toLowerCase()))
    }, [customerEmail])

    const tenantHistory = allAppointments.filter(apt => apt.tenantId === tenant.id)

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    if (!customerEmail) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-2xl font-bold">Perfil não encontrado</h1>
                    <p className="text-slate-500">Por favor, acesse o link enviado após o seu agendamento.</p>
                    <Button onClick={() => router.back()} variant="outline">Voltar</Button>
                </div>
            </div>
        )
    }

    const AppointmentCard = ({ apt }: { apt: typeof appointments[0] }) => {
        const aptTenant = tenants.find(t => t.id === apt.tenantId)
        const aptService = services.find(s => s.id === apt.serviceId)

        return (
            <Card className="p-5 rounded-3xl border-none shadow-sm bg-white dark:bg-zinc-900 hover:shadow-md transition-all active:scale-[0.99] group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-xl">
                            {aptTenant?.logo || '🏢'}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{aptTenant?.fullName}</h4>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{aptService?.name}</p>
                        </div>
                    </div>
                    <Badge className={cn(
                        "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-tighter",
                        apt.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-600 border-none" :
                            apt.status === 'completed' ? "bg-slate-500/10 text-slate-600 border-none" : "bg-blue-500/10 text-blue-600 border-none"
                    )}>
                        {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'completed' ? 'Concluído' : 'Agendado'}
                    </Badge>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400">
                        <Calendar className="w-4 h-4 text-primary" />
                        {format(parseISO(apt.date), "dd 'de' MMM", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400">
                        <Clock className="w-4 h-4 text-primary" />
                        {apt.time}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 tracking-tight">R$ {aptService?.price},00</span>
                    <Button variant="ghost" size="sm" className="h-8 rounded-xl text-primary font-bold text-xs">
                        Ver Detalhes <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-zinc-800/50 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-black tracking-tight">Meu Perfil</h1>
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                {/* User Info Card */}
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-12 translate-x-12" />
                        <div className="relative z-10 space-y-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black">{customerEmail.split('@')[0]}</h2>
                                <p className="text-slate-400 font-medium text-sm">{customerEmail}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{allAppointments.length} Visitas</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Diamante</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* History Tabs */}
                <Tabs defaultValue="tenant" className="w-full">
                    <TabsList className="w-full bg-slate-200/50 dark:bg-zinc-900 p-1.5 rounded-2xl h-14 mb-6">
                        <TabsTrigger
                            value="tenant"
                            className="flex-1 rounded-xl font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all"
                        >
                            No Salão
                        </TabsTrigger>
                        <TabsTrigger
                            value="all"
                            className="flex-1 rounded-xl font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all text-xs"
                        >
                            Histórico Global
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="tenant" className="space-y-4">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> {tenant.fullName}
                            </h3>
                        </div>
                        {tenantHistory.length > 0 ? (
                            tenantHistory.map(apt => <AppointmentCard key={apt.id} apt={apt} />)
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto opacity-50">
                                    <History className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-400 font-medium italic">Nenhum agendamento neste salão ainda.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="all" className="space-y-4">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                                <History className="w-3 h-3" /> Todas as empresas
                            </h3>
                        </div>
                        {allAppointments.map(apt => <AppointmentCard key={apt.id} apt={apt} />)}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
