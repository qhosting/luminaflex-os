
import React, { useState } from 'react';
import { 
  Workflow, 
  Zap, 
  Play, 
  RefreshCw, 
  Activity, 
  Database, 
  Cloud, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Clock,
  ExternalLink,
  CloudUpload
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  name: string;
  status: 'Active' | 'Idle' | 'Error';
  type: 'Chatwoot' | 'Drive' | 'DB' | 'n8n' | 'CloudBackup';
  lastRun: string;
}

export const AutomationManager: React.FC = () => {
  const [nodes] = useState<WorkflowNode[]>([
    { id: 'WF-01', name: 'Chatwoot -> Nexus AI Sync', status: 'Active', type: 'Chatwoot', lastRun: 'Hace 2 min' },
    { id: 'WF-02', name: 'Drive Auto-Backup DXF', status: 'Active', type: 'Drive', lastRun: 'Hace 15 min' },
    { id: 'WF-03', name: 'n8n Master Controller', status: 'Active', type: 'n8n', lastRun: 'Online' },
    { id: 'WF-05', name: 'DB -> Cloud Drive Backup', status: 'Active', type: 'CloudBackup', lastRun: 'Hace 5 min' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-[#4DEEEA]/10 text-[#4DEEEA] text-[8px] font-bold rounded border border-[#4DEEEA]/20 tracking-[0.3em]">n8n_ENGINE_v4</span>
            <span className="text-[8px] text-[#A0A0A0] font-mono tracking-tighter uppercase italic">Ref: 548 748 718</span>
          </div>
          <h3 className="text-4xl font-tech font-bold uppercase tracking-tighter gradient-lumina">Automation Hub</h3>
          <p className="text-[10px] text-[#A0A0A0] uppercase tracking-[0.4em] mt-2 font-bold italic text-white/40">Nexus Control Layer: <span className="text-[#FFD700]">ACTIVE</span></p>
        </div>
        
        <button className="flex items-center space-x-3 px-8 py-3 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all font-tech font-bold uppercase text-[10px] tracking-widest">
           <ExternalLink size={14} /> <span>Abrir n8n Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border border-white/5 relative overflow-hidden h-[500px] flex flex-col">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4DEEEA 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-xl font-tech font-bold uppercase tracking-widest text-white">Red de Automatización Aurum</h4>
               <div className="flex items-center space-x-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  <Activity size={14} className="animate-pulse" /> <span>Nodos Operativos</span>
               </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[85%] h-[1px] bg-gradient-to-r from-transparent via-[#4DEEEA]/20 to-transparent"></div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10 w-full px-4">
                  {nodes.map(node => (
                    <div key={node.id} className="flex flex-col items-center group">
                       <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[24px] glass-panel border border-white/10 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:border-[#4DEEEA]/40 group-hover:shadow-[0_0_30px_rgba(77,238,234,0.15)] relative overflow-hidden`}>
                          <div className={`absolute inset-0 opacity-[0.1] bg-[#4DEEEA] transition-all group-hover:opacity-[0.2]`}></div>
                          {node.type === 'Chatwoot' && <MessageSquare className="text-white" size={20} />}
                          {node.type === 'Drive' && <Cloud className="text-white" size={20} />}
                          {node.type === 'DB' && <Database className="text-white" size={20} />}
                          {node.type === 'n8n' && <Workflow className="text-[#4DEEEA]" size={20} />}
                          {node.type === 'CloudBackup' && <CloudUpload className="text-[#FFD700]" size={20} />}
                       </div>
                       <p className="text-[9px] font-bold uppercase text-white tracking-widest text-center">{node.name}</p>
                       <p className="text-[8px] font-mono text-[#A0A0A0] mt-1">{node.status}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
               <div className="flex items-center space-x-3 text-[10px] font-mono text-[#A0A0A0]">
                  <Clock size={14} /> <span>Sincronía Drive -> Database: <span className="text-[#4DEEEA]">COMPLETADA</span></span>
               </div>
               <button className="text-[10px] font-bold text-[#FFD700] uppercase hover:underline">Auditar Logs Cloud</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-black/40 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
               <Terminal size={18} className="text-[#4DEEEA]" />
               <h4 className="text-lg font-tech font-bold uppercase tracking-widest">Logs de Sincronía Cloud</h4>
            </div>
            
            <div className="flex-1 space-y-4 font-mono text-[9px] overflow-y-auto pr-2 custom-scrollbar">
               {[
                 { time: '14:20:01', msg: 'CLOUD_BACKUP: START_UPLOAD (SQL_DUMP)', type: 'info' },
                 { time: '14:20:15', msg: 'DRIVE_AUTH: TOKEN_REFRESH_SUCCESS', type: 'success' },
                 { time: '14:21:45', msg: 'CHUNKING: DATA_ENCRYPTION_AES256', type: 'info' },
                 { time: '14:22:10', msg: 'CLOUD_BACKUP: SUCCESS (1.34 GB)', type: 'success' },
                 { time: '14:23:00', msg: 'DRIVE_V3: FILE_INDEXED_AURUM_DB', type: 'success' },
                 { time: '14:25:00', msg: 'METAFISICA: SEC_71427321893_APPLIED', type: 'info' },
               ].map((log, i) => (
                 <div key={i} className={`flex space-x-3 p-3 rounded-xl bg-white/[0.02] border-l-2 ${log.type === 'error' ? 'border-red-500 text-red-400' : log.type === 'warning' ? 'border-yellow-500 text-yellow-400' : log.type === 'success' ? 'border-green-500 text-green-400' : 'border-[#4DEEEA] text-white/40'}`}>
                    <span className="opacity-40">{log.time}</span>
                    <span className="font-bold uppercase tracking-tighter">{log.msg}</span>
                 </div>
               ))}
            </div>
            
            <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 text-[#A0A0A0] font-bold uppercase text-[9px] tracking-widest rounded-2xl transition-all border border-white/5">
               Exportar Reporte Cloud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
