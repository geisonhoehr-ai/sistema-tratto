"use client"

import { useAuth } from "@/contexts/auth-context"
import { companies, plans } from "@/mocks/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, TrendingUp, Users, AlertCircle } from "lucide-react"

export default function SuperAdminDashboard() {
    const { user } = useAuth()

    // Calculate metrics
    const totalCompanies = companies.length
    const activeCompanies = companies.filter(c => c.status === 'active').length
    const trialCompanies = companies.filter(c => c.status === 'trial').length
    const suspendedCompanies = companies.filter(c => c.status === 'suspended').length

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = companies
        .filter(c => c.status === 'active')
        .reduce((sum, company) => {
            const plan = plans.find(p => p.id === company.planId)
            return sum + (plan?.price || 0)
        }, 0)

    const stats = [
        {
            label: 'Total de Empresas',
            value: totalCompanies,
            icon: Building2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            label: 'Empresas Ativas',
            value: activeCompanies,
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            label: 'MRR (Receita Mensal)',
            value: `R$ ${mrr.toLocaleString('pt-BR')}`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
            label: 'Em Trial',
            value: trialCompanies,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h2>
                <p className="text-muted-foreground mt-1">
                    Bem-vindo, {user?.name}! Visão geral da plataforma BeautyFlow.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:shadow-md transition-shadow">
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

            {/* Companies List */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <CardTitle>Empresas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {companies.map((company) => {
                            const plan = plans.find(p => p.id === company.planId)
                            const statusColors = {
                                active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                                trial: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
                                suspended: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                                inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
                                pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }

                            return (
                                <div key={company.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                                            {company.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{company.fullName}</h3>
                                            <p className="text-sm text-muted-foreground">{company.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{plan?.name}</p>
                                            <p className="text-xs text-muted-foreground">R$ {plan?.price}/mês</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[company.status]}`}>
                                            {company.status === 'active' && 'Ativa'}
                                            {company.status === 'trial' && 'Trial'}
                                            {company.status === 'suspended' && 'Suspensa'}
                                            {company.status === 'inactive' && 'Inativa'}
                                            {company.status === 'pending' && 'Pendente'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Alerts */}
            {suspendedCompanies > 0 && (
                <Card className="rounded-2xl border-none shadow-sm bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-sm text-red-600 dark:text-red-400">
                                <strong>{suspendedCompanies}</strong> empresa(s) suspensa(s) por falta de pagamento
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
