import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Database, 
  Save, 
  RefreshCw,
  Sparkles,
  Cloud,
  Download,
  CheckCircle2,
  Loader2,
  CloudUpload,
  ShieldEllipsis,
  ImageIcon,
  X,
  Trash2,
  Plus,
  Maximize2,
  Layers,
  Palette,
  Cpu,
  Power,
  ShieldAlert,
  Code2,
  Copy
} from 'lucide-react';

interface BackupEntry {
  id: string;
  date: string;
  size: string;
  status: 'COMPLETED' | 'ENCRYPTING' | 'FAILED' | 'UPLOADING';
  cloudSynced: boolean;
  node: string;
}

interface SettingsManagerProps {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  portfolioImages: string[];
  setPortfolioImages: React.Dispatch<React.SetStateAction<string[]>>;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (val: boolean) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ 
  logoUrl, 
  setLogoUrl, 
  portfolioImages, 
  setPortfolioImages,
  isMaintenanceMode,
  setIsMaintenanceMode
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'GENERAL' | 'MEDIA' | 'AI' | 'DATABASE' | 'CLOUD' | 'SECURITY'>('GENERAL');
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [backups, setBackups] = useState<BackupEntry[]>([
    { id: 'BK-741-01', date: '2024-05-24 03:00', size: '1.2 GB', status: 'COMPLETED', cloudSynced: true, node: 'MX-NODE-01' },
    { id: 'BK-741-02', date: '2024-05-23 03:00', size: '1.1 GB', status: 'COMPLETED', cloudSynced: true, node: 'MX-NODE-01' },
    { id: 'BK-741-03', date: '2024-05-22 03:00', size: '1.1 GB', status: 'COMPLETED', cloudSynced: false, node: 'MX-NODE-01' },
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [driveConnected, setDriveConnected] = useState(true);

  const sqlSchema = `-- LUMINAFLEX OS | MASTER DATABASE SCHEMA
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('CEO', 'Admin', 'Colaborador', 'Cliente')),
    status VARCHAR(20) DEFAULT 'Online'
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    stock INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS inventory_insumos (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stock_current DECIMAL(12,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendiente'
);`;

  const copySchema = () => {
    navigator.clipboard.writeText(sqlSchema);
    alert("Esquema SQL maestro copiado para el nodo qhosting_luminaflex-db.");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => Math.min(100, Math.max(97, prev + (Math.random() > 0.5 ? 0.05 : -0.05))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const triggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBk: BackupEntry = {
        id: `BK-741-0${backups.length + 1}`,
        date: new Date().toLocaleString(),
        size: '1.34 GB',
        status: 'UPLOADING',
        cloudSynced: false,
        node: 'MX-NODE-01'
      };
      setBackups([newBk, ...backups]);
      
      setTimeout(() => {
        setBackups(current => 
          current.map(b => b.id === newBk.id ? { ...b, status: 'COMPLETED', cloudSynced: true } : b)
        );
        setIsBackingUp(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4DEEEA 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10 relative z-10">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2 py-0.5 bg-[#4DEEEA]/10 text-[#4DEEEA] text-[8px] font-bold rounded border border-[#4DEEEA]/20 tracking-[0.3em]">MASTER_CONTROL_LAYER</span>
            <span className="text-[8px] text-[#A0A0A0] font-mono">ESTADO DRIVE: <span className={driveConnected ? "text-green-500" : "text-red-500"}>{driveConnected ? "ACTIVO" : "OFFLINE"}</span></span>
          </div>
          <h3 className="text-5xl font-tech font-bold uppercase tracking-tighter gradient-lumina leading-tight">Control Maestro</h3>
          <p className="text-[11px] text-[#A0A0A0] uppercase tracking-[0.5em] mt-2 font-bold">Protocolo de Armonía: <span className="text-[#FFD700]">741 8 520</span></p>
        </div>
        
        <div className="flex items-center space-x-4">
           {isMaintenanceMode && (
             <div className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-[9px] font-bold uppercase tracking-widest animate-pulse">
                <ShieldAlert size={14} /> <span>Mantenimiento Activo</span>
             </div>
           )}
           <div className="text-right mr-4 hidden xl:block">
              <p className="text-[9px] uppercase font-bold text-[#A0A0A0] tracking-widest">Estado del Ecosistema</p>
              <p className="text-xl font-tech font-bold text-[#4DEEEA]">{systemHealth.toFixed(2)}%</p>
           </div>
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold rounded-2xl neon-glow-hover uppercase text-xs tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(255,215,0,0.2)]"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isSaving ? 'Fijar Cambios' : 'Escribir en Core'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="w-full lg:w-72 space-y-3">
          {[
            { id: 'GENERAL', label: 'Global & Branding', icon: Globe },
            { id: 'MEDIA', label: 'Media & Galería', icon: ImageIcon },
            { id: 'AI', label: 'AI Nexus Engine', icon: Cpu },
            { id: 'DATABASE', label: 'Esquema & DB', icon: Database },
            { id: 'CLOUD', label: 'Google Drive Sync', icon: Cloud },
            { id: 'SECURITY', label: 'Bóveda Cuántica', icon: ShieldCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl transition-all border group ${activeSubTab === tab.id ? 'bg-white/[0.03] border-[#4DEEEA]/40 text-white shadow-[0_0_25px_rgba(77,238,234,0.15)]' : 'border-transparent text-[#A0A0A0] hover:bg-white/5'}`}
            >
              <div className="flex items-center space-x-4">
                <tab.icon size={20} className={activeSubTab === tab.id ? 'text-[#4DEEEA]' : 'group-hover:text-white'} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
              </div>
              {activeSubTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#4DEEEA] shadow-[0_0_8px_#4DEEEA]"></div>}
            </button>
          ))}
        </div>

        <div className="flex-1 glass-panel rounded-[56px] border border-white/5 p-12 min-h-[650px] relative overflow-hidden shadow-2xl">
          {activeSubTab === 'DATABASE' ? (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#4DEEEA]/10 rounded-2xl border border-[#4DEEEA]/20"><Database size={24} className="text-[#4DEEEA]" /></div>
                    <div>
                      <h4 className="text-2xl font-tech font-bold text-white uppercase tracking-widest">Esquema de Base de Datos</h4>
                      <p className="text-[9px] text-[#A0A0A0] uppercase mt-1">Gateway: qhosting_luminaflex-db</p>
                    </div>
                  </div>
               </div>

               <div className="p-8 bg-black/60 rounded-[32px] border border-white/10 font-mono text-xs overflow-hidden relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={copySchema} className="p-3 bg-white/5 hover:bg-[#4DEEEA] hover:text-black rounded-xl flex items-center space-x-2 transition-all">
                      <Copy size={14} /> <span>Copiar SQL</span>
                    </button>
                  </div>
                  <pre className="text-[#4DEEEA]/80 leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
{sqlSchema}
                  </pre>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                     <p className="text-[10px] uppercase font-bold text-[#FFD700] tracking-widest">Verificación de Integridad</p>
                     <p className="text-xs text-[#A0A0A0]">Nodo qhosting reporta tablas activas con redundancia Aurum.</p>
                  </div>
                  <button onClick={triggerBackup} className="p-6 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-3xl flex items-center justify-center space-x-4 transition-all group">
                     <RefreshCw size={24} className="text-[#4DEEEA] group-hover:rotate-180 transition-transform duration-700" />
                     <span className="text-xs uppercase font-bold tracking-widest">Forzar Re-Sincronización</span>
                  </button>
               </div>
            </div>
          ) : (
            <div className="text-center py-20 opacity-20">
               <Layers size={64} className="mx-auto mb-4" />
               <p className="font-tech text-xl uppercase">Módulo en Desarrollo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};