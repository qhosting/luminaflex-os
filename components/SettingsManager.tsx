
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
  ShieldAlert
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPortfolioImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
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
            { id: 'DATABASE', label: 'Centro de Backups', icon: Database },
            { id: 'CLOUD', label: 'Google Drive Sync', icon: Cloud },
            { id: 'SECURITY', label: 'Bóveda Cuántica', icon: ShieldCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl transition-all border group ${activeSubTab === tab.id ? 'bg-white/[0.03] border-[#4DEEEA]/40 text-white shadow-[0_0_25px_rgba(77,238,234,0.1)]' : 'border-transparent text-[#A0A0A0] hover:bg-white/5'}`}
            >
              <div className="flex items-center space-x-4">
                <tab.icon size={20} className={activeSubTab === tab.id ? 'text-[#4DEEEA]' : 'group-hover:text-white'} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
              </div>
              {activeSubTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#4DEEEA] shadow-[0_0_8px_#4DEEEA]"></div>}
            </button>
          ))}
          
          <div className="mt-12 p-8 glass-panel rounded-[40px] border border-[#FFD700]/10 bg-gradient-to-br from-[#FFD700]/5 to-transparent relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-[#FFD700]">
              <ShieldEllipsis size={120} />
            </div>
            <p className="text-[9px] uppercase font-bold text-[#FFD700] tracking-widest mb-4 flex items-center">
              <Sparkles size={12} className="mr-2" /> Protección de Datos
            </p>
            <div className="space-y-4 relative z-10">
              <div className="space-y-1">
                <p className="text-[8px] text-[#A0A0A0] uppercase font-bold tracking-widest">Normalización Financiera</p>
                <p className="text-lg font-tech font-bold text-white tracking-[0.3em]">71427321893</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-[56px] border border-white/5 p-12 min-h-[650px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#4DEEEA]/10 animate-[scanline_8s_linear_infinite]"></div>
          
          {activeSubTab === 'GENERAL' && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#4DEEEA]/10 rounded-2xl border border-[#4DEEEA]/20"><Globe size={24} className="text-[#4DEEEA]" /></div>
                    <h4 className="text-2xl font-tech font-bold text-white uppercase tracking-widest">Identidad del Nodo</h4>
                  </div>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest ml-4">Nombre de la Organización</label>
                      <input type="text" defaultValue="Luminaflex México HQ" className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 px-8 text-white focus:border-[#4DEEEA]/50 outline-none font-tech text-xl transition-all" />
                    </div>

                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <h5 className="text-sm font-bold text-white uppercase flex items-center">
                               <Power size={14} className="mr-2 text-red-500" /> Modo Mantenimiento
                            </h5>
                            <p className="text-[9px] text-[#A0A0A0] uppercase tracking-widest">Oculta la Landing Page pública</p>
                         </div>
                         <button 
                           onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                           className={`w-14 h-7 rounded-full relative transition-all duration-500 ${isMaintenanceMode ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/10'}`}
                         >
                           <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${isMaintenanceMode ? 'left-8' : 'left-1'}`}></div>
                         </button>
                      </div>
                      <p className="text-[9px] text-[#A0A0A0] italic">
                        * Al activar, los visitantes verán una pantalla de calibración. El equipo podrá seguir accediendo mediante el login de ingeniería.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest ml-4">Logo del Sistema (OS Branding)</label>
                      <div className="flex flex-col space-y-4">
                         <div className="p-8 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center space-y-4 group/upload hover:border-[#4DEEEA]/30 transition-all cursor-pointer relative overflow-hidden">
                            {logoUrl ? (
                              <div className="relative z-10 flex flex-col items-center space-y-6">
                                 <img src={logoUrl} alt="Preview" className="max-h-24 object-contain filter drop-shadow-[0_0_15px_rgba(77,238,234,0.2)]" />
                                 <button onClick={() => setLogoUrl(null)} className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400 transition-colors">Eliminar Logo</button>
                              </div>
                            ) : (
                              <>
                                 <div className="p-5 bg-white/5 rounded-2xl text-[#A0A0A0] group-hover/upload:text-[#4DEEEA] transition-colors"><ImageIcon size={32} /></div>
                                 <div className="text-center">
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">Cargar Nuevo Emblema</p>
                                    <p className="text-[9px] text-[#A0A0A0] uppercase mt-1">Soporta PNG, SVG o JPG (Max 2MB)</p>
                                 </div>
                              </>
                            )}
                            <input type="file" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-8 glass-panel rounded-[40px] border border-white/5 bg-white/[0.02]">
                       <h5 className="text-[10px] uppercase font-bold text-[#FFD700] tracking-widest mb-6 flex items-center">
                         <Palette size={14} className="mr-2" /> Previsualización de Interfaz
                       </h5>
                       <div className="space-y-6">
                          <div className="h-20 w-full bg-black/40 rounded-2xl border border-white/10 flex items-center px-6">
                             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-4 overflow-hidden p-2">
                                {logoUrl ? <img src={logoUrl} className="max-h-full object-contain" /> : <Layers size={20} className="text-[#A0A0A0]" />}
                             </div>
                             <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#4DEEEA] w-1/3"></div>
                             </div>
                          </div>
                          <p className="text-[10px] text-[#A0A0A0] italic">Esta previsualización muestra cómo se integrará el emblema en los nodos de navegación lateral.</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeSubTab === 'MEDIA' && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#4DEEEA]/10 rounded-2xl border border-[#4DEEEA]/20"><ImageIcon size={24} className="text-[#4DEEEA]" /></div>
                    <h4 className="text-2xl font-tech font-bold text-white uppercase tracking-widest">Portafolio & Activos</h4>
                  </div>
                  <label className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[#4DEEEA] font-bold rounded-2xl cursor-pointer uppercase text-[10px] tracking-widest transition-all flex items-center">
                     <Plus size={14} className="mr-2" /> Cargar a Portafolio
                     <input type="file" multiple onChange={handlePortfolioUpload} className="hidden" accept="image/*" />
                  </label>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {portfolioImages.map((img, i) => (
                    <div key={i} className="aspect-square glass-panel rounded-3xl border border-white/5 overflow-hidden group relative">
                       <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                             <span className="text-[8px] font-mono text-white/40">IMG-741-{i+100}</span>
                             <button onClick={() => removePortfolioImage(i)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                <Trash2 size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                  <label className="aspect-square glass-panel rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#4DEEEA]/30 transition-all opacity-40 hover:opacity-100 group">
                     <CloudUpload size={32} className="text-[#A0A0A0] group-hover:text-[#4DEEEA] mb-3" />
                     <span className="text-[9px] uppercase font-bold tracking-widest">Nuevo Activo</span>
                     <input type="file" multiple onChange={handlePortfolioUpload} className="hidden" accept="image/*" />
                  </label>
               </div>
            </div>
          )}

          {activeSubTab === 'DATABASE' && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#4DEEEA]/10 rounded-2xl border border-[#4DEEEA]/20"><Database size={24} className="text-[#4DEEEA]" /></div>
                  <h4 className="text-2xl font-tech font-bold text-white uppercase tracking-widest">Backup Sistema a Drive</h4>
                </div>
                <button 
                  onClick={triggerBackup}
                  disabled={isBackingUp}
                  className="px-8 py-4 bg-gradient-to-r from-[#4DEEEA] to-[#00C6C3] text-black font-bold rounded-2xl uppercase text-[10px] tracking-widest flex items-center shadow-[0_0_20px_rgba(77,238,234,0.3)] transition-all hover:scale-105 active:scale-95"
                >
                  {isBackingUp ? <Loader2 className="animate-spin mr-2" /> : <CloudUpload size={14} className="mr-2" />}
                  {isBackingUp ? 'Sincronizando con Drive...' : 'Generar Respaldo en Nube'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
