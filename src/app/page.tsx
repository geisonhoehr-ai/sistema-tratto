"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Calendar,
  Users,
  BarChart3,
  Sparkles,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Star,
  ChevronRight,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const heroStats = [
  { label: "Salões ativos", value: "320+" },
  { label: "Agendamentos/mês", value: "42k+" },
  { label: "Satisfação", value: "98%" },
]

const features = [
  {
    title: "Agenda Inteligente",
    description: "Sistema de agendamento com confirmações automáticas, lembretes por WhatsApp e gestão de horários em tempo real.",
    icon: Calendar,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "CRM Completo",
    description: "Relacionamento com clientes, histórico de atendimentos, preferências e campanhas de marketing integradas.",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Gestão Financeira",
    description: "Controle completo de receitas, despesas, comissões e relatórios gerenciais em tempo real.",
    icon: BarChart3,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Portal do Cliente",
    description: "Seus clientes agendam online 24/7, visualizam histórico e recebem notificações automáticas.",
    icon: Globe,
    gradient: "from-green-500 to-emerald-500",
  },
]

const benefits = [
  "Agende online 24/7 sem precisar atender telefone",
  "Reduza no-show em até 85% com lembretes automáticos",
  "Aumente o faturamento com upsell inteligente",
  "Gerencie múltiplas unidades em um único painel",
  "Relatórios gerenciais em tempo real",
  "Integração com WhatsApp e redes sociais",
]

const plans = [
  {
    name: "Starter",
    price: "197",
    period: "mês",
    description: "Perfeito para começar",
    features: [
      "Até 500 agendamentos/mês",
      "Portal de agendamento online",
      "CRM básico",
      "Relatórios essenciais",
      "Suporte por email",
    ],
    cta: "Começar agora",
    popular: false,
  },
  {
    name: "Professional",
    price: "397",
    period: "mês",
    description: "Para salões em crescimento",
    features: [
      "Agendamentos ilimitados",
      "Multi-unidades",
      "CRM avançado com automações",
      "Relatórios completos",
      "Suporte prioritário",
      "WhatsApp Business API",
    ],
    cta: "Testar grátis",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Solução personalizada",
    features: [
      "Tudo do Professional",
      "API customizada",
      "White label",
      "Gerente de conta dedicado",
      "SLA garantido",
      "Treinamento presencial",
    ],
    cta: "Falar com vendas",
    popular: false,
  },
]

const testimonials = [
  {
    name: "Mariana Silva",
    role: "Proprietária",
    company: "Espaço Bella Donna",
    quote: "Desde que implementamos o BeautyFlow, nosso no-show caiu de 30% para apenas 4%. O ROI foi absurdo.",
    rating: 5,
  },
  {
    name: "Roberto Ferreira",
    role: "Gerente",
    company: "Barber Premium",
    quote: "Gerenciar 3 unidades ficou muito mais fácil. Vejo tudo em tempo real e tomo decisões baseadas em dados.",
    rating: 5,
  },
  {
    name: "Amanda Costa",
    role: "Diretora",
    company: "Rede Glamour",
    quote: "O portal do cliente foi um divisor de águas. 70% dos agendamentos agora são feitos online, sem precisar atender telefone.",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">BeautyFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Clientes
            </a>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Entrar
              </Button>
            </Link>
            <Button size="sm" className="rounded-full bg-black hover:bg-gray-800 text-white">
              Começar grátis
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="rounded-full px-4 py-1.5 bg-black/5 text-black border-none text-xs font-medium mb-6">
                Transforme seu salão em um negócio digital
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
            >
              O sistema completo
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                para salões de beleza
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light"
            >
              Agenda inteligente, CRM, financeiro e portal do cliente. Tudo em uma única plataforma para você focar no que importa: seus clientes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button size="lg" className="rounded-full h-14 px-8 bg-black hover:bg-gray-800 text-white text-base font-medium gap-2">
                Começar teste grátis <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full h-14 px-8 text-base font-medium gap-2 group">
                <div className="w-10 h-10 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </div>
                Ver demonstração
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-16"
            >
              {heroStats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-sm font-semibold text-blue-600 mb-4 tracking-wide uppercase">Recursos</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Tudo que você precisa para crescer
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Ferramentas profissionais para automatizar, organizar e escalar seu negócio.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white h-full group cursor-pointer">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300",
                        feature.gradient
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-4 tracking-wide uppercase">Benefícios</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Simplifique sua operação
                </h2>
                <p className="text-xl text-gray-600 mb-8 font-light">
                  Automatize tarefas repetitivas e foque em oferecer a melhor experiência para seus clientes.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
                  <div className="w-full h-full rounded-2xl bg-white shadow-2xl flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Dashboard Preview</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-400 to-pink-600 opacity-20 blur-2xl" />
                <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-600 opacity-20 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-sm font-semibold text-blue-600 mb-4 tracking-wide uppercase">Preços</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Planos para cada momento
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Escolha o plano ideal para o seu negócio. Cancele quando quiser.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "p-8 border-2 bg-white h-full flex flex-col relative overflow-hidden",
                    plan.popular ? "border-blue-600 shadow-2xl scale-105" : "border-gray-200"
                  )}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                        Mais popular
                      </div>
                    )}
                    <div className="mb-8">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {plan.name}
                      </p>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price === "Custom" ? plan.price : `R$ ${plan.price}`}
                        </span>
                        {plan.period && (
                          <span className="text-gray-500">/{plan.period}</span>
                        )}
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "w-full rounded-full h-12 font-semibold",
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      )}
                    >
                      {plan.cta}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-sm font-semibold text-blue-600 mb-4 tracking-wide uppercase">Depoimentos</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Adorado por profissionais
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Veja o que nossos clientes têm a dizer sobre o BeautyFlow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white h-full">
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.company}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Pronto para transformar seu salão?
            </h2>
            <p className="text-xl text-gray-400 mb-10 font-light">
              Comece seu teste gratuito hoje. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full h-14 px-8 bg-white hover:bg-gray-100 text-black text-base font-semibold gap-2">
                Começar teste grátis <ArrowRight className="w-5 h-5" />
              </Button>
              <Link href="/login">
                <Button size="lg" variant="ghost" className="rounded-full h-14 px-8 text-white hover:bg-white/10 text-base font-medium">
                  Fazer login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">BeautyFlow</span>
              </div>
              <p className="text-sm text-gray-600">
                O sistema completo para salões de beleza modernos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Recursos</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Preços</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Sobre</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacidade</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2024 BeautyFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
