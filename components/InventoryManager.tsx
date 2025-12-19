import React, { useState } from 'react';
import { 
  Tag, 
  Layers, 
  Plus, 
  Search, 
  ArrowUpRight, 
  Edit3, 
  ShoppingCart,
  Box,
  Droplets,
  HardDrive,
  X,
  Save,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { UserRole, ProductVenta } from '../App';

type InventoryTab = 'VENTAS' | 'INSUMOS';

interface ProductInsumo {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  provider: string;
}

export const InventoryManager: React.FC<{ role: UserRole; products: ProductVenta[]; setProducts: any }> = ({ role, products, setProducts }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('VENTAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductVenta | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [insumos] = useState<ProductInsumo[]>([
    { id: 'INS-001', name: 'Manguera Neón Flex 12V', unit: 'Metros', stock: 450, minStock: 100, provider: 'Silicon Valley LED' },
    { id: 'INS-002', name: 'Acrílico 6mm 120x240', unit: 'Láminas', stock: 12, minStock: 20, provider: 'Plasticorp' },
    { id: 'INS-003', name: 'Transformador 100W IP67', unit: 'Unidades', stock: 8, minStock: 15, provider: 'Power Aurum' },
  ]);

  const handleProductUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdating(true);
    setTimeout(() => {
      setProducts((prev: any) => prev.map((p: any) => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div>
          <h3 className="text-4xl font-tech font-bold uppercase tracking-tighter gradient-lumina">Control de Activos</h3>
          <p className="text-[10px] text-[#A0A0A0] uppercase tracking-[0.4em] mt-2 font-bold italic">Nodo de Suministro: <span className="text-[#FFD700]">REF: 318 798</span></p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button onClick={() => setActiveTab('VENTAS')} className={`px-8 py-3 rounded-xl font-tech font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'VENTAS' ? 'bg-[#4DEEEA] text-black shadow-lg shadow-[#4DEEEA]/20' : 'text-[#A0A0A0] hover:text-white'}`}>Ventas</button>
          <button onClick={() => setActiveTab('INSUMOS')} className={`px-8 py-3 rounded-xl font-tech font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'INSUMOS' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'text-[#A0A0A0] hover:text-white'}`}>Insumos</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={16} />
          <input 
            type="text" 
            placeholder="BUSCAR EN EL INVENTARIO MAESTRO..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 text-xs font-tech tracking-widest outline-none focus:border-[#4DEEEA]/40"
          />
        </div>
        <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-[#4DEEEA] hover:text-black transition-all flex items-center">
          <Plus size={14} className="mr-2" /> Agregar Item
        </button>
      </div>

      {activeTab === 'VENTAS' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="glass-panel group rounded-[40px] border border-white/5 hover:border-[#4DEEEA]/30 transition-all flex flex-col overflow-hidden">
              <div className="h-40 bg-white/5 relative group">
                {p.image ? <img src={p.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt={p.name} /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Box size={40} /></div>}
                <button onClick={() => setEditingProduct(p)} className="absolute bottom-4 right-4 p-2 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-[#4DEEEA] hover:scale-110"><Edit3 size={16} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                   <h4 className="text-lg font-bold text-white truncate">{p.name}</h4>
                   <p className="text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">{p.category}</p>
                </div>
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <span className="text-[8px] uppercase text-[#A0A0A0]">Stock</span>
                      <p className="font-tech text-white">{p.stock} pz</p>
                   </div>
                   <p className="text-xl font-tech font-bold text-[#FFD700]">${p.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[40px] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">
                <th className="px-8 py-6">Materia Prima</th>
                <th className="px-8 py-6">Nivel de Stock</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Órdenes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-tech">
              {insumos.map(insumo => {
                const isLow = insumo.stock < insumo.minStock;
                return (
                  <tr key={insumo.id} className="hover:bg-white/[0.02] transition-all">
                    <td className="px-8 py-6">
                       <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-2xl ${isLow ? 'bg-red-500/10 text-red-500' : 'bg-[#4DEEEA]/10 text-[#4DEEEA]'}`}>
                             {insumo.unit === 'Metros' ? <Droplets size={20} /> : <HardDrive size={20} />}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white uppercase">{insumo.name}</p>
                             <p className="text-[9px] font-mono text-[#A0A0A0]">{insumo.provider}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className={`text-xl font-bold ${isLow ? 'text-red-500' : 'text-white'}`}>{insumo.stock} <span className="text-[10px] opacity-40 uppercase">{insumo.unit}</span></p>
                       <p className="text-[8px] text-[#A0A0A0] uppercase">Mínimo: {insumo.minStock}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${isLow ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-green-500/20 text-green-500'}`}>
                          {isLow ? 'Crítico' : 'Nominal'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-3 bg-white/5 hover:bg-[#FFD700] hover:text-black rounded-xl transition-all"><ArrowUpRight size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="glass-panel max-w-xl w-full rounded-[60px] border border-[#4DEEEA]/30 p-12 space-y-8 relative">
              <button onClick={() => setEditingProduct(null)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl"><X size={24} /></button>
              <h3 className="text-3xl font-tech font-bold uppercase tracking-widest gradient-lumina">Editor de Activos</h3>
              <form onSubmit={handleProductUpdate} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Nombre del Producto</label>
                    <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#4DEEEA]/50 font-tech" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Precio MXN</label>
                       <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#FFD700]/50 font-tech text-[#FFD700]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Stock Disponible</label>
                       <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#4DEEEA]/50 font-tech" />
                    </div>
                 </div>
                 <button disabled={isUpdating} className="w-full py-5 bg-[#4DEEEA] text-black font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center hover:scale-[1.02] transition-all">
                    {isUpdating ? <Loader2 className="animate-spin mr-3" /> : <Save size={18} className="mr-3" />}
                    Confirmar Cambios
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};