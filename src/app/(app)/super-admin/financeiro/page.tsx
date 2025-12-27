"use client"

import { companies, plans } from "@/mocks/companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, AlertTriangle, CreditCard } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function FinanceiroPage() {
    // Calculate financial metrics
    const mrr = companies
        .filter(c => c.status === 'active')
        .reduce((sum, company) => {
            const plan = plans.find(p => p.id === company.planId)
            return sum + (plan?.price || 0)
        }, 0)

    const totalRevenue = mrr * 12 // Annual projection
    const activeSubscriptions = companies.filter(c => c.status === 'active').length
    const pendingPayments = companies.filter(c => c.status === 'suspended').length

    // Mock chart data
    const revenueData = [
        { month: 'Jan', revenue: 291 },
        { month: 'Fev', revenue: 291 },
        { month: 'Mar', revenue: 488 },
        { month: 'Abr', revenue: 488 },
        { month: 'Mai', revenue: 488 },
        { month: 'Jun', revenue: 685 },
        { month: 'Jul', revenue: 685 },
        { month: 'Ago', revenue: 685 },
        { month: 'Set', revenue: 685 },
        { month: 'Out', revenue: 685 },
        { month: 'Nov', revenue: 685 },
        { month: 'Dez', revenue: 685 }
    ]

    const planDistribution = plans.map(plan => ({
        name: plan.name,
        subscribers: companies.filter(c => c.planId === plan.id && c.status === 'active').length,
        revenue: companies
            .filter(c => c.planId === plan.id && c.status === 'active')
            .reduce((sum) => sum + plan.price, 0)
    }))

    const stats = [
        {
            label: 'MRR (Receita Mensal)',
            value: `R$ ${mrr.toLocaleString('pt-BR')}`,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            label: 'Receita Anual (Projeção)',
            value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            label: 'Assinaturas Ativas',
            value: activeSubscriptions,
            icon: CreditCard,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
            label: 'Pagamentos Pendentes',
            value: pendingPayments,
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-100 dark:bg-red-900/20'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
                <p className="text-muted-foreground mt-1">
                    Visão completa das finanças da plataforma
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </CardTitle>
                                    <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue Chart */}
                <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Evolução da Receita</CardTitle>
                        <CardDescription>Receita mensal recorrente ao longo do ano</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="month"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `R$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Distribuição por Plano</CardTitle>
                        <CardDescription>Receita e assinantes por plano</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={planDistribution}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
