import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Receipt,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  PackageSearch,
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  CreditCard,
  History,
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

export const POSManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Neon' | 'Accesorios' | 'Servicios'>('Todos');
  const [toasts, setToasts] = useState<{id: string, message: string, type: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');

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
    }
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
        contents: `El cliente tiene: ${itemsStr} en su carrito. Eres un asesor de ventas de Luminaflex. Sugiere un accesorio o servicio lógico (ej. Instalación si lleva Neón, Eliminador si lleva manguera). Máximo 12 palabras, tono profesional.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      setAiSuggestions(response.text || '');
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (product: Product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      const newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      setCart(newCart);
      getAiRecommendation(newCart);
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      getAiRecommendation(newCart);
    }
    addToast(`${product.name} añadido.`, 'success');
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal * 1.16;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] gap-8 animate-in fade-in duration-700">
      
      <div className="flex-1 flex flex-col space-y-8 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0A0A0] group-focus-within:text-[#4DEEEA]" size={20} />
            <input 
              type="text" 
              placeholder="ESCANEAR ACTIVOS O BUSCAR PRODUCTOS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-tech tracking-widest focus:border-[#4DEEEA]/50 outline-none transition-all"
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
          {products.filter(p => activeCategory === 'Todos' || p.category === activeCategory).map(p => (
            <div 
              key={p.id}
              onClick={() => addToCart(p)}
              className="glass-panel p-8 rounded-[40px] border border-white/5 hover:border-[#4DEEEA]/40 hover:bg-white/[0.02] cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] font-mono text-[#4DEEEA] opacity-60 tracking-widest">{p.id}</span>
                  <div className="p-2 bg-white/5 rounded-xl group-hover:bg-[#4DEEEA]/10 text-[#A0A0A0] group-hover:text-[#4DEEEA] transition-all">
                    <Plus size={18} />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">{p.name}</h4>
                <p className="text-[10px] text-[#A0A0A0] uppercase mb-4 tracking-[0.2em]">{p.category}</p>
                <p className="text-[11px] text-[#A0A0A0] leading-relaxed mb-8 opacity-60">{p.description}</p>
              </div>

              <div className="relative z-10 flex justify-between items-center pt-4 border-t border-white/5">
                <p className="text-2xl font-tech font-bold text-[#FFD700] tracking-tighter">$ {p.price.toLocaleString()}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-[8px] uppercase font-bold text-[#A0A0A0]">Stock: {p.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[420px] glass-panel border-l border-white/10 flex flex-col rounded-[50px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-[#FFD700]/10 to-transparent">
          <div className="flex items-center space-x-4">
            <Receipt size={24} className="text-[#FFD700]" />
            <div>
              <h3 className="font-tech text-2xl font-bold uppercase tracking-tighter">Ticket Maestro</h3>
              <p className="text-[9px] text-[#A0A0A0] uppercase font-mono tracking-widest">NODO: POS-AURUM-01</p>
            </div>
          </div>
          <button onClick={() => setCart([])} className="p-2 text-white/20 hover:text-red-500 transition-colors"><History size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4">
              <PackageSearch size={80} strokeWidth={1} />
              <p className="text-sm uppercase font-bold tracking-[0.4em]">Terminal Libre</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 flex flex-col space-y-4 group animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-white uppercase mb-1">{item.name}</p>
                      <p className="text-lg font-tech font-bold text-[#FFD700]">$ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="p-2 text-white/10 hover:text-red-500"><X size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">{item.category}</span>
                     <div className="flex items-center space-x-4 bg-black/40 rounded-2xl px-4 py-2 border border-white/5">
                        <button onClick={() => item.quantity > 1 && setCart(cart.map(i => i.id === item.id ? {...i, quantity: i.quantity - 1} : i))} className="text-[#A0A0A0] hover:text-[#4DEEEA]"><Minus size={14} /></button>
                        <span className="text-sm font-tech font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="text-[#A0A0A0] hover:text-[#4DEEEA]"><Plus size={14} /></button>
                     </div>
                  </div>
                </div>
              ))}
              
              {aiSuggestions && (
                <div className="p-6 bg-[#4DEEEA]/5 border border-[#4DEEEA]/20 rounded-[32px] flex items-start space-x-4 animate-in fade-in zoom-in">
                  <Sparkles size={16} className="text-[#4DEEEA] shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-[#4DEEEA] uppercase tracking-widest">Nexus Sugiere:</p>
                    <p className="text-[11px] italic text-white/80 font-tech">"{aiSuggestions}"</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-10 bg-black/60 border-t border-white/10 space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] uppercase font-bold text-[#A0A0A0]"><span>Subtotal</span><span>$ {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-[#A0A0A0]"><span>IVA (16%)</span><span>$ {(subtotal * 0.16).toLocaleString()}</span></div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs uppercase font-bold text-white tracking-[0.3em]">Total</span>
              <span className="text-5xl font-tech font-bold text-[#FFD700] tracking-tighter">$ {total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => {
              setIsProcessing(true); 
              setTimeout(() => {
                setCart([]); 
                setIsProcessing(false); 
                addToast('Transacción liquidada con éxito.', 'success');
              }, 2500);
            }}
            className="w-full py-6 bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
          >
            {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'Sincronizar Liquidación'}
          </button>
        </div>
      </div>
    </div>
  );
};