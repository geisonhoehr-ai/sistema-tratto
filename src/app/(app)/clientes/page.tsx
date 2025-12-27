"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Edit, Trash2 } from "lucide-react"
import { clients } from "@/mocks/data"
import { useTenant } from "@/contexts/tenant-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState("")
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

    const filteredClients = tenantClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                        Gerencie sua base de clientes e histórico.
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

            {/* Filters */}
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

            {/* Clients Table */}
            <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm overflow-hidden">
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
        </div>
    )
}
