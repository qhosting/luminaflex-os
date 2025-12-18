
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  Bell, 
  Clock, 
  Calendar, 
  Plus, 
  User, 
  X,
  History,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../App';

interface Reminder {
  id: string;
  customer: string;
  topic: string;
  time: string;
  priority: 'Baja' | 'Alta';
  status: 'PENDING' | 'DONE';
}

export const SupportManager: React.FC<{ role: UserRole }> = ({ role }) => {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([
    { from: 'AI', text: 'Bienvenido al canal de soporte prioritario de Luminaflex. ¿En qué puedo asistirle hoy?' }
  ]);
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 'REM-001', customer: 'Velvet Lounge', topic: 'Seguimiento de Instalación', time: 'En 2 horas', priority: 'Alta', status: 'PENDING' },
    { id: 'REM-002', customer: 'Aether Studio', topic: 'Confirmación de Color Neón', time: 'Mañana 10:00', priority: 'Baja', status: 'PENDING' },
  ]);
  const [showAddReminder, setShowAddReminder] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg) return;
    setChat([...chat, { from: 'USER', text: msg }]);
    setMsg('');
    setTimeout(() => {
      setChat(prev => [...prev, { from: 'AI', text: 'Entendido. He escalado su consulta al departamento correspondiente. Protocolo 8888 activo.' }]);
    }, 1000);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: r.status === 'DONE' ? 'PENDING' : 'DONE' } : r));
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-180px)] gap-8 animate-in fade-in duration-700 relative">
      
      {/* Panel Principal de Chat (Chatwoot Bridge) */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#4DEEEA]/10 rounded-2xl text-[#4DEEEA]">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-tech font-bold uppercase tracking-widest text-white">Soporte Técnico</h3>
              <p className="text-[10px] text-[#A0A0A0] uppercase font-mono tracking-widest">Protocolo Chatwoot: <span className="text-[#FFD700]">ACTIVE</span></p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <Bot size={16} className="text-[#4DEEEA]" />
            <span className="text-[10px] font-bold text-[#A0A0A0] uppercase">IA Core Online</span>
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-[40px] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {chat.map((c, i) => (
              <div key={i} className={`flex ${c.from === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-5 rounded-3xl border ${c.from === 'AI' ? 'bg-white/5 border-white/10 rounded-bl-none' : 'bg-[#4DEEEA]/10 border-[#4DEEEA]/20 rounded-br-none text-white'}`}>
                  <p className="text-sm leading-relaxed">{c.text}</p>
                  <p className="text-[8px] mt-2 opacity-30 font-mono uppercase tracking-widest">{c.from === 'AI' ? 'AI Response Core' : 'Client Terminal'}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="p-6 bg-white/[0.02] border-t border-white/5 relative">
            <span className="absolute -top-3 left-8 text-[7px] font-mono text-[#4DEEEA] opacity-30">SOLVER-520</span>
            <div className="relative">
              <input 
                type="text" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Escriba su consulta técnica..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-white/20 outline-none focus:border-[#4DEEEA]/40 transition-all font-tech"
              />
              <button className="absolute right-2 top-2 p-3 bg-[#4DEEEA] text-black rounded-xl transition-transform active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sidebar de Recordatorios (Chatwoot Enhancements) */}
      <div className="w-full xl:w-96 flex flex-col space-y-6">
        <div className="glass-panel p-8 rounded-[40px] border border-white/5 flex flex-col h-full overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-[#FFD700] pointer-events-none">
             <Clock size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h4 className="text-xl font-tech font-bold uppercase tracking-widest text-white flex items-center">
              <Bell size={20} className="text-[#FFD700] mr-3" /> Recordatorios
            </h4>
            <button 
              onClick={() => setShowAddReminder(true)}
              className="p-2 bg-white/5 hover:bg-[#FFD700] hover:text-black rounded-xl transition-all"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {reminders.map((rem) => (
              <div 
                key={rem.id} 
                onClick={() => toggleReminder(rem.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer group flex flex-col space-y-3 ${rem.status === 'DONE' ? 'opacity-40 bg-white/5 border-transparent' : 'bg-white/[0.02] border-white/5 hover:border-[#FFD700]/30'}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`px-2 py-0.5 rounded text-[8px] font-bold border ${rem.priority === 'Alta' ? 'border-red-500/30 text-red-500' : 'border-[#4DEEEA]/30 text-[#4DEEEA]'}`}>
                    {rem.priority}
                  </div>
                  <span className="text-[9px] font-mono text-[#A0A0A0]">{rem.time}</span>
                </div>
                <div>
                   <h5 className={`text-xs font-bold uppercase tracking-tight ${rem.status === 'DONE' ? 'line-through' : 'text-white'}`}>{rem.customer}</h5>
                   <p className="text-[10px] text-[#A0A0A0] mt-1 line-clamp-2">{rem.topic}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                   <div className="flex items-center space-x-2 text-[8px] font-bold text-[#FFD700] uppercase tracking-widest">
                     <History size={10} /> <span>Chatwoot Sync</span>
                   </div>
                   {rem.status === 'DONE' ? <CheckCircle2 size={12} className="text-green-500" /> : <MoreHorizontal size={12} className="text-[#A0A0A0]" />}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest italic">Nexus Reminder Engine: v2.1</p>
          </div>
        </div>
      </div>

      {/* Modal Agregar Recordatorio */}
      {showAddReminder && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="glass-panel max-w-lg w-full rounded-[60px] border border-[#FFD700]/20 p-12 space-y-10 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-30"></div>
              <h3 className="text-3xl font-tech font-bold uppercase tracking-widest gradient-lumina">Agendar Seguimiento</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Cliente / Ticket</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={16} />
                    <input type="text" placeholder="BUSCAR EN CHATWOOT..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[#FFD700]/40 outline-none text-xs font-tech tracking-widest" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Fecha Alerta</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={16} />
                      <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-[#FFD700]/40 outline-none text-xs text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-[#A0A0A0] ml-2 tracking-widest">Prioridad</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#FFD700]/40 outline-none text-xs text-white appearance-none">
                      <option>BAJA</option>
                      <option>ALTA</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => setShowAddReminder(false)}
                  className="w-full py-5 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold uppercase tracking-[0.3em] rounded-2xl text-xs shadow-lg hover:scale-[1.02] transition-all"
                >
                  Confirmar Recordatorio
                </button>
                <button 
                  onClick={() => setShowAddReminder(false)}
                  className="w-full text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(77, 238, 234, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(77, 238, 234, 0.3);
        }
        select option {
          background-color: #050505;
          color: white;
        }
      `}</style>
    </div>
  );
};
