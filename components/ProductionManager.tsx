
import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Zap, 
  Workflow
} from 'lucide-react';
import { UserRole } from '../App';

export const ProductionManager: React.FC<{ role: UserRole }> = ({ role }) => {
  const stages = ['Diseño', 'Corte CNC', 'Ensamble', 'Control Q/A'];
  
  const [projects, setProjects] = useState([
    { id: 'LX-PR-501', name: 'Logo Neon Glow', client: 'CyberCafe', stage: 0, priority: 'Alta' },
    { id: 'LX-PR-502', name: 'Letrero "OPEN"', client: 'Bar Retro', stage: 1, priority: 'Media' },
    { id: 'LX-PR-503', name: 'Mural Abstracto', client: 'Studio 54', stage: 2, priority: 'Baja' },
    { id: 'LX-PR-504', name: 'Iconos Gamer', client: 'Arena E-sports', stage: 3, priority: 'Alta' },
  ]);

  const nextStage = (id: string) => {
    setProjects(projects.map(p => p.id === id && p.stage < 3 ? { ...p, stage: p.stage + 1 } : p));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div>
          <h3 className="text-4xl font-tech font-bold uppercase tracking-tighter gradient-lumina">Línea de Producción</h3>
          <p className="text-[10px] text-[#A0A0A0] uppercase tracking-[0.4em] mt-2 font-bold italic">Armonía de Proceso: <span className="text-[#4DEEEA]">741</span></p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-3">
             <Workflow size={16} className="text-[#4DEEEA]" />
             <span className="text-[10px] font-bold uppercase text-[#A0A0A0]">Flujos Activos: 12</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stageName, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#A0A0A0]">{stageName}</h4>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[#FFD700]">
                {projects.filter(p => p.stage === idx).length}
              </span>
            </div>
            <div className="space-y-4 min-h-[500px] p-2 bg-white/[0.02] rounded-[32px] border border-white/5">
              {projects.filter(p => p.stage === idx).map(p => (
                <div key={p.id} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#4DEEEA]/20 transition-all group relative overflow-hidden neon-glow-hover">
                   <div className={`absolute top-0 right-0 w-1 h-full ${p.priority === 'Alta' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[#FFD700]'}`}></div>
                   <div className="flex justify-between items-start mb-3">
                     <span className="text-[8px] font-mono text-[#4DEEEA] uppercase tracking-widest">{p.id}</span>
                     {p.priority === 'Alta' && <AlertCircle size={12} className="text-red-500 animate-pulse" />}
                   </div>
                   <h5 className="text-sm font-bold text-white mb-1">{p.name}</h5>
                   <p className="text-[10px] text-[#A0A0A0] mb-4">{p.client}</p>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                     <div className="flex items-center space-x-2">
                       <Cpu size={14} className="text-[#A0A0A0]" />
                       <span className="text-[9px] uppercase text-[#A0A0A0]">Core Sync</span>
                     </div>
                     {idx < 3 && (
                       <button 
                        onClick={() => nextStage(p.id)}
                        className="p-1.5 rounded-lg bg-[#4DEEEA]/10 text-[#4DEEEA] hover:bg-[#4DEEEA] hover:text-black transition-all"
                       >
                         <ChevronRight size={14} />
                       </button>
                     )}
                   </div>
                   {/* Grabovoi 741 inyectado en la base de cada tarjeta de producción */}
                   <span className="absolute bottom-1 right-2 text-[6px] font-mono opacity-10">SYNC-741</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
