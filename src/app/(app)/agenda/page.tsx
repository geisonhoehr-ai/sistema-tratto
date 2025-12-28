"use client"

import { useState } from "react"
import { format, addDays, parseISO, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { appointments } from "@/mocks/data"
import { services, employees } from "@/mocks/services"
import { useTenant } from "@/contexts/tenant-context"

// Generate time slots from 08:00 to 20:00
const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8)

export default function AgendaPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
    const { currentTenant } = useTenant()

    // Filter by current tenant
    const tenantEmployees = employees.filter(e => e.tenantId === currentTenant.id)
    const tenantAppointments = appointments.filter(apt => apt.tenantId === currentTenant.id)

    const nextDay = () => setCurrentDate(addDays(currentDate, 1))
    const prevDay = () => setCurrentDate(addDays(currentDate, -1))
    const today = () => setCurrentDate(new Date())

    // Filter appointments by selected employee and date
    const filteredAppointments = tenantAppointments.filter(apt => {
        const aptDate = parseISO(apt.date)
        const matchesDate = isSameDay(aptDate, currentDate)
        const matchesEmployee = selectedEmployee === "all" || apt.staffId === selectedEmployee
        return matchesDate && matchesEmployee
    })

    // Calculate appointment position with buffer times
    const getAppointmentWithBuffer = (apt: typeof tenantAppointments[0]) => {
        const service = services.find(s => s.id === apt.serviceId)
        const [hours, minutes] = apt.time.split(':').map(Number)

        // Calculate total time including buffers
        const bufferBefore = service?.bufferBefore || 0
        const bufferAfter = service?.bufferAfter || 0
        const serviceDuration = apt.duration

        const startMinute = (hours - 8) * 60 + minutes - bufferBefore
        const totalDuration = bufferBefore + serviceDuration + bufferAfter

        return {
            top: `${startMinute * 2}px`, // 1min = 2px
            height: `${totalDuration * 2}px`,
            serviceStart: bufferBefore * 2, // Where service actually starts
            serviceHeight: serviceDuration * 2,
            bufferBeforeHeight: bufferBefore * 2,
            bufferAfterHeight: bufferAfter * 2
        }
    }

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            confirmed: 'bg-green-100 text-green-700 border-green-200',
            completed: 'bg-gray-100 text-gray-700 border-gray-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        }
        return colors[status as keyof typeof colors] || colors.pending
    }

    // Group appointments by employee
    const employeesWithAppointments = selectedEmployee === "all"
        ? tenantEmployees
        : tenantEmployees.filter(e => e.id === selectedEmployee)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie os agendamentos do dia
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Agendamento
                </Button>
            </div>

            {/* Controls */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={prevDay}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={today}>
                            Hoje
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextDay}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 ml-4">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">
                                {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Todos os funcionários" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os funcionários</SelectItem>
                                {tenantEmployees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Calendar Grid */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden">
                <div className="flex">
                    {/* Time Column */}
                    <div className="w-20 border-r border-gray-200 dark:border-gray-800">
                        <div className="h-12 border-b border-gray-200 dark:border-gray-800" />
                        {timeSlots.map(hour => (
                            <div
                                key={hour}
                                className="h-[120px] border-b border-gray-200 dark:border-gray-800 px-2 py-1 text-xs text-muted-foreground"
                            >
                                {String(hour).padStart(2, '0')}:00
                            </div>
                        ))}
                    </div>

                    {/* Employee Columns */}
                    <div className="flex-1 flex overflow-x-auto">
                        {employeesWithAppointments.map(employee => {
                            const employeeAppointments = filteredAppointments.filter(
                                apt => apt.staffId === employee.id
                            )

                            return (
                                <div key={employee.id} className="flex-1 min-w-[250px] border-r border-gray-200 dark:border-gray-800 last:border-r-0">
                                    {/* Employee Header */}
                                    <div className="h-12 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                                        <div>
                                            <p className="font-medium text-sm">{employee.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {employee.specialties.length} especialidades
                                            </p>
                                        </div>
                                        {employee.roundRobinEnabled && (
                                            <Badge variant="outline" className="text-xs">
                                                Round-Robin
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Time Grid */}
                                    <div className="relative">
                                        {timeSlots.map(hour => (
                                            <div
                                                key={hour}
                                                className="h-[120px] border-b border-gray-200 dark:border-gray-800"
                                            />
                                        ))}

                                        {/* Appointments */}
                                        {employeeAppointments.map(apt => {
                                            const style = getAppointmentWithBuffer(apt)
                                            const service = services.find(s => s.id === apt.serviceId)

                                            return (
                                                <div
                                                    key={apt.id}
                                                    className="absolute left-1 right-1 rounded-lg overflow-hidden"
                                                    style={{
                                                        top: style.top,
                                                        height: style.height
                                                    }}
                                                >
                                                    {/* Buffer Before */}
                                                    {service && service.bufferBefore > 0 && (
                                                        <div
                                                            className="bg-gray-200/50 dark:bg-gray-700/50 border-b border-dashed border-gray-400"
                                                            style={{ height: `${style.bufferBeforeHeight}px` }}
                                                        >
                                                            <p className="text-[10px] text-center text-muted-foreground pt-1">
                                                                Preparação
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Main Service */}
                                                    <div
                                                        className={cn(
                                                            "px-2 py-1 border-l-4",
                                                            getStatusColor(apt.status)
                                                        )}
                                                        style={{ height: `${style.serviceHeight}px` }}
                                                    >
                                                        <p className="font-semibold text-xs truncate">
                                                            {apt.time} - {apt.customer}
                                                        </p>
                                                        <p className="text-xs truncate opacity-80">
                                                            {service?.name}
                                                        </p>
                                                        <Badge className="mt-1 text-[10px] h-4">
                                                            {apt.duration}min
                                                        </Badge>
                                                    </div>

                                                    {/* Buffer After */}
                                                    {service && service.bufferAfter > 0 && (
                                                        <div
                                                            className="bg-gray-200/50 dark:bg-gray-700/50 border-t border-dashed border-gray-400"
                                                            style={{ height: `${style.bufferAfterHeight}px` }}
                                                        >
                                                            <p className="text-[10px] text-center text-muted-foreground pt-1">
                                                                Limpeza
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Card>

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Legenda:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" />
                    <span>Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
                    <span>Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
                    <span>Concluído</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-200/50 border-dashed border border-gray-400" />
                    <span>Buffer Time</span>
                </div>
            </div>
        </div>
    )
}
