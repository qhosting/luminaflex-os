
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Cpu, 
  Zap, 
  UserPlus, 
  MoreHorizontal, 
  Star, 
  ShieldCheck,
  Activity,
  Award,
  Fingerprint,
  Brain,
  Binary,
  ShieldAlert,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Mail,
  Smartphone,
  Eye,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  Settings,
  Shield,
  Layout
} from 'lucide-react';
import { UserRole } from '../App';

interface StaffMember {
  id: string;
  name: string;
  department: 'Diseño' | 'CNC' | 'Soldadura' | 'Logística';
  status: 'Online' | 'Ocupado' | 'Offline';
  efficiency: number;
  clearance: 'Lvl 1' | 'Lvl 2' | 'Lvl 3' | 'GOD';
  lastActivity: string;
  trends: number[];
  email: string;
  phone: string;
  bio?: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export const StaffManager: React.FC<{ role: UserRole }> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSelfConfigModal, setShowSelfConfigModal] = useState(false);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [myProfile, setMyProfile] = useState<StaffMember>({
    id: 'STF-COLAB',
    name: 'Colaborador Élite',
    department: 'Diseño',
    status: 'Online',
    efficiency: 94,
    clearance: 'Lvl 2',
    lastActivity: 'Sincronizando con Aurum OS',
    trends: [80, 85, 90, 92, 94],
    email: 'colaborador@luminaflex.com',
    phone: '+52 55 9999 0000',
    bio: 'Especialista en trazado de neón vectorial de alta precisión.'
  });

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 'STF-741', name: 'Marco Aurum', department: 'Diseño', status: 'Online', efficiency: 98, clearance: 'GOD', lastActivity: 'Renderizando Logo_V5.obj', trends: [60, 80, 70, 90, 98], email: 'marco@luminaflex.com', phone: '+52 55 1234 5678' },
    { id: 'STF-520', name: 'Elena Neon', department: 'CNC', status: 'Ocupado', efficiency: 92, clearance: 'Lvl 3', lastActivity: 'Mecanizado en Nodo 2', trends: [85, 88, 92, 90, 92], email: 'elena@luminaflex.com', phone: '+52 55 8765 4321' },
    { id: 'STF-318', name: 'Javier Flex', department: 'Soldadura', status: 'Online', efficiency: 89, clearance: 'Lvl 2', lastActivity: 'Ensamble Ala_Neon_01', trends: [70, 75, 80, 85, 89], email: 'javier@luminaflex.com', phone: '+52 55 1122 3344' },
    { id: 'STF-888', name: 'Nexus-IA', department: 'Logística', status: 'Online', efficiency: 100, clearance: 'GOD', lastActivity: 'Optimizando Rutas DHL', trends: [100, 100, 100, 100, 100], email: 'nexus@aurum.ai', phone: '01 800 AI_CORE' },
    myProfile
  ]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(current => current.filter(t => t.id !== id)), 4000);
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const handleSelfUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    setTimeout(() => {
      const updated = {
        ...myProfile,
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        bio: formData.get('bio') as string,
        status: formData.get('status') as any,
      };
      setMyProfile(updated);
      setStaff(prev => prev.map(m => m.id === 'STF-COLAB' ? updated : m));
      setIsProcessing(false);
      setShowSelfConfigModal(false);
      addToast(`Tu perfil biométrico ha sido actualizado.`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 relative pb-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DEEEA]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {role === 'Colaborador' && (
        <div className="glass-panel p-10 rounded-[56px] border border-[#4DEEEA]/30 bg-gradient-to-br from-[#4DEEEA]/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-[0_0_50px_rgba(77,238,234,0.1)]">
           <div className="flex items-center space-x-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#4DEEEA] to-[#FFD700] p-[2px]">
                   <div className="w-full h-full rounded-[30px] bg-[#050505] flex items-center justify-center text-3xl font-tech font-bold text-white">
                      {myProfile.name.charAt(0)}
                   </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#050505] shadow-[0_0_15px_green]"></div>
              </div>
              <div>
                <h2 className="text-4xl font-tech font-bold text-white uppercase tracking-tighter">Panel de Colaborador</h2>
                <p className="text-[10px] text-[#A0A0A0] uppercase tracking-[0.4em] font-mono mt-2">ID: {myProfile.id} | <span className="text-[#4DEEEA]">STATUS: {myProfile.status}</span></p>
              </div>
           </div>
           <button 
             onClick={() => setShowSelfConfigModal(true)}
             className="px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center shadow-2xl hover:bg-[#4DEEEA] transition-all text-xs"
           >
             <Settings size={18} className="mr-3" /> Configurar Mi Perfil
           </button>
        </div>
      )}

      {/* Header Avanzado para Administradores */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-white/5 pb-10 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-[#FFD700]/10 text-[#FFD700] text-[8px] font-bold rounded border border-[#FFD700]/20 tracking-[0.3em]">HUMAN_ASSETS_SYNC</span>
            <span className="text-[8px] text-[#A0A0A0] font-mono tracking-tighter uppercase">Protocolo: 719 31</span>
          </div>
          <h3 className="text-5xl font-tech font-bold uppercase tracking-tighter gradient-lumina leading-tight">Directorio Operativo</h3>
          <p className="text-[11px] text-[#A0A0A0] uppercase tracking-[0.5em] mt-2 font-bold italic">Nodos Conectados: <span className="text-[#4DEEEA]">{staff.length}</span></p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={16} />
            <input 
              type="text" 
              placeholder="ESCANEAR PERSONAL..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-tech tracking-widest focus:border-[#4DEEEA]/40 outline-none w-64 transition-all"
            />
          </div>
          {(role === 'CEO' || role === 'Admin') && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-[#4DEEEA] to-[#00C6C3] text-black font-bold rounded-2xl neon-glow-hover uppercase text-[10px] tracking-[0.2em] font-tech transition-all shadow-[0_0_20px_rgba(77,238,234,0.2)]"
            >
              <UserPlus size={16} /> <span>Vincular Perfil</span>
            </button>
          )}
        </div>
      </div>

      {/* Directorio de Perfiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {filteredStaff.map((member) => (
          <div key={member.id} className="glass-panel group rounded-[48px] border border-white/5 hover:border-[#4DEEEA]/30 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#4DEEEA]/10 animate-[scanline_10s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="relative">
                <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#4DEEEA]/20 to-[#FFD700]/20 p-[1px] group-hover:rotate-6 transition-transform duration-500`}>
                  <div className="w-full h-full rounded-[21px] bg-[#050505] flex items-center justify-center relative overflow-hidden">
                    <Users size={28} className="text-[#FFD700]" />
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#050505] ${member.status === 'Online' ? 'bg-green-500 shadow-[0_0_10px_green]' : member.status === 'Ocupado' ? 'bg-yellow-500 shadow-[0_0_10px_yellow]' : 'bg-gray-500'}`}></div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-mono text-[#A0A0A0] block opacity-50 mb-1 tracking-tighter">{member.id}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${member.clearance === 'GOD' ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5' : 'border-white/10 text-[#A0A0A0]'}`}>
                  {member.clearance}
                </span>
              </div>
            </div>

            <div className="px-8 pb-4 flex-1">
              <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#4DEEEA] transition-colors leading-tight">{member.name}</h4>
              <p className="text-[10px] text-[#A0A0A0] font-tech uppercase tracking-widest mb-6 border-b border-white/5 pb-2 w-fit">{member.department}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[8px] uppercase font-bold text-[#A0A0A0] tracking-widest">Efficiency Core</p>
                      <p className="text-2xl font-tech font-bold text-white tracking-tighter">{member.efficiency}%</p>
                   </div>
                   <div className="flex items-end space-x-0.5 h-8 w-20">
                      {member.trends.map((v, i) => (
                        <div key={i} className="flex-1 bg-[#4DEEEA]/30 rounded-t-[1px]" style={{ height: `${v}%` }}></div>
                      ))}
                   </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] shadow-[0_0_10px_#4DEEEA]" style={{ width: `${member.efficiency}%` }}></div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 space-y-3">
               <div className="flex items-center space-x-3">
                  <Activity size={12} className="text-[#4DEEEA] animate-pulse" />
                  <p className="text-[9px] text-[#A0A0A0] font-mono truncate uppercase tracking-tighter">{member.lastActivity}</p>
               </div>
               <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                     <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#A0A0A0] hover:text-white transition-all"><Mail size={12} /></button>
                     <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#A0A0A0] hover:text-white transition-all"><Smartphone size={12} /></button>
                  </div>
                  <button onClick={() => setSelectedMember(member)} className="text-[10px] text-[#FFD700] uppercase font-bold tracking-widest hover:underline flex items-center">
                    Full Profile <ArrowUpRight size={10} className="ml-1" />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {showSelfConfigModal && (
        <div className="fixed inset-0 z-[510] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="glass-panel max-w-xl w-full rounded-[60px] border border-[#4DEEEA]/30 p-12 space-y-10 relative shadow-[0_0_100px_rgba(77,238,234,0.15)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4DEEEA] to-transparent"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-tech font-bold uppercase tracking-widest gradient-lumina">Bio-Configuración</h3>
                <p className="text-[10px] text-[#A0A0A0] uppercase font-mono tracking-widest mt-1">NODO_ID: {myProfile.id} | <span className="text-[#FFD700]">SEC_8888</span></p>
              </div>
              <button onClick={() => setShowSelfConfigModal(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleSelfUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Identidad Visual (Nombre)</label>
                <input name="name" defaultValue={myProfile.name} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#4DEEEA]/40 outline-none font-tech text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Enlace Móvil</label>
                <input name="phone" defaultValue={myProfile.phone} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#4DEEEA]/40 outline-none font-tech" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Estado Biométrico</label>
                <select name="status" defaultValue={myProfile.status} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:border-[#4DEEEA]/40 appearance-none">
                  <option value="Online">Online / Activo</option>
                  <option value="Ocupado">Ocupado / En Nodo</option>
                  <option value="Offline">Desconexión</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Perfil Operativo (Bio)</label>
                <textarea name="bio" defaultValue={myProfile.bio} rows={3} className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 focus:border-[#4DEEEA]/40 outline-none font-tech text-sm resize-none"></textarea>
              </div>
              <div className="md:col-span-2 pt-4 flex gap-4">
                 <button disabled={isProcessing} className="flex-1 py-5 bg-gradient-to-r from-[#4DEEEA] to-[#00C6C3] text-black font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    {isProcessing ? <Loader2 className="animate-spin mr-3" /> : <Shield className="mr-3" size={18} />}
                    {isProcessing ? 'Sincronizando...' : 'Firmar Cambios'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="glass-panel max-w-2xl w-full rounded-[60px] border border-[#4DEEEA]/20 overflow-hidden relative shadow-[0_0_100px_rgba(77,238,234,0.1)]">
              <button onClick={() => setSelectedMember(null)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl"><X size={24} /></button>
              <div className="p-12 space-y-10">
                 <div className="flex items-center space-x-8">
                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#4DEEEA] to-[#FFD700] p-[2px]">
                       <div className="w-full h-full rounded-[30px] bg-[#050505] flex items-center justify-center text-3xl font-bold italic text-white">
                          {selectedMember.name.charAt(0)}
                       </div>
                    </div>
                    <div>
                       <h3 className="text-4xl font-tech font-bold text-white uppercase tracking-tighter">{selectedMember.name}</h3>
                       <p className="text-xs text-[#4DEEEA] uppercase tracking-[0.4em] font-bold mt-1">{selectedMember.id} | {selectedMember.department}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                       <p className="text-[9px] uppercase font-bold text-[#A0A0A0] mb-2">Email Corporativo</p>
                       <p className="text-sm font-tech text-white">{selectedMember.email}</p>
                    </div>
                    <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                       <p className="text-[9px] uppercase font-bold text-[#A0A0A0] mb-2">Terminal Móvil</p>
                       <p className="text-sm font-tech text-white">{selectedMember.phone}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex-1 py-5 bg-[#4DEEEA] text-black font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center">
                       <Mail size={18} className="mr-3" /> Contactar
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Toast Manager Local */}
      <div className="fixed bottom-10 right-10 z-[600] space-y-3 w-72">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl glass-panel border animate-in slide-in-from-right-4 flex justify-between items-center ${t.type === 'error' ? 'border-red-500/50 text-red-400' : t.type === 'success' ? 'border-[#4DEEEA]/50 text-[#4DEEEA]' : 'border-white/20 text-white'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}><X size={14} /></button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500px); }
        }
      `}</style>
    </div>
  );
};
