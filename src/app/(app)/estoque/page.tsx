"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { inventory as initialInventory, type Product } from "@/mocks/inventory"
import {
    Package,
    Plus,
    Search,
    Filter,
    ShoppingCart,
    Minus,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Barcode,
    Tag,
    Globe
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function EstoquePage() {
    // Mock inventory data
    const [products, setProducts] = useState(initialInventory)

    const [cart, setCart] = useState<{ productId: string, quantity: number }[]>([])

    const addToCart = (productId: string) => {
        const existing = cart.find(item => item.productId === productId)
        if (existing) {
            setCart(cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
            setCart([...cart, { productId, quantity: 1 }])
        }
    }

    const removeFromCart = (productId: string) => {
        const item = cart.find(i => i.productId === productId)
        if (item && item.quantity > 1) {
            setCart(cart.map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i))
        } else {
            setCart(cart.filter(i => i.productId !== productId))
        }
    }

    const cartTotal = cart.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId)
        return acc + (product?.price || 0) * item.quantity
    }, 0)

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Estoque & PDV</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Gestão de produtos e vendas diretas.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200">
                        <Barcode className="w-4 h-4 mr-2" /> Escanear Código
                    </Button>
                    <Button className="rounded-xl bg-primary text-white font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Novo Produto
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="pdv" className="space-y-8">
                <TabsList className="bg-slate-100 dark:bg-zinc-900 p-1 rounded-2xl h-14 w-full md:w-auto">
                    <TabsTrigger value="pdv" className="rounded-xl px-8 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 transition-all">
                        <ShoppingCart className="w-4 h-4 mr-2" /> Venda Rápida (PDV)
                    </TabsTrigger>
                    <TabsTrigger value="inventario" className="rounded-xl px-8 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 transition-all">
                        <Package className="w-4 h-4 mr-2" /> Inventário
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pdv" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Product Grid */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Buscar produto pelo nome ou categoria..."
                                    className="h-14 pl-12 rounded-2xl border-none bg-white dark:bg-zinc-900 shadow-sm focus:ring-primary"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {products.map(product => (
                                    <Card
                                        key={product.id}
                                        onClick={() => addToCart(product.id)}
                                        className="p-4 rounded-3xl border-none shadow-sm bg-white dark:bg-zinc-900 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors">
                                                📦
                                            </div>
                                            <Badge variant="outline" className="rounded-full border-slate-100 dark:border-zinc-800 font-bold text-[10px] uppercase">
                                                {product.category}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{product.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-lg font-black text-primary">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                <p className={cn(
                                                    "text-[10px] font-bold uppercase",
                                                    product.stock <= product.minStock ? "text-amber-500" : "text-slate-400"
                                                )}>
                                                    {product.stock} em estoque
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Cart Sidebar */}
                        <div className="space-y-6">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-zinc-900 p-8 sticky top-24 min-h-[500px] flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Carrinho</h3>
                                    <Badge className="bg-primary/10 text-primary border-none rounded-full px-3">
                                        {cart.reduce((acc, i) => acc + i.quantity, 0)} itens
                                    </Badge>
                                </div>

                                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-20">
                                            <ShoppingCart className="w-12 h-12 text-slate-300" />
                                            <p className="font-bold text-slate-400">Carrinho vazio</p>
                                        </div>
                                    ) : (
                                        cart.map(item => {
                                            const product = products.find(p => p.id === item.productId)!
                                            return (
                                                <div key={item.productId} className="flex items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{product.name}</h4>
                                                        <p className="text-xs text-slate-400">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} un.</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800 rounded-xl p-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.productId); }}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); addToCart(item.productId); }}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>

                                <div className="pt-8 space-y-6 border-t border-slate-50 dark:border-zinc-800 mt-auto">
                                    <div className="flex justify-between items-end">
                                        <p className="text-slate-400 text-sm font-bold">Total</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <Button
                                        disabled={cart.length === 0}
                                        className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 group"
                                    >
                                        Finalizar Venda
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="inventario">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-primary">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inventário Completo</h3>
                                    <p className="text-sm text-slate-500">Controle de entradas e saídas.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="rounded-xl border-slate-200">
                                    <Filter className="w-4 h-4 mr-2" /> Categorias
                                </Button>
                                <Button variant="outline" className="rounded-xl border-slate-200">
                                    <Plus className="w-4 h-4 mr-2" /> Ajustar Estoque
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {products.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-6 rounded-3xl border border-slate-50 dark:border-zinc-800 group hover:border-primary/20 hover:bg-primary/[0.01] transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-2xl">
                                            📦
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{product.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Badge variant="outline" className="rounded-full border-slate-100 font-bold text-[9px] uppercase">
                                                    {product.category}
                                                </Badge>
                                                <span className="text-xs font-bold text-slate-400">R$ {product.price},00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            {product.stock <= product.minStock ? (
                                                <Badge className="bg-amber-500/10 text-amber-500 border-none font-bold text-[10px] uppercase">
                                                    Baixo Estoque
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] uppercase">
                                                    Ok
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-center min-w-[80px]">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white">{product.stock}</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loja Online</p>
                                            <Switch
                                                checked={product.showOnline}
                                                onCheckedChange={(checked) => {
                                                    setProducts(products.map(p => p.id === product.id ? { ...p, showOnline: checked } : p))
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-primary">
                                                <Tag className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
