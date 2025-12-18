
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Zap,
  Receipt,
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  PackageSearch,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  CreditCard,
  History,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Insumo {
  id: string;
  name: string;
  qty: number;
}

interface Product {
  id: string;
  name: string;
  category: 'Neon' | 'Accesorios' | 'Servicios';
  price: number;
  stock: number;
  maxStock: number;
  image?: string;
  requiredInsumos?: Insumo[];
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

export const POSManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Neon' | 'Accesorios' | 'Servicios'>('Todos');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');

  // Stock de insumos simulado del ecosistema Aurum
  const [insumosStock] = useState<Record<string, number>>({
    'INS-001': 85,  // Manguera Neón (m)
    'INS-002': 15,  // Acrílico (láminas)
    'INS-003': 4,   // Transformadores (Bajo stock)
  });

  const products: Product[] = [
    { 
      id: 'POS-LX-001', name: 'Neón Flex Pro 5m', category: 'Neon', price: 1250, stock: 12, maxStock: 20,
      description: 'Manguera de alta fidelidad, grado industrial.',
      requiredInsumos: [{ id: 'INS-001', name: 'Manguera Neón', qty: 5 }] 
    },
    { 
      id: 'POS-LX-002', name: 'Instalación Premium', category: 'Servicios', price: 2800, stock: 99, maxStock: 100,
      description: 'Despliegue de equipo técnico oficial Aurum.'
    },
    { 
      id: 'POS-LX-003', name: 'Eliminador 12V 10A', category: 'Accesorios', price: 450, stock: 8, maxStock: 15,
      description: 'Fuente de poder con protección contra picos.',
      requiredInsumos: [{ id: 'INS-003', name: 'Transformador', qty: 1 }]
    },
    { 
      id: 'POS-LX-004', name: 'Letrero "Open" Std', category: 'Neon', price: 1850, stock: 3, maxStock: 10,
      description: 'Diseño pre-configurado para alta visibilidad.',
      requiredInsumos: [{ id: 'INS-001', name: 'Manguera Neón', qty: 3 }, { id: 'INS-002', name: 'Acrílico', qty: 0.5 }]
    },
    { 
      id: 'POS-LX-005', name: 'Diseño Vectorial IA', category: 'Servicios', price: 950, stock: 99, maxStock: 100,
      description: 'Optimización de trazado mediante motor Nexus.'
    },
    { 
      id: 'POS-LX-006', name: 'Kit Conectores X10', category: 'Accesorios', price: 220, stock: 0, maxStock: 25,
      description: 'Terminales rápidas para ensambles complejos.'
    },
  ];

  const addToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(current => current.filter(t => t.id !== id)), 4000);
  };

  const getAiRecommendation = async (currentCart: CartItem[]) => {
    if (currentCart.length === 0) {
      setAiSuggestions('');
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const itemsStr = currentCart.map(i => i.name).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `El cliente tiene: ${itemsStr}. Sugiere un servicio o accesorio de Luminaflex (Instalación, Diseño, Kit Conectores) para maximizar su satisfacción. Sé breve y ejecutivo. Máximo 15 palabras.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      setAiSuggestions(response.text || '');
    } catch (e) {
      console.error(e);
    }
  };

  const checkAvailability = (product: Product, targetQty: number) => {
    if (targetQty > product.stock) {
      addToast(`ERROR: Stock de producto final insuficiente (${product.name}).`, 'error');
      return false;
    }
    if (product.requiredInsumos) {
      for (const insumo of product.requiredInsumos) {
        const available = insumosStock[insumo.id] || 0;
        if (available < (insumo.qty * targetQty)) {
          addToast(`CRÍTICO: Materia prima "${insumo.name}" agotada en fábrica.`, 'error');
          return false;
        }
      }
    }
    return true;
  };

  const addToCart = (product: Product) => {
    const exists = cart.find(item => item.id === product.id);
    const nextQty = exists ? exists.quantity + 1 : 1;
    
    if (checkAvailability(product, nextQty)) {
      if (exists) {
        const newCart = cart.map(item => item.id === product.id ? { ...item, quantity: nextQty } : item);
        setCart(newCart);
        getAiRecommendation(newCart);
      } else {
        const newCart = [...cart, { ...product, quantity: 1 }];
        setCart(newCart);
        getAiRecommendation(newCart);
      }
      addToast(`${product.name} vinculado al ticket.`, 'success');
    }
  };

  const filteredProducts = products.filter(p => 
    (activeCategory === 'Todos' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] gap-8 animate-in fade-in duration-700 relative">
      
      {/* Sistema de Alertas Dinámicas */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[400] space-y-2 w-full max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl glass-panel border flex justify-between items-center shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 ${t.type === 'error' ? 'border-red-500/50 text-red-400' : 'border-[#4DEEEA]/50 text-[#4DEEEA]'}`}>
            <div className="flex items-center space-x-3">
              {t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Catálogo de Ingeniería */}
      <div className="flex-1 flex flex-col space-y-8 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0A0A0] group-focus-within:text-[#4DEEEA] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="COMANDAR BÚSQUEDA DE ACTIVOS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-tech tracking-[0.2em] focus:border-[#4DEEEA]/50 outline-none transition-all placeholder:text-white/10"
            />
          </div>
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
            {['Todos', 'Neon', 'Servicios', 'Accesorios'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-[#4DEEEA] to-[#00C6C3] text-black shadow-lg' : 'text-[#A0A0A0] hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(p => {
            const isOutOfStock = p.stock <= 0;
            const hasMissingInsumos = p.requiredInsumos?.some(i => (insumosStock[i.id] || 0) < i.qty);
            const isDisabled = isOutOfStock || hasMissingInsumos;
            const stockPercent = (p.stock / p.maxStock) * 100;

            return (
              <div 
                key={p.id}
                onClick={() => !isDisabled && addToCart(p)}
                className={`glass-panel p-8 rounded-[40px] border transition-all group relative overflow-hidden flex flex-col justify-between ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer border-white/5 hover:border-[#4DEEEA]/40 hover:bg-white/[0.02] neon-glow-hover'}`}
              >
                {/* Visualizador de Stock Metafísico */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                   <Box size={140} className="translate-x-12 -translate-y-12" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-mono text-[#4DEEEA] opacity-60 tracking-widest">{p.id}</span>
                    <div className={`p-2 rounded-xl transition-all ${isDisabled ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-[#A0A0A0] group-hover:bg-[#4DEEEA]/10 group-hover:text-[#4DEEEA]'}`}>
                      {isDisabled ? <X size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter leading-tight group-hover:text-[#4DEEEA] transition-colors">{p.name}</h4>
                  <p className="text-[10px] text-[#A0A0A0] uppercase mb-6 tracking-[0.2em] font-medium">{p.category}</p>
                  <p className="text-[11px] text-[#A0A0A0] leading-relaxed mb-8 opacity-60 group-hover:opacity-100 transition-opacity">{p.description}</p>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-[0.1em]">
                       <span className={isDisabled ? 'text-red-500' : 'text-[#A0A0A0]'}>{isDisabled ? 'Abastecimiento Crítico' : 'Stock en Nodo'}</span>
                       <span className={isDisabled ? 'text-red-500' : 'text-white'}>{p.stock} / {p.maxStock}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${isDisabled ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#4DEEEA] shadow-[0_0_8px_#4DEEEA]'}`} style={{ width: `${stockPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">Inversión</span>
                       <p className="text-2xl font-tech font-bold text-[#FFD700] tracking-tighter">$ {p.price.toLocaleString()}</p>
                    </div>
                    <button disabled={isDisabled} className={`p-3 rounded-2xl transition-all ${isDisabled ? 'bg-white/5' : 'bg-white/5 group-hover:bg-[#4DEEEA] group-hover:text-black group-hover:shadow-lg'}`}>
                       <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal de Liquidación (Ticket) */}
      <div className="w-full lg:w-[420px] glass-panel border-l border-white/10 flex flex-col rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-[#FFD700]/10 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-black/40 rounded-2xl border border-[#FFD700]/20 text-[#FFD700]">
              <Receipt size={24} />
            </div>
            <div>
              <h3 className="font-tech text-2xl font-bold uppercase tracking-tighter">Liquidación OS</h3>
              <p className="text-[9px] text-[#A0A0A0] uppercase font-mono tracking-widest">NODO: MX-741-POS | <span className="text-[#FFD700]/50">8888</span></p>
            </div>
          </div>
          <button onClick={() => setCart([])} className="p-2 text-white/20 hover:text-red-500 transition-colors"><History size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6 text-center">
              <PackageSearch size={80} strokeWidth={1} />
              <div className="space-y-2">
                <p className="text-sm uppercase font-bold tracking-[0.4em]">Terminal Vacía</p>
                <p className="text-[9px] uppercase tracking-widest">Escaneando activos para vinculación...</p>
              </div>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 flex flex-col space-y-4 group animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-white uppercase tracking-tight mb-1 truncate">{item.name}</p>
                      <p className="text-lg font-tech font-bold text-[#FFD700]">$ {item.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="p-2 text-white/10 hover:text-red-500 transition-colors"><X size={16} /></button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-1">
                        <Layers size={12} className="text-[#4DEEEA] opacity-40" />
                        <span className="text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">{item.category}</span>
                     </div>
                     <div className="flex items-center space-x-4 bg-black/40 rounded-2xl px-4 py-2 border border-white/5">
                        <button onClick={() => item.quantity > 1 && setCart(cart.map(i => i.id === item.id ? {...i, quantity: i.quantity - 1} : i))} className="text-[#A0A0A0] hover:text-[#4DEEEA] transition-colors"><Minus size={14} /></button>
                        <span className="text-sm font-tech font-bold w-6 text-center text-white">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="text-[#A0A0A0] hover:text-[#4DEEEA] transition-colors"><Plus size={14} /></button>
                     </div>
                  </div>
                </div>
              ))}
              
              {/* Sugerencia de Nexus AI */}
              {aiSuggestions && (
                <div className="p-6 bg-[#4DEEEA]/5 border border-[#4DEEEA]/20 rounded-[32px] flex items-start space-x-4 animate-in fade-in zoom-in duration-500">
                  <div className="p-2 bg-[#4DEEEA]/10 rounded-xl text-[#4DEEEA] shrink-0">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#4DEEEA] uppercase tracking-widest flex items-center">
                      <Cpu size={10} className="mr-2" /> Sugerencia de Nexus
                    </p>
                    <p className="text-[11px] italic text-white/80 font-tech leading-relaxed">"{aiSuggestions}"</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Totales y Acción de Pago */}
        <div className="p-10 bg-black/60 border-t border-white/10 space-y-8 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest">
              <span>Subtotal Neto</span>
              <span>$ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest">
              <span>Impuesto IVA (16%)</span>
              <span>$ {iva.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs uppercase font-bold text-white tracking-[0.3em]">Total a Liquidar</span>
              <span className="text-5xl font-tech font-bold text-[#FFD700] tracking-tighter">$ {total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => {
              setIsProcessing(true); 
              addToast('Procesando transacción en red Aurum...', 'info');
              setTimeout(() => {
                setCart([]); 
                setIsProcessing(false); 
                addToast('Transacción liquidada con éxito. Folio: LX-8888', 'success');
                setAiSuggestions('');
              }, 2500);
            }}
            className="w-full py-6 bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] text-black font-bold uppercase tracking-[0.3em] text-xs rounded-2xl shadow-[0_20px_50px_rgba(77,238,234,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center">
              {isProcessing ? <Loader2 className="animate-spin mr-4" size={22} /> : <CreditCard size={22} className="mr-4" />}
              {isProcessing ? 'Sincronizando...' : 'Finalizar Venta'}
            </span>
          </button>
          
          <div className="flex justify-center items-center space-x-6 opacity-20">
             <span className="text-[8px] font-mono text-white tracking-widest">918197185</span>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <span className="text-[8px] font-mono text-white tracking-widest">520</span>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <span className="text-[8px] font-mono text-white tracking-widest">8888</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(800px); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(77, 238, 234, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(77, 238, 234, 0.5);
        }
      `}</style>
    </div>
  );
};
