"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Clock,
    Play,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Star,
    TrendingUp,
    Pause,
    MoreHorizontal,
    Bell,
    Smartphone,
    Users
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ProfessionalDashboard() {
    const [timerActive, setTimerActive] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [currentService, setCurrentService] = useState({
        id: 1,
        customer: "Ana Ferreira",
        service: "Mechas + Hidratação",
        time: "14:30 - 16:30",
        duration: 120, // minutes
    })

    const schedule = [
        { id: 2, customer: "Juliana Silva", service: "Corte", time: "16:45", status: "upcoming" },
        { id: 3, customer: "Carla Souza", service: "Penteado Social", time: "18:00", status: "upcoming" },
    ]

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timerActive) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timerActive])

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600)
        const mins = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60
        return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const progress = Math.min((seconds / (currentService.duration * 60)) * 100, 100)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black p-4 pb-24 md:p-8 flex flex-col items-center">
            {/* Mobile Frame Simulation on Desktop */}
            <div className="w-full max-w-md space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Olá, Marcos 👋</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sua Agenda de Hoje</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-zinc-900 shadow-sm relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 rounded-[1.5rem] border-none shadow-sm bg-primary text-white space-y-1">
                        <TrendingUp className="w-4 h-4 text-white/60" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Ganhos Dia</p>
                        <p className="text-lg font-black font-mono">R$ 420,00</p>
                    </Card>
                    <Card className="p-4 rounded-[1.5rem] border-none shadow-sm bg-white dark:bg-zinc-900 space-y-1 text-slate-900 dark:text-white">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avaliação</p>
                        <p className="text-lg font-black">4.9/5.0</p>
                    </Card>
                </div>

                {/* Active Service Timer */}
                <Card className="p-6 rounded-[2rem] border-none shadow-2xl bg-white dark:bg-zinc-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] uppercase">
                            Em Andamento
                        </Badge>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentService.customer}</h3>
                            <p className="text-sm font-bold text-primary">{currentService.service}</p>
                        </div>

                        <div className="flex flex-col items-center py-6 space-y-4">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90 transform">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="75"
                                        className="stroke-slate-100 dark:stroke-zinc-800"
                                        strokeWidth="8"
                                        fill="transparent"
                                    />
                                    <motion.circle
                                        cx="80"
                                        cy="80"
                                        r="75"
                                        className="stroke-primary"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={471}
                                        initial={{ strokeDashoffset: 471 }}
                                        animate={{ strokeDashoffset: 471 - (471 * progress) / 100 }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-mono font-black text-slate-900 dark:text-white">
                                        {formatTime(seconds)}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">decorrido</span>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full">
                                {!timerActive ? (
                                    <Button
                                        onClick={() => setTimerActive(true)}
                                        className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                                    >
                                        <Play className="w-4 h-4 mr-2 fill-current" /> Iniciar
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setTimerActive(false)}
                                        variant="outline"
                                        className="flex-1 h-14 rounded-2xl border-slate-200 font-bold"
                                    >
                                        <Pause className="w-4 h-4 mr-2 fill-current" /> Pausar
                                    </Button>
                                )}
                                <Button
                                    className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Vertical Schedule */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-900 dark:text-white text-lg">Próximos Clientes</h3>
                        <Button variant="ghost" className="text-xs font-bold text-primary p-0">Ver tudo</Button>
                    </div>

                    <div className="space-y-3">
                        {schedule.map(item => (
                            <Card key={item.id} className="p-4 rounded-2xl border-none shadow-sm bg-white dark:bg-zinc-900 flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 flex flex-col items-center justify-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Hoje</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{item.time}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{item.customer}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.service}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-colors" />
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mobile Bottom Nav Bar */}
                <div className="fixed bottom-6 left-4 right-4 h-16 bg-slate-900/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-around px-6 border border-white/10">
                    <button className="text-primary p-2"><Clock className="w-6 h-6" /></button>
                    <button className="text-white/40 p-2"><Calendar className="w-6 h-6" /></button>
                    <button className="text-white/40 p-2"><Users className="w-6 h-6" /></button>
                    <button className="text-white/40 p-2"><MoreHorizontal className="w-6 h-6" /></button>
                </div>
            </div>

            <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Smartphone className="w-3 h-3" /> Mobile Experience by BeautyFlow
            </p>
        </div>
    )
}
