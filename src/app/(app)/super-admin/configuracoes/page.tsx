"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Settings, Mail, CreditCard, Bell } from "lucide-react"

export default function ConfiguracoesPage() {
    const [platformSettings, setPlatformSettings] = useState({
        platformName: "BeautyFlow",
        platformEmail: "suporte@beautyflow.com",
        platformDomain: "beautyflow.app",
        logo: "💎"
    })

    const [integrations, setIntegrations] = useState({
        stripeApiKey: "",
        mercadoPagoToken: "",
        sendgridApiKey: "",
        twilioAccountSid: "",
        twilioAuthToken: "",
        whatsappBusinessId: ""
    })

    const [notifications, setNotifications] = useState({
        emailOnNewCompany: true,
        emailOnPaymentReceived: true,
        emailOnPaymentFailed: true,
        emailOnTrialExpiring: true,
        smsOnCriticalEvents: false
    })

    const handleSavePlatform = () => {
        // Salvar configurações da plataforma
        alert("Configurações da plataforma salvas!")
    }

    const handleSaveIntegrations = () => {
        // Salvar integrações
        alert("Integrações salvas!")
    }

    const handleSaveNotifications = () => {
        // Salvar notificações
        alert("Configurações de notificações salvas!")
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                <p className="text-muted-foreground mt-1">
                    Gerencie as configurações da plataforma BeautyFlow
                </p>
            </div>

            {/* Plataforma */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        <CardTitle>Configurações da Plataforma</CardTitle>
                    </div>
                    <CardDescription>
                        Informações básicas e identidade da plataforma
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="platformName">Nome da Plataforma</Label>
                            <Input
                                id="platformName"
                                value={platformSettings.platformName}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="platformEmail">Email de Suporte</Label>
                            <Input
                                id="platformEmail"
                                type="email"
                                value={platformSettings.platformEmail}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, platformEmail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="platformDomain">Domínio Principal</Label>
                            <Input
                                id="platformDomain"
                                value={platformSettings.platformDomain}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, platformDomain: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo (Emoji)</Label>
                            <Input
                                id="logo"
                                value={platformSettings.logo}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, logo: e.target.value })}
                                maxLength={2}
                            />
                        </div>
                    </div>

                    <Button onClick={handleSavePlatform}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Configurações
                    </Button>
                </CardContent>
            </Card>

            {/* Integrações */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <CardTitle>Integrações</CardTitle>
                    </div>
                    <CardDescription>
                        Configure as integrações com serviços externos
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Pagamentos */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Pagamentos</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stripeApiKey">Stripe API Key</Label>
                                <Input
                                    id="stripeApiKey"
                                    type="password"
                                    value={integrations.stripeApiKey}
                                    onChange={(e) => setIntegrations({ ...integrations, stripeApiKey: e.target.value })}
                                    placeholder="sk_live_..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mercadoPagoToken">Mercado Pago Access Token</Label>
                                <Input
                                    id="mercadoPagoToken"
                                    type="password"
                                    value={integrations.mercadoPagoToken}
                                    onChange={(e) => setIntegrations({ ...integrations, mercadoPagoToken: e.target.value })}
                                    placeholder="APP_USR-..."
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Email */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Email Transacional</h4>
                        <div className="space-y-2">
                            <Label htmlFor="sendgridApiKey">SendGrid API Key</Label>
                            <Input
                                id="sendgridApiKey"
                                type="password"
                                value={integrations.sendgridApiKey}
                                onChange={(e) => setIntegrations({ ...integrations, sendgridApiKey: e.target.value })}
                                placeholder="SG...."
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* SMS/WhatsApp */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">SMS e WhatsApp</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="twilioAccountSid">Twilio Account SID</Label>
                                <Input
                                    id="twilioAccountSid"
                                    value={integrations.twilioAccountSid}
                                    onChange={(e) => setIntegrations({ ...integrations, twilioAccountSid: e.target.value })}
                                    placeholder="AC..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twilioAuthToken">Twilio Auth Token</Label>
                                <Input
                                    id="twilioAuthToken"
                                    type="password"
                                    value={integrations.twilioAuthToken}
                                    onChange={(e) => setIntegrations({ ...integrations, twilioAuthToken: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsappBusinessId">WhatsApp Business ID</Label>
                            <Input
                                id="whatsappBusinessId"
                                value={integrations.whatsappBusinessId}
                                onChange={(e) => setIntegrations({ ...integrations, whatsappBusinessId: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button onClick={handleSaveIntegrations}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Integrações
                    </Button>
                </CardContent>
            </Card>

            {/* Notificações */}
            <Card className="rounded-2xl border-none shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <CardTitle>Notificações</CardTitle>
                    </div>
                    <CardDescription>
                        Configure quando você deseja receber notificações
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Nova empresa cadastrada</Label>
                            <p className="text-sm text-muted-foreground">
                                Receber email quando uma nova empresa se cadastrar
                            </p>
                        </div>
                        <Switch
                            checked={notifications.emailOnNewCompany}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnNewCompany: checked })}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Pagamento recebido</Label>
                            <p className="text-sm text-muted-foreground">
                                Receber email quando um pagamento for confirmado
                            </p>
                        </div>
                        <Switch
                            checked={notifications.emailOnPaymentReceived}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnPaymentReceived: checked })}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Pagamento falhou</Label>
                            <p className="text-sm text-muted-foreground">
                                Receber email quando um pagamento falhar
                            </p>
                        </div>
                        <Switch
                            checked={notifications.emailOnPaymentFailed}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnPaymentFailed: checked })}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Trial expirando</Label>
                            <p className="text-sm text-muted-foreground">
                                Receber email 3 dias antes do trial de uma empresa expirar
                            </p>
                        </div>
                        <Switch
                            checked={notifications.emailOnTrialExpiring}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnTrialExpiring: checked })}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>SMS em eventos críticos</Label>
                            <p className="text-sm text-muted-foreground">
                                Receber SMS para eventos críticos (pagamentos falhados, etc)
                            </p>
                        </div>
                        <Switch
                            checked={notifications.smsOnCriticalEvents}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, smsOnCriticalEvents: checked })}
                        />
                    </div>

                    <Button onClick={handleSaveNotifications}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Notificações
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
