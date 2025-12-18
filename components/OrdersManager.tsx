
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  X, 
  DollarSign, 
  ShoppingCart,
  Hash,
  User,
  Calendar,
  Layers,
  FileText,
  Eye,
  Trash2,
  Download,
  Printer,
  Loader2
} from 'lucide-react';
import { UserRole } from '../App';

interface OrderItem {
  id: string;
  client: string;
  item: string;
  amount: number;
  status: 'Pagado' | 'Pendiente' | 'Proceso' | 'Cancelado';
  date: string;
}

interface OrdersManagerProps {
  role: UserRole;
  onlyPaid?: boolean;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({ role, onlyPaid = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [viewType, setViewType] = useState<'invoice' | 'layout' | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'LX-ORD-101', client: 'Velvet Lounge', item: 'Logo Neón "Velvet" 100cm', amount: 850.00, status: 'Pagado', date: '2024-05-15' },
    { id: 'LX-ORD-102', client: 'Aether Tech', item: 'Señalética RGB Smart', amount: 1200.00, status: 'Pendiente', date: '2024-05-16' },
    { id: 'LX-ORD-103', client: 'Retro Arcade', item: 'Pacman Wall Set', amount: 450.00, status: 'Proceso', date: '2024-05-16' },
    { id: 'LX-ORD-104', client: 'CEO Private Office', item: 'Aurum Shield Gold', amount: 2500.00, status: 'Pagado', date: '2024-05-17' },
  ]);

  const stats = useMemo(() => {
    const total = orders.reduce((acc, curr) => acc + curr.amount, 0);
    const pending = orders.filter(o => o.status === 'Pendiente').length;
    return { total, pending, count: orders.length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.client.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = onlyPaid ? o.status === 'Pagado' : (filterStatus === 'Todos' || o.status === filterStatus);
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus, onlyPaid]);

  const handleAction = (actionName: string) => {
    setActionLoading(actionName);
    setTimeout(() => setActionLoading(null), 1500);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `LX-ORD-${Math.floor(Math.random() * 900) + 100}`;
    const order: OrderItem = {
      id,
      client: (e.target as any).client.value,
      item: (e.target as any).item.value,
      amount: parseFloat((e.target as any).amount.value),
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([order, ...orders]);
    setShowNewOrderModal(false);
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    setActiveMenuId(null);
  };

  const updateStatus = (id: string, newStatus: OrderItem['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setActiveMenuId(null);
  };

  const openView = (order: OrderItem, type: 'invoice' | 'layout') => {
    setSelectedOrder(order);
    setViewType(type);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-[#4DEEEA]"><DollarSign size={100} /></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest mb-1">Ventas Totales</p>
            <span className="text-[9px] font-mono opacity-30 text-[#4DEEEA]">P-CODE: 318 798</span>
          </div>
          <h4 className="text-3xl font-tech font-bold text-white">${stats.total.toLocaleString()} <span className="text-xs text-[#4DEEEA]">USD</span></h4>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-[#FFD700]"><Clock size={100} /></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest mb-1">Pendientes</p>
            <span className="text-[9px] font-mono opacity-30 text-[#FFD700]">P-CODE: 520</span>
          </div>
          <h4 className="text-3xl font-tech font-bold text-white">{stats.pending}</h4>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group text-[#FF007F]">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShoppingCart size={100} /></div>
          <p className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest mb-1">Proyectos</p>
          <h4 className="text-3xl font-tech font-bold text-white">{stats.count}</h4>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-[#4DEEEA]/50 outline-none font-tech tracking-wider"
          />
        </div>
        {!onlyPaid && (
          <div className="flex items-center space-x-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 shrink-0">
              {['Todos', 'Pagado', 'Pendiente', 'Proceso'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold transition-all ${filterStatus === status ? 'bg-[#4DEEEA] text-black shadow-[0_0_15px_rgba(77,238,234,0.4)]' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowNewOrderModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] text-black font-bold rounded-2xl neon-glow-hover shrink-0"
            >
              <Plus size={18} />
              <span className="text-xs uppercase tracking-widest font-tech">Nueva Orden</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <div key={order.id} className="glass-panel p-6 rounded-[32px] border border-white/5 hover:border-[#4DEEEA]/20 transition-all group relative overflow-visible neon-glow-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'Pagado' ? 'bg-green-500 shadow-[0_0_8px_green]' : order.status === 'Pendiente' ? 'bg-yellow-500 shadow-[0_0_8px_yellow]' : 'bg-[#4DEEEA] shadow-[0_0_8px_#4DEEEA]'}`} />
                <span className="text-[10px] font-tech text-[#A0A0A0] uppercase tracking-widest">{order.id}</span>
              </div>
              {!onlyPaid && (
                <div className="relative">
                  <button onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)} className="text-[#A0A0A0] hover:text-white p-1 hover:bg-white/5 rounded-lg"><MoreVertical size={16} /></button>
                  {activeMenuId === order.id && (
                    <div className="absolute right-0 mt-2 w-48 glass-panel border border-white/10 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => updateStatus(order.id, 'Pagado')} className="w-full text-left px-4 py-2 text-[10px] uppercase font-bold text-green-400 hover:bg-green-500/10 rounded-xl flex items-center"><CheckCircle size={14} className="mr-2" /> Pagado</button>
                      <button onClick={() => updateStatus(order.id, 'Proceso')} className="w-full text-left px-4 py-2 text-[10px] uppercase font-bold text-[#4DEEEA] hover:bg-[#4DEEEA]/10 rounded-xl flex items-center"><Clock size={14} className="mr-2" /> Proceso</button>
                      <div className="h-[1px] bg-white/5 my-1"></div>
                      <button onClick={() => deleteOrder(order.id)} className="w-full text-left px-4 py-2 text-[10px] uppercase font-bold text-red-400 hover:bg-red-500/10 rounded-xl flex items-center"><Trash2 size={14} className="mr-2" /> Eliminar</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <h5 className="text-lg font-bold text-white mb-1">{order.client}</h5>
            <p className="text-xs text-[#A0A0A0] mb-6 flex items-center"><Layers size={12} className="mr-2 text-[#4DEEEA]" /> {order.item}</p>
            
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="space-y-1">
                <p className="text-[9px] uppercase text-[#A0A0A0] tracking-widest">Inversión</p>
                <p className="text-xl font-tech font-bold text-[#FFD700]">${order.amount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase text-[#A0A0A0] tracking-widest">Registro</p>
                <p className="text-[11px] font-tech text-white uppercase">{order.date}</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <button onClick={() => openView(order, 'invoice')} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] uppercase font-bold tracking-widest border border-white/5 flex items-center justify-center"><FileText size={12} className="mr-2" /> Factura</button>
              <button onClick={() => openView(order, 'layout')} className="flex-1 py-2 bg-[#4DEEEA]/10 hover:bg-[#4DEEEA]/20 text-[#4DEEEA] rounded-xl text-[9px] uppercase font-bold tracking-widest border border-[#4DEEEA]/20 flex items-center justify-center"><Eye size={12} className="mr-2" /> Trazado</button>
            </div>
          </div>
        )) : <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30"><ShoppingCart size={48} className="mb-4" /><p className="font-tech text-lg uppercase">Sin registros</p></div>}
      </div>

      {(viewType && selectedOrder) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="glass-panel max-w-4xl w-full rounded-[48px] border border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-tech font-bold uppercase tracking-widest">{viewType === 'invoice' ? 'Facturación Aurum' : 'Diseño Vectorial'}</h3>
              <button onClick={() => setViewType(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              {viewType === 'invoice' ? (
                <div className="max-w-2xl mx-auto space-y-10">
                   <div className="flex justify-between items-start">
                     <div><h4 className="text-4xl font-bold gradient-lumina italic">LuminaFlex</h4><p className="text-[10px] text-[#A0A0A0] uppercase mt-2">REF: 419 488 71 8888</p></div>
                     <div className="text-right text-[10px] text-[#A0A0A0] uppercase">Fecha: {selectedOrder.date}</div>
                   </div>
                   <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4">
                     <p className="text-xs uppercase text-[#A0A0A0] tracking-widest font-bold border-b border-white/5 pb-2">Descripción</p>
                     <div className="flex justify-between items-center"><p className="text-xl font-bold">{selectedOrder.item}</p><p className="text-xl font-mono text-[#FFD700]">${selectedOrder.amount.toFixed(2)}</p></div>
                   </div>
                   <div className="text-right"><p className="text-xs uppercase text-[#A0A0A0] font-bold">Total Liquidado</p><p className="text-5xl font-bold font-mono text-[#FFD700]">${selectedOrder.amount.toLocaleString()}</p></div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-8">
                  <div className="w-80 h-80 border-2 border-dashed border-[#4DEEEA]/30 rounded-[50px] flex items-center justify-center bg-black/40"><Layers size={60} className="text-[#4DEEEA] animate-pulse" /></div>
                  <p className="text-sm font-tech text-[#A0A0A0] uppercase tracking-widest">Previsualización del Vector CNC activa</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end space-x-4">
              <button onClick={() => handleAction('download')} className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest">
                {actionLoading === 'download' ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} <span>Descargar</span>
              </button>
              <button onClick={() => handleAction('print')} className={`flex items-center space-x-2 px-8 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest ${viewType === 'invoice' ? 'bg-[#FFD700] text-black' : 'bg-[#4DEEEA] text-black'}`}>
                {actionLoading === 'print' ? <Loader2 className="animate-spin" size={16} /> : <Printer size={16} />} <span>{viewType === 'invoice' ? 'Emitir PDF' : 'Exportar DXF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewOrderModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-panel max-w-lg w-full rounded-[40px] border border-[#4DEEEA]/20 p-10 space-y-8">
            <h3 className="text-2xl font-tech font-bold gradient-lumina uppercase tracking-widest">Nueva Orden</h3>
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <input name="client" placeholder="Cliente" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#4DEEEA]/50 outline-none" required />
              <input name="item" placeholder="Ítem / Proyecto" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#4DEEEA]/50 outline-none" required />
              <input name="amount" type="number" placeholder="Inversión USD" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#4DEEEA]/50 outline-none" required />
              <button type="submit" className="w-full py-5 bg-[#4DEEEA] text-black font-bold uppercase tracking-widest rounded-2xl neon-glow-hover">Confirmar Sincronización</button>
              <button type="button" onClick={() => setShowNewOrderModal(false)} className="w-full py-3 text-[10px] text-[#A0A0A0] uppercase font-bold tracking-widest">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
