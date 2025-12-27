"use client"

import { useState } from "react"
import { employees as initialEmployees, services, type Employee } from "@/mocks/services"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FormDialog } from "@/components/ui/form-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Search, Plus, Edit, Trash2, Clock, Percent, UserCheck, Calendar } from "lucide-react"

const weekDays = [
    { id: 'monday', label: 'Segunda' },
    { id: 'tuesday', label: 'Terça' },
    { id: 'wednesday', label: 'Quarta' },
    { id: 'thursday', label: 'Quinta' },
    { id: 'friday', label: 'Sexta' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' }
]

export default function FuncionariosPage() {
    const [employees, setEmployees] = useState(initialEmployees)
    const [searchTerm, setSearchTerm] = useState("")
    const [showNewEmployee, setShowNewEmployee] = useState(false)
    const [showEditEmployee, setShowEditEmployee] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialties: [] as string[],
        workingHours: {} as { [key: string]: { start: string, end: string }[] },
        commission: 40,
        acceptsOnlineBooking: true,
        roundRobinEnabled: true
    })

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreateEmployee = () => {
        const newEmployee: Employee = {
            id: String(employees.length + 1),
            tenantId: '1',
            ...formData,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setEmployees([...employees, newEmployee])
        setShowNewEmployee(false)
        resetForm()
    }

    const handleEditEmployee = () => {
        if (!selectedEmployee) return

        setEmployees(employees.map(e =>
            e.id === selectedEmployee.id
                ? { ...e, ...formData, updatedAt: new Date().toISOString() }
                : e
        ))
        setShowEditEmployee(false)
        resetForm()
    }

    const handleDeleteEmployee = (employee: Employee) => {
        setEmployees(employees.filter(e => e.id !== employee.id))
        setShowConfirm(false)
    }

    const openEditDialog = (employee: Employee) => {
        setSelectedEmployee(employee)
        setFormData({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            specialties: employee.specialties,
            workingHours: employee.workingHours,
            commission: employee.commission,
            acceptsOnlineBooking: employee.acceptsOnlineBooking,
            roundRobinEnabled: employee.roundRobinEnabled
        })
        setShowEditEmployee(true)
    }

    const openDeleteDialog = (employee: Employee) => {
        setSelectedEmployee(employee)
        setShowConfirm(true)
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            specialties: [],
            workingHours: {},
            commission: 40,
            acceptsOnlineBooking: true,
            roundRobinEnabled: true
        })
        setSelectedEmployee(null)
    }

    const toggleSpecialty = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(serviceId)
                ? prev.specialties.filter(id => id !== serviceId)
                : [...prev.specialties, serviceId]
        }))
    }

    const setWorkingHours = (day: string, start: string, end: string) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: [{ start, end }]
            }
        }))
    }

    const removeWorkingDay = (day: string) => {
        setFormData(prev => {
            const newHours = { ...prev.workingHours }
            delete newHours[day]
            return { ...prev, workingHours: newHours }
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie a equipe do seu salão
                    </p>
                </div>
                <Button onClick={() => setShowNewEmployee(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Funcionário
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
                                <TableHead>Funcionário</TableHead>
                                <TableHead>Especialidades</TableHead>
                                <TableHead>Horário</TableHead>
                                <TableHead>Comissão</TableHead>
                                <TableHead>Round-Robin</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{employee.name}</p>
                                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {employee.specialties.slice(0, 2).map(specId => {
                                                const service = services.find(s => s.id === specId)
                                                return service ? (
                                                    <Badge key={specId} variant="outline" className="text-xs">
                                                        {service.name}
                                                    </Badge>
                                                ) : null
                                            })}
                                            {employee.specialties.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{employee.specialties.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="w-3 h-3" />
                                            {Object.keys(employee.workingHours).length} dias/semana
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-medium">
                                            <Percent className="w-3 h-3" />
                                            {employee.commission}%
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {employee.roundRobinEnabled ? (
                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                <UserCheck className="w-3 h-3 mr-1" />
                                                Ativo
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Inativo</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(employee)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => openDeleteDialog(employee)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal Novo Funcionário */}
            <FormDialog
                open={showNewEmployee}
                onOpenChange={setShowNewEmployee}
                title="Novo Funcionário"
                description="Cadastre um novo membro da equipe"
                onSubmit={handleCreateEmployee}
                submitLabel="Criar Funcionário"
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
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
                                placeholder="maria@salao.com"
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

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Especialidades</h4>
                        <div className="space-y-2">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`service-${service.id}`}
                                        checked={formData.specialties.includes(service.id)}
                                        onCheckedChange={() => toggleSpecialty(service.id)}
                                    />
                                    <label
                                        htmlFor={`service-${service.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {service.name} ({service.category})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Horário de Trabalho</h4>
                        <div className="space-y-3">
                            {weekDays.map(day => (
                                <div key={day.id} className="flex items-center gap-3">
                                    <div className="w-24">
                                        <Label className="text-sm">{day.label}</Label>
                                    </div>
                                    <Input
                                        type="time"
                                        placeholder="09:00"
                                        value={formData.workingHours[day.id]?.[0]?.start || ''}
                                        onChange={(e) => setWorkingHours(
                                            day.id,
                                            e.target.value,
                                            formData.workingHours[day.id]?.[0]?.end || '18:00'
                                        )}
                                        className="w-28"
                                    />
                                    <span className="text-muted-foreground">até</span>
                                    <Input
                                        type="time"
                                        placeholder="18:00"
                                        value={formData.workingHours[day.id]?.[0]?.end || ''}
                                        onChange={(e) => setWorkingHours(
                                            day.id,
                                            formData.workingHours[day.id]?.[0]?.start || '09:00',
                                            e.target.value
                                        )}
                                        className="w-28"
                                    />
                                    {formData.workingHours[day.id] && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeWorkingDay(day.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Configurações</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="commission">Comissão (%)</Label>
                                <Input
                                    id="commission"
                                    type="number"
                                    value={formData.commission}
                                    onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Agendamento Online</Label>
                                    <p className="text-sm text-muted-foreground">Aceitar agendamentos online</p>
                                </div>
                                <Switch
                                    checked={formData.acceptsOnlineBooking}
                                    onCheckedChange={(checked) => setFormData({ ...formData, acceptsOnlineBooking: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Round-Robin</Label>
                                    <p className="text-sm text-muted-foreground">Distribuição automática de clientes</p>
                                </div>
                                <Switch
                                    checked={formData.roundRobinEnabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, roundRobinEnabled: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FormDialog>

            {/* Modal Editar (mesmo formulário) */}
            <FormDialog
                open={showEditEmployee}
                onOpenChange={setShowEditEmployee}
                title="Editar Funcionário"
                description={`Editando ${selectedEmployee?.name}`}
                onSubmit={handleEditEmployee}
                submitLabel="Salvar Alterações"
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Mesmo conteúdo do formulário de criar */}
                    <p className="text-sm text-muted-foreground">Use o mesmo formulário do modal de criar</p>
                </div>
            </FormDialog>

            {/* Confirm Delete */}
            {selectedEmployee && (
                <ConfirmDialog
                    open={showConfirm}
                    onOpenChange={setShowConfirm}
                    title="Excluir Funcionário"
                    description={`Tem certeza que deseja excluir "${selectedEmployee.name}"? Esta ação não pode ser desfeita.`}
                    onConfirm={() => handleDeleteEmployee(selectedEmployee)}
                    variant="destructive"
                    confirmLabel="Excluir"
                />
            )}
        </div>
    )
}
