"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ArrowRight, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { tenants } from "@/mocks/tenants"
import { mockCustomers, type Customer } from "@/mocks/customers"
import { Badge } from "@/components/ui/badge"
import { cn, getInitials } from "@/lib/utils"

const normalizeCpf = (value: string) => value.replace(/\D/g, "")

const findCustomerByIdentifier = (identifier: string): Customer | undefined => {
    if (!identifier) return undefined
    if (identifier.includes("@")) {
        return mockCustomers.find((customer) => customer.email.toLowerCase() === identifier.toLowerCase())
    }
    const cpf = normalizeCpf(identifier)
    return mockCustomers.find((customer) => normalizeCpf(customer.cpf) === cpf)
}

export default function CustomerLoginPage() {
    const params = useParams()
    const router = useRouter()
    const tenantSlug = params.tenantSlug as string

    const tenant = useMemo(() => {
        return tenants.find(t => t.slug === tenantSlug) || tenants[0]
    }, [tenantSlug])

    const tenantInitials = useMemo(() => getInitials(tenant.fullName || tenant.name), [tenant.fullName, tenant.name])
    const tenantBadge = tenant.logo || tenantInitials || "BF"

    const [identifier, setIdentifier] = useState("")
    const [stage, setStage] = useState<'identify' | 'password' | 'signup'>('identify')
    const [password, setPassword] = useState("")
    const [detectedCustomer, setDetectedCustomer] = useState<Customer | null>(null)
    const [error, setError] = useState("")

    const resetFlow = () => {
        setStage('identify')
        setDetectedCustomer(null)
        setPassword("")
        setError("")
    }

    const handleIdentify = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const customer = findCustomerByIdentifier(identifier)
        if (customer) {
            setDetectedCustomer(customer)
            setStage('password')
            setPassword("")
        } else {
            setDetectedCustomer(null)
            setStage('signup')
        }
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (!detectedCustomer) return
        if (detectedCustomer.password === password) {
            router.push(`/${tenantSlug}/profile?email=${detectedCustomer.email}`)
        } else {
            setError("Senha incorreta. Tente novamente.")
        }
    }

    const loginSteps = [
        { id: 'identify', label: 'Identificação' },
        { id: 'password', label: 'Confirmação' },
        { id: 'signup', label: 'Primeiro acesso' },
    ]
    const currentStepIndex = loginSteps.findIndex(stepItem => stepItem.id === stage)

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-40" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 relative z-10"
            >
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-blue-500/30">
                        {tenantBadge}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Área do Cliente</h1>
                        <p className="text-gray-600 dark:text-zinc-400 font-medium">Acesse seus agendamentos e pontos em {tenant.name}.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {loginSteps.map((stepItem, index) => (
                        <div
                            key={stepItem.id}
                            className={cn(
                                "flex-1 h-2 rounded-full transition-all",
                                index <= currentStepIndex ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200 dark:bg-zinc-800"
                            )}
                        />
                    ))}
                </div>

                <Card className="p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 shadow-2xl space-y-8">
                    {stage === 'identify' && (
                        <form onSubmit={handleIdentify} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    CPF ou e-mail
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="000.000.000-00 ou voce@email.com"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Identificaremos automaticamente se você já possui cadastro.
                                </p>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-red-500 text-center">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                            >
                                Continuar
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </form>
                    )}

                    {stage === 'password' && detectedCustomer && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                    {detectedCustomer.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 dark:text-white">{detectedCustomer.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400">{detectedCustomer.email}</p>
                                </div>
                                <Badge variant="outline" className="rounded-full border-blue-200 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                                    Cliente
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Senha</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-red-500 text-center">{error}</p>
                            )}

                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    Entrar
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={resetFlow}
                                    className="w-full h-10 rounded-xl text-gray-500 hover:text-blue-600"
                                >
                                    Não é você? Informar outro CPF/E-mail
                                </Button>
                            </div>
                        </form>
                    )}

                    {stage === 'signup' && (
                        <div className="space-y-6 text-center">
                            <Badge className="mx-auto w-fit bg-blue-50 text-blue-600 border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                                Primeiro acesso
                            </Badge>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Ainda não encontramos você</h3>
                                <p className="text-sm text-gray-600 dark:text-zinc-400">
                                    Use o agendamento online para criar sua conta automaticamente e já garantir seu primeiro horário.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => router.push(`/${tenantSlug}/book`)}
                                    className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    Agendar e criar acesso
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={resetFlow}
                                    className="w-full h-10 rounded-xl text-gray-500 hover:text-blue-600"
                                >
                                    Tentar outro CPF/E-mail
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <Button
                    variant="ghost"
                    onClick={() => router.push(`/${tenantSlug}/book`)}
                    className="w-full text-gray-500 font-semibold hover:text-blue-600 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Voltar ao Agendamento
                </Button>
            </motion.div>
        </div>
    )
}
