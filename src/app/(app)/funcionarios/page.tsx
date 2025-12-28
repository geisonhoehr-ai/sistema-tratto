"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Calendar,
    UserCheck,
    Percent,
    Smartphone,
    Mail,
    Sparkles,
    ShieldCheck,
    ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { FormDialog } from "@/components/ui/form-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { employees as initialEmployees, services, type Employee, type Service } from "@/mocks/services"
import { cn } from "@/lib/utils"

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
        emp.specialties.some(specId => {
            const service = services.find(s => s.id === specId)
            return service?.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
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

        setEmployees(employees.map(emp =>
            emp.id === selectedEmployee.id
                ? { ...emp, ...formData, updatedAt: new Date().toISOString() }
                : emp
        ))
        setShowEditEmployee(false)
        resetForm()
    }

    const handleDeleteEmployee = (employee: Employee) => {
        setEmployees(employees.filter(emp => emp.id !== employee.id))
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

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Equipe</h2>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Gestão de profissionais e talentos.</p>
                </div>
                <Button onClick={() => setShowNewEmployee(true)} className="rounded-xl h-12 px-6 bg-primary text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Profissional
                </Button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border-none shadow-sm">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nome ou especialidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl font-medium"
                    />
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{employees.length}</p>
                    </div>
                </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredEmployees.map((employee, idx) => (
                        <motion.div
                            key={employee.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="group relative overflow-hidden rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 p-8 hover:shadow-2xl transition-all duration-300">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl group-hover:scale-110 transition-transform">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => openEditDialog(employee)}
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl h-10 w-10 bg-slate-50 dark:bg-zinc-800/50 hover:bg-primary hover:text-white transition-all underline-none"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setSelectedEmployee(employee)
                                                    setShowConfirm(true)
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl h-10 w-10 bg-slate-50 dark:bg-zinc-800/50 hover:bg-red-500 hover:text-white transition-all underline-none"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{employee.name}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {employee.specialties.map(specId => {
                                                const service = services.find(s => s.id === specId)
                                                return (
                                                    <Badge key={specId} variant="secondary" className="bg-slate-100 dark:bg-zinc-800 text-[10px] py-0 border-none">
                                                        {service?.name || 'Serviço'}
                                                    </Badge>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-3 py-6 border-y border-slate-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-zinc-400">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{employee.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-zinc-400">
                                                <Percent className="w-4 h-4 text-emerald-500" />
                                                Comissão
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{employee.commission}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {employee.acceptsOnlineBooking && (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[9px] uppercase tracking-tighter">
                                                    Booking Ativo
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                            Agenda <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal Novo/Editar */}
            <FormDialog
                open={showNewEmployee || showEditEmployee}
                onOpenChange={showNewEmployee ? setShowNewEmployee : setShowEditEmployee}
                title={showNewEmployee ? "Novo Profissional" : "Editar Profissional"}
                description="Cadastre as informações e preferências do profissional."
                onSubmit={showNewEmployee ? handleCreateEmployee : handleEditEmployee}
                submitLabel={showNewEmployee ? "Concluir Cadastro" : "Salvar Alterações"}
            >
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 scrollbar-thin">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informações Básicas</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label className="text-xs font-bold uppercase">Nome Completo</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-xl h-12 bg-slate-50 dark:bg-zinc-800 border-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase">Email</Label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="rounded-xl h-12 bg-slate-50 dark:bg-zinc-800 border-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase">Telefone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="rounded-xl h-12 bg-slate-50 dark:bg-zinc-800 border-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidades</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                                    <Checkbox
                                        id={service.id}
                                        checked={formData.specialties.includes(service.id)}
                                        onCheckedChange={(checked) => toggleSpecialty(service.id)}
                                    />
                                    <label htmlFor={service.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {service.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferências & Financeiro</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase">Comissão (%)</Label>
                                <Input
                                    type="number"
                                    value={formData.commission}
                                    onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
                                    className="rounded-xl h-12 bg-slate-50 dark:bg-zinc-800 border-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold">Reserva Online</p>
                                    <p className="text-[10px] text-slate-400">Permitir que clientes agendem com este profissional</p>
                                </div>
                                <Switch
                                    checked={formData.acceptsOnlineBooking}
                                    onCheckedChange={(checked) => setFormData({ ...formData, acceptsOnlineBooking: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FormDialog>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Remover Profissional?"
                description="Esta ação removerá o acesso do profissional ao sistema. Os dados históricos permanecerão salvos."
                onConfirm={() => selectedEmployee && handleDeleteEmployee(selectedEmployee)}
                variant="destructive"
            />
        </div>
    )
}
