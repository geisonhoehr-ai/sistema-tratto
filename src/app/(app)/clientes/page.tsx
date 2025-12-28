"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Edit, Trash2, LayoutGrid, List as ListIcon, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { clients } from "@/mocks/data"
import { useTenant } from "@/contexts/tenant-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { FormDialog } from "@/components/ui/form-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { differenceInDays } from "date-fns"

const segments = [
    {
        id: "vip",
        label: "VIPs",
        description: "Ticket médio acima de R$ 1.000",
        filter: (client: any) => client.totalSpent >= 1000
    },
    {
        id: "recent",
        label: "Recentes",
        description: "Visitaram nos últimos 30 dias",
        filter: (client: any) => differenceInDays(new Date(), new Date(client.lastVisit)) <= 30
    },
    {
        id: "risk",
        label: "Em risco",
        description: "60+ dias sem visitar",
        filter: (client: any) => differenceInDays(new Date(), new Date(client.lastVisit)) > 60
    }
]

export default function ClientsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSegment, setSelectedSegment] = useState("all")
    const [showNewClient, setShowNewClient] = useState(false)
    const [showEditClient, setShowEditClient] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [clientsList, setClientsList] = useState(clients)
    const { currentTenant } = useTenant()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    })

    // Filter clients by current tenant
    const tenantClients = clientsList.filter(client => client.tenantId === currentTenant.id)

    const stats = useMemo(() => {
        const total = tenantClients.length
        const active = tenantClients.filter(client => client.status === "active").length
        const churned = tenantClients.filter(client => client.status === "churned").length
        const avgTicket = total ? tenantClients.reduce((acc, client) => acc + client.totalSpent, 0) / total : 0
        const retention = total ? Math.round((tenantClients.filter(client => differenceInDays(new Date(), new Date(client.lastVisit)) <= 30).length / total) * 100) : 0
        return { total, active, churned, avgTicket, retention }
    }, [tenantClients])

    const filteredClients = tenantClients
        .filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(client => {
            if (selectedSegment === "all") return true
            const segment = segments.find(segment => segment.id === selectedSegment)
            return segment ? segment.filter(client) : true
        })

    const handleCreateClient = () => {
        const newClient = {
            id: String(clientsList.length + 1),
            tenantId: currentTenant.id,
            ...formData,
            status: 'active',
            lastVisit: new Date().toISOString(),
            totalSpent: 0,
            avatar: ""
        }
        setClientsList([...clientsList, newClient])
        setShowNewClient(false)
        resetForm()
    }

    const handleEditClient = () => {
        setClientsList(clientsList.map(c =>
            c.id === selectedClient.id ? { ...c, ...formData } : c
        ))
        setShowEditClient(false)
        resetForm()
    }

    const handleDeleteClient = () => {
        setClientsList(clientsList.filter(c => c.id !== selectedClient.id))
        setShowConfirm(false)
        setSelectedClient(null)
    }

    const openEditDialog = (client: any) => {
        setSelectedClient(client)
        setFormData({
            name: client.name,
            email: client.email,
            phone: client.phone
        })
        setShowEditClient(true)
    }

    const openDeleteDialog = (client: any) => {
        setSelectedClient(client)
        setShowConfirm(true)
    }

    const resetForm = () => {
        setFormData({ name: "", email: "", phone: "" })
        setSelectedClient(null)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie sua base, segmente em grupos e ative campanhas.
                    </p>
                </div>

                <FormDialog
                    open={showNewClient}
                    onOpenChange={setShowNewClient}
                    title="Novo Cliente"
                    description="Cadastre um novo cliente no sistema"
                    onSubmit={handleCreateClient}
                    submitLabel="Criar Cliente"
                >
                    <div className="space-y-4 text-left">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Maria Silva"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="maria@exemplo.com"
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
                </FormDialog>

                <Button className="shrink-0 shadow-lg shadow-primary/20" onClick={() => setShowNewClient(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard label="Base ativa" value={stats.active} helper={`${stats.total} clientes`} />
                <StatCard label="Churn" value={stats.churned} helper="Últimos 30 dias" />
                <StatCard label="Retenção" value={`${stats.retention}%`} helper="Visitou em 30 dias" />
                <StatCard label="Ticket médio" value={`R$ ${stats.avgTicket.toFixed(0)}`} helper="por cliente" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <SegmentCard
                    active={selectedSegment === "all"}
                    label="Todos"
                    description="Base completa"
                    count={stats.total}
                    onClick={() => setSelectedSegment("all")}
                />
                {segments.map(segment => (
                    <SegmentCard
                        key={segment.id}
                        active={selectedSegment === segment.id}
                        label={segment.label}
                        description={segment.description}
                        count={tenantClients.filter(segment.filter).length}
                        onClick={() => setSelectedSegment(segment.id)}
                    />
                ))}
            </div>

            {/* Modals for Edit and Confirm */}
            <FormDialog
                open={showEditClient}
                onOpenChange={setShowEditClient}
                title="Editar Cliente"
                description={`Editando dados de ${selectedClient?.name}`}
                onSubmit={handleEditClient}
                submitLabel="Salvar Alterações"
            >
                <div className="space-y-4 text-left">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nome Completo</Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-phone">Telefone</Label>
                        <Input
                            id="edit-phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </FormDialog>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Excluir Cliente"
                description={`Tem certeza que deseja excluir "${selectedClient?.name}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleDeleteClient}
                variant="destructive"
            />

            {/* Filters & View Toggle */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-white/20 backdrop-blur-sm w-full max-w-md">
                    <div className="pl-3 text-muted-foreground">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        className="flex-1 bg-transparent border-none text-sm focus:outline-none p-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex bg-white/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-white/20 backdrop-blur-sm shadow-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "rounded-lg h-9 w-9 p-0 transition-all",
                            viewMode === 'grid' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "rounded-lg h-9 w-9 p-0 transition-all",
                            viewMode === 'list' ? "bg-white dark:bg-zinc-700 shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        <ListIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'list' ? (
                <>
                    <div className="hidden md:block rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm overflow-hidden">
                        <Table>
                        <TableHeader className="bg-black/5 dark:bg-white/5">
                            <TableRow className="hover:bg-transparent border-black/5 dark:border-white/5">
                                <TableHead className="w-[300px]">Cliente</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Última Visita</TableHead>
                                <TableHead className="text-right">Total Gasto</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.map((client) => (
                                <TableRow key={client.id} className="border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                                                <AvatarImage src={client.avatar} alt={client.name} />
                                                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-foreground">{client.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: #{client.id}</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {getClientTags(client).map(tag => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] rounded-full">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {client.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                {client.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${client.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                client.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                            {client.status === 'active' ? 'Ativo' :
                                                client.status === 'inactive' ? 'Inativo' : 'Churn'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(client.lastVisit).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        R$ {client.totalSpent.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={() => openEditDialog(client)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => openDeleteDialog(client)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    <div className="grid md:hidden grid-cols-1 gap-4">
                        {filteredClients.map(client => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onEdit={() => openEditDialog(client)}
                                onDelete={() => openDeleteDialog(client)}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onEdit={() => openEditDialog(client)}
                            onDelete={() => openDeleteDialog(client)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function ClientCard({ client, onEdit, onDelete }: { client: any, onEdit: () => void, onDelete: () => void }) {
    const tags = getClientTags(client)
    return (
        <div className="group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <Avatar className="h-14 w-14 border-4 border-white dark:border-zinc-800 shadow-md">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="bg-primary/5 text-primary font-black text-xl">{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                    <Button onClick={onEdit} variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-primary">
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={onDelete} variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{client.name}</h4>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{client.status}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="rounded-full text-[10px] uppercase tracking-widest">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-zinc-800 mb-6">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Última Visita</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        {new Date(client.lastVisit).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Gasto</p>
                    <p className="text-xs font-black text-emerald-500">
                        R$ {client.totalSpent.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    {client.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    {client.phone}
                </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-50 dark:border-zinc-800/50">
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-primary bg-primary/5 px-2 py-1 rounded-lg">
                    <Wallet className="w-3 h-3" /> Fidelidade Level 1
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary">
                    Histórico
                </Button>
            </div>
        </div>
    )
}

function getClientTags(client: any) {
    const tags: string[] = []
    const days = differenceInDays(new Date(), new Date(client.lastVisit))
    if (client.totalSpent >= 1000) tags.push("VIP")
    if (days <= 30) tags.push("Recente")
    if (days > 60) tags.push("Reativar")
    if (client.status === "churned") tags.push("Churn")
    return tags
}

function StatCard({ label, value, helper }: { label: string, value: string | number, helper: string }) {
    return (
        <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{value}</p>
            <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
    )
}

function SegmentCard({ label, description, count, active, onClick }: { label: string, description: string, count: number, active: boolean, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4 text-left transition-all",
                active ? "shadow-lg ring-2 ring-primary/30" : "hover:shadow-md"
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Badge variant={active ? "default" : "secondary"} className="rounded-full">
                    {count}
                </Badge>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary/60">Segmento</div>
        </button>
    )
}
