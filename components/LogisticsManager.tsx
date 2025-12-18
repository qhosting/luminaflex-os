
import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Search,
  Navigation,
  Globe
} from 'lucide-react';

interface Shipment {
  id: string;
  orderId: string;
  client: string;
  destination: string;
  status: 'Recolectado' | 'En Tránsito' | 'Entregado' | 'Retrasado';
  courier: 'DHL' | 'FedEx' | 'Aurum Logistics';
  eta: string;
}

export const LogisticsManager: React.FC = () => {
  const [shipments] = useState<Shipment[]>([
    { id: 'TRK-9001', orderId: 'LX-ORD-101', client: 'Velvet Lounge', destination: 'Miami, FL', status: 'En Tránsito', courier: 'DHL', eta: 'Hoy, 18:00' },
    { id: 'TRK-9002', orderId: 'LX-ORD-104', client: 'CEO Private Office', destination: 'New York, NY', status: 'Entregado', courier: 'Aurum Logistics', eta: 'Finalizado' },
    { id: 'TRK-9003', orderId: 'LX-ORD-102', client: 'Aether Tech', destination: 'Austin, TX', status: 'Recolectado', courier: 'FedEx', eta: 'Mañana' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div>
          <h3 className="text-4xl font-tech font-bold uppercase tracking-tighter gradient-lumina">Control de Envíos</h3>
          <p className="text-[10px] text-[#A0A0A0] uppercase tracking-[0.4em] mt-2 font-bold italic">Flujo Logístico: <span className="text-[#4DEEEA]">SECURE-8888</span></p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="px-6 py-3 flex items-center space-x-2">
            <Globe size={16} className="text-[#4DEEEA]" />
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-white">Cobertura Global Activa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {shipments.map((ship) => (
            <div key={ship.id} className="glass-panel p-6 rounded-[32px] border border-white/5 hover:border-[#4DEEEA]/30 transition-all group overflow-hidden relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${ship.status === 'Entregado' ? 'bg-green-500/10 text-green-500' : 'bg-[#4DEEEA]/10 text-[#4DEEEA]'}`}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">{ship.client}</h4>
                    <p className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest">{ship.id} | {ship.courier}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase font-bold text-[#A0A0A0] mb-1">Destino</p>
                    <p className="text-xs font-tech text-white flex items-center justify-end"><MapPin size={12} className="mr-1 text-[#FFD700]" /> {ship.destination}</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-[9px] uppercase font-bold text-[#A0A0A0] mb-1">Estado</p>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${ship.status === 'Entregado' ? 'bg-green-500/20 text-green-500' : 'bg-[#4DEEEA]/20 text-[#4DEEEA] animate-pulse'}`}>
                      {ship.status}
                    </span>
                  </div>
                  <button className="p-3 bg-white/5 hover:bg-[#4DEEEA] hover:text-black rounded-xl transition-all">
                    <Navigation size={18} />
                  </button>
                </div>
              </div>
              
              {/* Barra de progreso simulada */}
              <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] transition-all duration-1000`} 
                  style={{ width: ship.status === 'Entregado' ? '100%' : ship.status === 'En Tránsito' ? '65%' : '15%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
            <h5 className="font-tech text-xl uppercase tracking-widest text-[#FFD700] mb-6">Métricas de Entrega</h5>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-[#A0A0A0]">
                  <Clock size={16} />
                  <span className="text-xs uppercase font-bold tracking-widest">Tiempo Promedio</span>
                </div>
                <span className="text-lg font-tech text-white">4.2 Días</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-[#A0A0A0]">
                  <CheckCircle2 size={16} />
                  <span className="text-xs uppercase font-bold tracking-widest">Éxito 1ra Entrega</span>
                </div>
                <span className="text-lg font-tech text-white">98.4%</span>
              </div>
              <div className="pt-6 border-t border-white/5">
                <p className="text-[9px] uppercase text-[#A0A0A0] tracking-[0.3em] font-mono">Quantum Logistics Prot: 8888</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[40px] border border-[#4DEEEA]/20 bg-gradient-to-br from-[#4DEEEA]/5 to-transparent">
            <h5 className="font-tech text-sm uppercase tracking-widest text-[#4DEEEA] mb-4">Nueva Guía de Rastreo</h5>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={16} />
              <input 
                type="text" 
                placeholder="INGRESAR CÓDIGO..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-tech tracking-widest focus:border-[#4DEEEA] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
