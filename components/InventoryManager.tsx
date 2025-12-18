
import React, { useState, useMemo } from 'react';
import { 
  Tag, 
  Layers, 
  Plus, 
  Search, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  ShoppingCart,
  Box,
  Droplets,
  HardDrive,
  X,
  ClipboardList,
  Clock,
  History,
  Truck,
  PackageSearch,
  ImageIcon,
  Upload,
  Save,
  Loader2
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

interface ReplenishmentOrder {
  id: string;
  insumoId: string;
  qty: number;
  date: string;
  status: 'Pendiente' | 'En Camino' | 'Recibido';
  expectedDate?: string;
}

interface InventoryManagerProps {
  role: UserRole;
  products: ProductVenta[];
  setProducts: React.Dispatch<React.SetStateAction<ProductVenta[]>>;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ role, products, setProducts }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('VENTAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsumo, setSelectedInsumo] = useState<ProductInsumo | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  
  // Edición de Productos
  const [editingProduct, setEditingProduct] = useState<ProductVenta | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [productosInsumos] = useState<ProductInsumo[]>([
    { id: 'INS-001', name: 'Manguera Neón Flex 12V Cian', unit: 'Metros', stock: 45, minStock: 100, provider: 'Silicon Valley LED' },
    { id: 'INS-002', name: 'Acrílico Negro 3mm 120x240', unit: 'Láminas', stock: 12, minStock: 5, provider: 'Plasticorp' },
    { id: 'INS-003', name: 'Transformador 100W IP67', unit: 'Unidades', stock: 2, minStock: 10, provider: 'Power Aurum' },
    { id: 'INS-004', name: 'Cable Siliconado 18AWG', unit: 'Rollos', stock: 3, minStock: 2, provider: 'Wiring Pro' },
  ]);

  const [replenishmentOrders] = useState<ReplenishmentOrder[]>([
    { id: 'RE-771', insumoId: 'INS-001', qty: 200, date: '2024-05-20', status: 'En Camino', expectedDate: '2024-05-25' },
    { id: 'RE-773', insumoId: 'INS-004', qty: 10, date: '2024-05-22', status: 'Pendiente' },
  ]);

  const filteredOrders = useMemo(() => {
    if (!selectedInsumo) return [];
    return replenishmentOrders.filter(order => order.insumoId === selectedInsumo.id && order.status !== 'Recibido');
  }, [selectedInsumo, replenishmentOrders]);

  const openOrdersModal = (insumo: ProductInsumo) => {
    setSelectedInsumo(insumo);
    setShowOrdersModal(true);
  };

  const handleProductUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdating(true);
    
    setTimeout(() => {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      setIsUpdating(false);
    }, 1000);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingProduct({ ...editingProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div>
          <h3 className="text-4xl font-tech font-bold uppercase tracking-tighter gradient-lumina">Gestión de Activos</h3>
          <p className="text-[10px] text-[#A0A0A0] uppercase tracking-[0.4em] mt-2 font-bold italic">Stock de Seguridad: <span className="text-[#FFD700]">REF: 318 798 488</span></p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <button onClick={() => setActiveTab('VENTAS')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-tech font-bold uppercase text-xs tracking-widest ${activeTab === 'VENTAS' ? 'bg-[#4DEEEA] text-black shadow-lg shadow-[#4DEEEA]/20' : 'text-[#A0A0A0] hover:text-white'}`}><Tag size={16} /> <span>Ventas</span></button>
          <button onClick={() => setActiveTab('INSUMOS')} className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-tech font-bold uppercase text-xs tracking-widest ${activeTab === 'INSUMOS' ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' : 'text-[#A0A0A0] hover:text-white'}`}><Layers size={16} /> <span>Insumos</span></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={18} />
          <input 
            type="text" 
            placeholder="FILTRAR INVENTARIO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-tech tracking-wider focus:border-[#4DEEEA]/50 outline-none"
          />
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 uppercase text-[10px] tracking-widest transition-all">
          <Plus size={16} className="text-[#4DEEEA]" /> <span>Nuevo Producto</span>
        </button>
      </div>

      {activeTab === 'VENTAS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="glass-panel group rounded-[32px] border border-white/5 hover:border-[#4DEEEA]/30 overflow-hidden transition-all duration-500 flex flex-col">
              <div className="h-40 relative overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[8px] uppercase font-bold text-[#4DEEEA]">{prod.category}</div>
                <button 
                  onClick={() => setEditingProduct(prod)}
                  className="absolute bottom-4 right-4 p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#4DEEEA] hover:text-black"
                >
                  <Edit3 size={14} />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{prod.name}</h4>
                  <div className="flex items-center space-x-2 text-[#A0A0A0] text-[10px] font-tech uppercase">
                    <Box size={12} className="text-[#4DEEEA]" /> <span>Disponibilidad: {prod.stock}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-4 mt-4 border-t border-white/5">
                  <p className="text-xl font-tech font-bold text-[#FFD700]">$ {prod.price.toLocaleString()}</p>
                  <button className="p-2 bg-white/5 hover:bg-[#4DEEEA] hover:text-black rounded-xl transition-all"><ShoppingCart size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03] text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">
                <th className="px-8 py-5">Material</th>
                <th className="px-8 py-5">Nivel de Stock</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-tech">
              {productosInsumos.map((insumo) => {
                const isLow = insumo.stock < insumo.minStock;
                return (
                  <tr key={insumo.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${isLow ? 'bg-red-500/10 text-red-500' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
                          {insumo.unit === 'Metros' ? <Droplets size={18} /> : <HardDrive size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase text-sm">{insumo.name}</p>
                          <p className="text-[9px] text-[#A0A0A0] uppercase font-mono">{insumo.provider}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className={`text-lg font-bold ${isLow ? 'text-red-500' : 'text-white'}`}>{insumo.stock} <span className="text-[10px] opacity-40 uppercase">{insumo.unit}</span></p>
                      <p className="text-[8px] text-[#A0A0A0] uppercase">Mín. Requerido: {insumo.minStock}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 bg-white/5 hover:bg-[#FFD700] hover:text-black rounded-lg transition-all"><ArrowUpRight size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Edición de Producto */}
      {editingProduct && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="glass-panel max-w-2xl w-full rounded-[48px] border border-[#4DEEEA]/20 p-12 space-y-10 relative">
              <button onClick={() => setEditingProduct(null)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl"><X size={24} /></button>
              <h3 className="text-3xl font-tech font-bold uppercase tracking-widest gradient-lumina">Editor de Activos Venta</h3>
              
              <form onSubmit={handleProductUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="aspect-square glass-panel border border-white/10 rounded-3xl overflow-hidden relative group">
                       <img src={editingProduct.image} className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                          <Upload size={32} className="text-[#4DEEEA] mb-2" />
                          <span className="text-[10px] uppercase font-bold text-white">Cambiar Imagen</span>
                          <input type="file" onChange={handleProductImageUpload} className="hidden" accept="image/*" />
                       </label>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest ml-2">Nombre Comercial</label>
                       <input 
                         value={editingProduct.name} 
                         onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#4DEEEA]/40 outline-none" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest ml-2">Precio MXN</label>
                       <input 
                         type="number"
                         value={editingProduct.price} 
                         onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#FFD700]/40 outline-none font-tech text-xl text-[#FFD700]" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest ml-2">Categoría</label>
                       <select 
                         value={editingProduct.category}
                         onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                         className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none"
                       >
                         <option>Decoración</option>
                         <option>Comercial</option>
                         <option>Personalizado</option>
                         <option>Artístico</option>
                       </select>
                    </div>
                 </div>

                 <div className="md:col-span-2">
                    <button 
                      disabled={isUpdating}
                      className="w-full py-5 bg-gradient-to-r from-[#4DEEEA] to-[#00C6C3] text-black font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                      {isUpdating ? <Loader2 className="animate-spin mr-3" /> : <Save className="mr-3" size={18} />}
                      {isUpdating ? 'Actualizando Nodo...' : 'Guardar en Base de Datos'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
