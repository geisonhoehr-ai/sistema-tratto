"use client"

import { useState } from "react"
import { companies as initialCompanies, plans, type Company } from "@/mocks/companies"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormDialog } from "@/components/ui/form-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { Search, MoreVertical, CheckCircle, XCircle, Pause, Play, Edit } from "lucide-react"

export default function EmpresasPage() {
    const [companies, setCompanies] = useState(initialCompanies)
    const [searchTerm, setSearchTerm] = useState("")

    // Modals state
    const [showNewCompany, setShowNewCompany] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    const [confirmAction, setConfirmAction] = useState<{ title: string, description: string, action: () => void } | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        planId: "starter",
        logo: "🏢"
    })

    const filteredCompanies = companies.filter(company =>
        company.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        const variants = {
            active: { label: 'Ativa', className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
            trial: { label: 'Trial', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
            suspended: { label: 'Suspensa', className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
            inactive: { label: 'Inativa', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' },
            pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' }
        }
        const variant = variants[status as keyof typeof variants] || variants.inactive
        return <Badge className={variant.className}>{variant.label}</Badge>
    }

    const handleCreateCompany = () => {
        const plan = plans.find(p => p.id === formData.planId)!
        const newCompany: Company = {
            id: String(companies.length + 1),
            name: formData.name,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            logo: formData.logo,
            primaryColor: '#8B5CF6',
            secondaryColor: '#A78BFA',
            customDomain: `${formData.name.toLowerCase().replace(/\s/g, '')}.beautyflow.app`,
            planId: formData.planId,
            status: 'trial',
            subscriptionStartDate: new Date().toISOString().split('T')[0],
            subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            maxEmployees: plan.maxEmployees,
            maxAppointmentsPerMonth: plan.maxAppointmentsPerMonth,
            currentEmployees: 0,
            currentAppointmentsThisMonth: 0,
            totalRevenue: 0,
            monthlyRevenue: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setCompanies([...companies, newCompany])
        setShowNewCompany(false)
        setFormData({ name: "", fullName: "", email: "", phone: "", address: "", planId: "starter", logo: "🏢" })
    }

    const handleSuspend = (company: Company) => {
        setConfirmAction({
            title: "Suspender Empresa",
            description: `Tem certeza que deseja suspender "${company.fullName}"? A empresa não poderá acessar o sistema até ser reativada.`,
            action: () => {
                setCompanies(companies.map(c =>
                    c.id === company.id ? { ...c, status: 'suspended' as const } : c
                ))
                setShowConfirm(false)
            }
        })
        setShowConfirm(true)
    }

    const handleReactivate = (company: Company) => {
        setCompanies(companies.map(c =>
            c.id === company.id ? { ...c, status: 'active' as const } : c
        ))
    }

    const handleDeactivate = (company: Company) => {
        setConfirmAction({
            title: "Desativar Empresa",
            description: `Tem certeza que deseja desativar "${company.fullName}"? Esta ação pode ser revertida posteriormente.`,
            action: () => {
                setCompanies(companies.map(c =>
                    c.id === company.id ? { ...c, status: 'inactive' as const } : c
                ))
                setShowConfirm(false)
            }
        })
        setShowConfirm(true)
    }

    const handleViewDetails = (company: Company) => {
        setSelectedCompany(company)
        setShowDetails(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Empresas</h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie todas as empresas cadastradas na plataforma
                    </p>
                </div>
                <Button onClick={() => setShowNewCompany(true)}>
                    Nova Empresa
                </Button>
            </div>

            {/* Search */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Empresa</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Funcionários</TableHead>
                                <TableHead>Receita Mensal</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCompanies.map((company) => {
                                const plan = plans.find(p => p.id === company.planId)
                                return (
                                    <TableRow key={company.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {company.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{company.fullName}</p>
                                                    <p className="text-sm text-muted-foreground">{company.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{plan?.name}</p>
                                                <p className="text-sm text-muted-foreground">R$ {plan?.price}/mês</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(company.status)}</TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {company.currentEmployees}
                                                {company.maxEmployees > 0 && ` / ${company.maxEmployees}`}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                R$ {company.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDetails(company)}>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Ver Detalhes
                                                    </DropdownMenuItem>
                                                    {company.status === 'active' && (
                                                        <DropdownMenuItem
                                                            className="text-orange-600"
                                                            onClick={() => handleSuspend(company)}
                                                        >
                                                            <Pause className="w-4 h-4 mr-2" />
                                                            Suspender
                                                        </DropdownMenuItem>
                                                    )}
                                                    {company.status === 'suspended' && (
                                                        <DropdownMenuItem
                                                            className="text-green-600"
                                                            onClick={() => handleReactivate(company)}
                                                        >
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Reativar
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeactivate(company)}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Desativar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal Nova Empresa */}
            <FormDialog
                open={showNewCompany}
                onOpenChange={setShowNewCompany}
                title="Nova Empresa"
                description="Cadastre uma nova empresa na plataforma"
                onSubmit={handleCreateCompany}
                submitLabel="Criar Empresa"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Curto</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Beleza Pura"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Salão Beleza Pura"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contato@belezapura.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(11) 99999-9999"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Rua, número, bairro, cidade"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="planId">Plano</Label>
                            <Select value={formData.planId} onValueChange={(value) => setFormData({ ...formData, planId: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map(plan => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name} - R$ {plan.price}/mês
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Drawer Detalhes */}
            {selectedCompany && (
                <DetailDrawer
                    open={showDetails}
                    onClose={() => setShowDetails(false)}
                    title={selectedCompany.fullName}
                    description={selectedCompany.email}
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {selectedCompany.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{selectedCompany.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{selectedCompany.customDomain}</p>
                                {getStatusBadge(selectedCompany.status)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Informações de Contato</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> {selectedCompany.email}</p>
                                    <p><strong>Telefone:</strong> {selectedCompany.phone}</p>
                                    <p><strong>Endereço:</strong> {selectedCompany.address}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Plano e Assinatura</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Plano:</strong> {plans.find(p => p.id === selectedCompany.planId)?.name}</p>
                                    <p><strong>Início:</strong> {new Date(selectedCompany.subscriptionStartDate).toLocaleDateString('pt-BR')}</p>
                                    <p><strong>Vencimento:</strong> {new Date(selectedCompany.subscriptionEndDate).toLocaleDateString('pt-BR')}</p>
                                    {selectedCompany.trialEndsAt && (
                                        <p><strong>Trial até:</strong> {new Date(selectedCompany.trialEndsAt).toLocaleDateString('pt-BR')}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Uso</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Funcionários:</strong> {selectedCompany.currentEmployees} / {selectedCompany.maxEmployees > 0 ? selectedCompany.maxEmployees : '∞'}</p>
                                    <p><strong>Agendamentos (mês):</strong> {selectedCompany.currentAppointmentsThisMonth} / {selectedCompany.maxAppointmentsPerMonth > 0 ? selectedCompany.maxAppointmentsPerMonth : '∞'}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Financeiro</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Receita Mensal:</strong> R$ {selectedCompany.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <p><strong>Receita Total:</strong> R$ {selectedCompany.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Empresa
                        </Button>
                    </div>
                </DetailDrawer>
            )}

            {/* Confirm Dialog */}
            {confirmAction && (
                <ConfirmDialog
                    open={showConfirm}
                    onOpenChange={setShowConfirm}
                    title={confirmAction.title}
                    description={confirmAction.description}
                    onConfirm={confirmAction.action}
                    variant="destructive"
                    confirmLabel="Confirmar"
                />
            )}
        </div>
    )
}
