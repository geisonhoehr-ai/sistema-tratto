"use client"

import { useState } from "react"
import { services as initialServices, type Service } from "@/mocks/services"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FormDialog } from "@/components/ui/form-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Search, Plus, Edit, Trash2, Clock, DollarSign, Users, MoreVertical } from "lucide-react"

const categories = ["Cabelo", "Unhas", "Maquiagem", "Estética", "Massagem", "Depilação", "Sobrancelha"]

export default function ServicosPage() {
    const [services, setServices] = useState(initialServices)
    const [searchTerm, setSearchTerm] = useState("")
    const [showNewService, setShowNewService] = useState(false)
    const [showEditService, setShowEditService] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        category: "Cabelo",
        duration: 60,
        price: 0,
        description: "",
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: true,
        bufferBefore: 5,
        bufferAfter: 10,
        maxClientsPerSlot: 1,
        requiredStaff: 1
    })

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateService = () => {
        const newService: Service = {
            id: String(services.length + 1),
            tenantId: '1',
            ...formData,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setServices([...services, newService])
        setShowNewService(false)
        resetForm()
    }

    const handleEditService = () => {
        if (!selectedService) return

        setServices(services.map(s =>
            s.id === selectedService.id
                ? { ...s, ...formData, updatedAt: new Date().toISOString() }
                : s
        ))
        setShowEditService(false)
        resetForm()
    }

    const handleDeleteService = (service: Service) => {
        setServices(services.filter(s => s.id !== service.id))
        setShowConfirm(false)
    }

    const openEditDialog = (service: Service) => {
        setSelectedService(service)
        setFormData({
            name: service.name,
            category: service.category,
            duration: service.duration,
            price: service.price,
            description: service.description,
            requiresDeposit: service.requiresDeposit,
            depositAmount: service.depositAmount,
            allowOnlineBooking: service.allowOnlineBooking,
            bufferBefore: service.bufferBefore,
            bufferAfter: service.bufferAfter,
            maxClientsPerSlot: service.maxClientsPerSlot,
            requiredStaff: service.requiredStaff
        })
        setShowEditService(true)
    }

    const openDeleteDialog = (service: Service) => {
        setSelectedService(service)
        setShowConfirm(true)
    }

    const resetForm = () => {
        setFormData({
            name: "",
            category: "Cabelo",
            duration: 60,
            price: 0,
            description: "",
            requiresDeposit: false,
            depositAmount: 0,
            allowOnlineBooking: true,
            bufferBefore: 5,
            bufferAfter: 10,
            maxClientsPerSlot: 1,
            requiredStaff: 1
        })
        setSelectedService(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Serviços</h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie os serviços oferecidos pelo seu salão
                    </p>
                </div>
                <Button onClick={() => setShowNewService(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Serviço
                </Button>
            </div>

            {/* Search */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou categoria..."
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
                                <TableHead>Serviço</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Duração</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Buffer</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredServices.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{service.name}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{service.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Clock className="w-3 h-3" />
                                            {service.duration}min
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-medium">
                                            <DollarSign className="w-3 h-3" />
                                            R$ {service.price.toFixed(2)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {service.bufferBefore}min / {service.bufferAfter}min
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {service.maxClientsPerSlot > 1 ? (
                                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                <Users className="w-3 h-3 mr-1" />
                                                Grupo ({service.maxClientsPerSlot})
                                            </Badge>
                                        ) : service.requiredStaff > 1 ? (
                                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                                Collective ({service.requiredStaff})
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Individual</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={() => openEditDialog(service)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => openDeleteDialog(service)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal Novo Serviço */}
            <FormDialog
                open={showNewService}
                onOpenChange={setShowNewService}
                title="Novo Serviço"
                description="Cadastre um novo serviço oferecido pelo salão"
                onSubmit={handleCreateService}
                submitLabel="Criar Serviço"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name">Nome do Serviço</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Corte Feminino"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Preço (R$)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                placeholder="80.00"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duração (minutos)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                placeholder="60"
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descrição detalhada do serviço"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Buffer Times</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bufferBefore">Antes (min)</Label>
                                <Input
                                    id="bufferBefore"
                                    type="number"
                                    value={formData.bufferBefore}
                                    onChange={(e) => setFormData({ ...formData, bufferBefore: Number(e.target.value) })}
                                    placeholder="5"
                                />
                                <p className="text-xs text-muted-foreground">Tempo de preparação</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bufferAfter">Depois (min)</Label>
                                <Input
                                    id="bufferAfter"
                                    type="number"
                                    value={formData.bufferAfter}
                                    onChange={(e) => setFormData({ ...formData, bufferAfter: Number(e.target.value) })}
                                    placeholder="10"
                                />
                                <p className="text-xs text-muted-foreground">Tempo de limpeza</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Configurações Avançadas</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxClients">Máx. Clientes Simultâneos</Label>
                                    <Input
                                        id="maxClients"
                                        type="number"
                                        value={formData.maxClientsPerSlot}
                                        onChange={(e) => setFormData({ ...formData, maxClientsPerSlot: Number(e.target.value) })}
                                        min="1"
                                    />
                                    <p className="text-xs text-muted-foreground">1 = Individual, 2+ = Grupo</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="requiredStaff">Profissionais Necessários</Label>
                                    <Input
                                        id="requiredStaff"
                                        type="number"
                                        value={formData.requiredStaff}
                                        onChange={(e) => setFormData({ ...formData, requiredStaff: Number(e.target.value) })}
                                        min="1"
                                    />
                                    <p className="text-xs text-muted-foreground">Para collective events</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Agendamento Online</Label>
                                    <p className="text-sm text-muted-foreground">Permitir clientes agendarem online</p>
                                </div>
                                <Switch
                                    checked={formData.allowOnlineBooking}
                                    onCheckedChange={(checked) => setFormData({ ...formData, allowOnlineBooking: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Requer Sinal</Label>
                                    <p className="text-sm text-muted-foreground">Exigir pagamento antecipado</p>
                                </div>
                                <Switch
                                    checked={formData.requiresDeposit}
                                    onCheckedChange={(checked) => setFormData({ ...formData, requiresDeposit: checked })}
                                />
                            </div>

                            {formData.requiresDeposit && (
                                <div className="space-y-2">
                                    <Label htmlFor="depositAmount">Valor do Sinal (R$)</Label>
                                    <Input
                                        id="depositAmount"
                                        type="number"
                                        value={formData.depositAmount}
                                        onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                                        placeholder="50.00"
                                        step="0.01"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Modal Editar (mesmo formulário) */}
            <FormDialog
                open={showEditService}
                onOpenChange={setShowEditService}
                title="Editar Serviço"
                description={`Editando ${selectedService?.name}`}
                onSubmit={handleEditService}
                submitLabel="Salvar Alterações"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-name">Nome do Serviço</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Categoria</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Preço (R$)</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-duration">Duração (minutos)</Label>
                            <Input
                                id="edit-duration"
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-description">Descrição</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Buffer Times</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-bufferBefore">Antes (min)</Label>
                                <Input
                                    id="edit-bufferBefore"
                                    type="number"
                                    value={formData.bufferBefore}
                                    onChange={(e) => setFormData({ ...formData, bufferBefore: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-bufferAfter">Depois (min)</Label>
                                <Input
                                    id="edit-bufferAfter"
                                    type="number"
                                    value={formData.bufferAfter}
                                    onChange={(e) => setFormData({ ...formData, bufferAfter: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Configurações Avançadas</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-maxClients">Máx. Clientes Simultâneos</Label>
                                    <Input
                                        id="edit-maxClients"
                                        type="number"
                                        value={formData.maxClientsPerSlot}
                                        onChange={(e) => setFormData({ ...formData, maxClientsPerSlot: Number(e.target.value) })}
                                        min="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-requiredStaff">Profissionais Necessários</Label>
                                    <Input
                                        id="edit-requiredStaff"
                                        type="number"
                                        value={formData.requiredStaff}
                                        onChange={(e) => setFormData({ ...formData, requiredStaff: Number(e.target.value) })}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Agendamento Online</Label>
                                </div>
                                <Switch
                                    checked={formData.allowOnlineBooking}
                                    onCheckedChange={(checked) => setFormData({ ...formData, allowOnlineBooking: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Requer Sinal</Label>
                                </div>
                                <Switch
                                    checked={formData.requiresDeposit}
                                    onCheckedChange={(checked) => setFormData({ ...formData, requiresDeposit: checked })}
                                />
                            </div>

                            {formData.requiresDeposit && (
                                <div className="space-y-2">
                                    <Label htmlFor="edit-depositAmount">Valor do Sinal (R$)</Label>
                                    <Input
                                        id="edit-depositAmount"
                                        type="number"
                                        value={formData.depositAmount}
                                        onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                                        step="0.01"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Confirm Delete */}
            {selectedService && (
                <ConfirmDialog
                    open={showConfirm}
                    onOpenChange={setShowConfirm}
                    title="Excluir Serviço"
                    description={`Tem certeza que deseja excluir "${selectedService.name}"? Esta ação não pode ser desfeita.`}
                    onConfirm={() => handleDeleteService(selectedService)}
                    variant="destructive"
                    confirmLabel="Excluir"
                />
            )}
        </div>
    )
}
