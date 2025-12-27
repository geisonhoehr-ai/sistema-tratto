"use client"

import { useState } from "react"
import { Save, Upload, Palette } from "lucide-react"
import { useTenant } from "@/contexts/tenant-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"

export default function ConfiguracoesPage() {
    const { currentTenant, setCurrentTenant, allTenants } = useTenant()

    const [primaryColor, setPrimaryColor] = useState(currentTenant.customPrimaryColor || currentTenant.primaryColor)
    const [secondaryColor, setSecondaryColor] = useState(currentTenant.customSecondaryColor || currentTenant.secondaryColor)
    const [customDomain, setCustomDomain] = useState(currentTenant.customDomain || '')
    const [logoPreview, setLogoPreview] = useState(currentTenant.customLogo || '')

    const handleSave = () => {
        // Update tenant with new branding
        const updatedTenant = {
            ...currentTenant,
            customPrimaryColor: primaryColor,
            customSecondaryColor: secondaryColor,
            customDomain: customDomain,
            customLogo: logoPreview
        }

        setCurrentTenant(updatedTenant)

        // Apply theme colors to CSS variables
        document.documentElement.style.setProperty('--primary', primaryColor)
        document.documentElement.style.setProperty('--secondary', secondaryColor)

        alert('Configurações salvas com sucesso!')
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                <p className="text-muted-foreground mt-1">
                    Personalize a aparência e configurações da sua empresa
                </p>
            </div>

            {/* Branding Card */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Identidade Visual
                    </CardTitle>
                    <CardDescription>
                        Customize as cores e logo da sua empresa
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-3">
                        <Label>Logo da Empresa</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">{currentTenant.logo}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="logo-upload"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                    className="w-full sm:w-auto"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Logo
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    PNG, JPG ou SVG (máx. 2MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Color Pickers */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <ColorPicker
                            label="Cor Primária"
                            color={primaryColor}
                            onChange={setPrimaryColor}
                        />
                        <ColorPicker
                            label="Cor Secundária"
                            color={secondaryColor}
                            onChange={setSecondaryColor}
                        />
                    </div>

                    {/* Custom Domain */}
                    <div className="space-y-2">
                        <Label htmlFor="domain">Domínio Personalizado</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="domain"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="suaempresa.beautyflow.app"
                                className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground">.beautyflow.app</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Este será o endereço exclusivo da sua empresa
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Company Info Card */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <CardTitle>Informações da Empresa</CardTitle>
                    <CardDescription>
                        Dados básicos da sua empresa
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Nome da Empresa</Label>
                            <Input
                                id="company-name"
                                defaultValue={currentTenant.fullName}
                                placeholder="Nome completo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-phone">Telefone</Label>
                            <Input
                                id="company-phone"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company-email">Email</Label>
                        <Input
                            id="company-email"
                            type="email"
                            placeholder="contato@suaempresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company-address">Endereço</Label>
                        <Input
                            id="company-address"
                            placeholder="Rua, número, bairro, cidade"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    size="lg"
                    className="shadow-lg shadow-primary/20"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações
                </Button>
            </div>
        </div>
    )
}
