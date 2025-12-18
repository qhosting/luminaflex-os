
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Zap, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Clock, 
  Settings, 
  LogOut, 
  Shield, 
  UserCircle 
} from 'lucide-react';
import { UserRole } from '../App';

interface HeaderProps {
  role: UserRole;
  setActiveTab?: (tab: string) => void;
  onLogout?: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'success';
  read: boolean;
}

export const Header: React.FC<HeaderProps> = ({ role, setActiveTab, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 'NT-001', 
      title: 'Producción Completada', 
      message: 'El letrero LX-901 "Cyber Punk Bar" ha pasado Control Q/A.', 
      time: 'Hace 5 min', 
      type: 'success', 
      read: false 
    },
    { 
      id: 'NT-002', 
      title: 'Stock Crítico', 
      message: 'Insumo "Transformadores 12V" por debajo del mínimo (2 unidades).', 
      time: 'Hace 12 min', 
      type: 'alert', 
      read: false 
    },
    { 
      id: 'NT-003', 
      title: 'Nuevo Prospecto AI', 
      message: 'Nexus AI ha generado un presupuesto para un nuevo cliente corporativo.', 
      time: 'Hace 1 hora', 
      type: 'info', 
      read: true 
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const searchResults = searchTerm ? [
    { title: 'Órdenes Activas', module: 'Pedidos' },
    { title: 'Stock Neón Flex', module: 'Inventario' },
    { title: 'Chat Soporte', module: 'Soporte' },
    { title: 'Simulador CNC', module: 'Dashboard' }
  ].filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  return (
    <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-30 shrink-0 sticky top-0 backdrop-blur-xl">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold font-tech tracking-wider uppercase">
          Bienvenido, <span className={`${role === 'CEO' ? 'gradient-lumina font-bold' : 'text-[#FFD700]'}`}>
            {role === 'CEO' ? 'MODO DIOS' : role}
          </span>
        </h2>
        <p className="text-xs text-[#A0A0A0]">Nodo Operativo: {role === 'Cliente' ? 'External Portal' : 'México HQ'}</p>
      </div>

      <div className="flex items-center space-x-8">
        {/* Barra de Búsqueda Global */}
        <div className="relative group">
          <div className={`flex items-center transition-all duration-500 bg-white/5 rounded-2xl border border-transparent focus-within:border-[#4DEEEA]/30 ${showSearch ? 'w-64 px-2' : 'w-10 overflow-hidden'}`}>
             <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-[#A0A0A0] hover:text-white transition-colors">
               {showSearch ? <X size={20} /> : <Search size={20} />}
             </button>
             <input 
              type="text" 
              placeholder="COMANDAR OS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs font-tech tracking-widest text-[#4DEEEA] outline-none w-full placeholder:text-white/10"
             />
          </div>
          {searchTerm && showSearch && (
            <div className="absolute top-full mt-2 left-0 w-64 glass-panel rounded-2xl border border-white/10 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? searchResults.map((res, i) => (
                <button key={i} className="w-full text-left px-4 py-2 hover:bg-[#4DEEEA]/10 rounded-xl flex flex-col group">
                  <span className="text-[10px] font-bold text-white uppercase group-hover:text-[#4DEEEA]">{res.title}</span>
                  <span className="text-[8px] text-[#A0A0A0] uppercase font-mono">{res.module}</span>
                </button>
              )) : <div className="p-4 text-[10px] text-center opacity-40 uppercase">Sin resultados</div>}
            </div>
          )}
        </div>

        {(role === 'CEO' || role === 'Admin') && (
          <>
            <div className="hidden md:flex items-center space-x-3 group cursor-help">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-[#4DEEEA]/20 group-hover:border-[#4DEEEA] transition-all">
                <Zap size={18} className="text-[#4DEEEA]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A0A0A0] uppercase tracking-tighter">Producción Activa</p>
                <p className="text-sm font-bold font-tech text-white">42 Proyectos</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3 group cursor-help">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-[#FFD700]/20 group-hover:border-[#FFD700] transition-all">
                <span className="text-[#FFD700] font-bold text-lg">$</span>
              </div>
              <div>
                <p className="text-[10px] text-[#A0A0A0] uppercase tracking-tighter">Ventas del Mes</p>
                <p className="text-sm font-bold font-tech text-white">$ 2.4M MXN</p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center space-x-4">
          {/* Sistema de Notificaciones */}
          <div className="relative" ref={notificationMenuRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 transition-colors relative rounded-xl ${showNotifications ? 'bg-[#4DEEEA]/10 text-[#4DEEEA]' : 'text-[#A0A0A0] hover:text-[#4DEEEA] hover:bg-white/5'}`}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-4 w-80 glass-panel rounded-[32px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-4 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center">
                    <Zap size={12} className="text-[#4DEEEA] mr-2" /> 
                    Centro de Alertas
                  </h4>
                  <button onClick={clearNotifications} className="text-[9px] uppercase text-[#A0A0A0] hover:text-red-500 transition-colors flex items-center">
                    <Trash2 size={12} className="mr-1" /> Limpiar
                  </button>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif.id)}
                        className={`p-5 border-b border-white/5 cursor-pointer hover:bg-white/[0.03] transition-colors relative group ${!notif.read ? 'bg-[#4DEEEA]/5' : ''}`}
                      >
                        {!notif.read && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-[#4DEEEA] shadow-[0_0_10px_#4DEEEA]"></div>
                        )}
                        <div className="flex items-start space-x-4">
                          <div className={`mt-1 p-2 rounded-lg ${
                            notif.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                            notif.type === 'alert' ? 'bg-red-500/10 text-red-500' : 
                            'bg-[#4DEEEA]/10 text-[#4DEEEA]'
                          }`}>
                            {notif.type === 'success' ? <CheckCircle2 size={14} /> : 
                             notif.type === 'alert' ? <AlertTriangle size={14} /> : 
                             <Info size={14} />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h5 className={`text-[10px] font-bold uppercase tracking-tight ${notif.read ? 'text-white/60' : 'text-white'}`}>
                              {notif.title}
                            </h5>
                            <p className="text-[10px] text-[#A0A0A0] leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="flex items-center pt-2 text-[8px] font-mono text-[#4DEEEA]/60 uppercase">
                              <Clock size={10} className="mr-1" /> {notif.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center opacity-20">
                      <Bell size={40} className="mx-auto mb-4" />
                      <p className="text-[10px] uppercase font-bold tracking-widest">Sin notificaciones</p>
                    </div>
                  )}
                </div>
                
                <button className="w-full py-4 text-[9px] uppercase font-bold text-[#A0A0A0] hover:text-[#4DEEEA] hover:bg-white/5 transition-all tracking-[0.2em] border-t border-white/5">
                  Ver Historial Completo
                </button>
              </div>
            )}
          </div>

          {/* Menú de Perfil de Usuario */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 pl-4 focus:outline-none group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white uppercase group-hover:text-[#4DEEEA] transition-colors">{role}</p>
                <p className="text-[10px] text-[#A0A0A0] uppercase font-mono opacity-60">ID: MX-419 | <span className="text-[#FFD700]/50">8888</span></p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DEEEA] to-[#FFD700] p-[2px] transition-transform duration-300 ${showUserMenu ? 'scale-110 shadow-[0_0_20px_rgba(77,238,234,0.4)]' : 'hover:scale-105'}`}>
                <div className="w-full h-full rounded-xl bg-[#050505] flex items-center justify-center">
                  <User size={18} className="text-[#FFD700]" />
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-4 w-72 glass-panel rounded-[40px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 overflow-hidden p-2">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] rounded-t-[36px] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#4DEEEA] to-[#FFD700] p-[1px] mb-4">
                    <div className="w-full h-full rounded-[23px] bg-[#050505] flex items-center justify-center">
                      <UserCircle size={32} className="text-white/80" />
                    </div>
                  </div>
                  <p className="text-sm font-tech font-bold text-white uppercase tracking-widest">{role === 'CEO' ? 'MODO DIOS / AURUM' : role}</p>
                  <p className="text-[9px] text-[#A0A0A0] uppercase tracking-[0.2em] font-mono mt-1">Sincronización: Activa</p>
                </div>

                <div className="p-2 space-y-1">
                  {(role === 'CEO' || role === 'Admin' || role === 'Colaborador') && (
                    <button 
                      onClick={() => { setActiveTab?.('Personal'); setShowUserMenu(false); }}
                      className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl hover:bg-white/[0.05] transition-all group"
                    >
                      <User className="text-[#A0A0A0] group-hover:text-[#4DEEEA]" size={18} />
                      <span className="text-[10px] uppercase font-bold text-[#A0A0A0] group-hover:text-white tracking-widest">Mi Perfil Bio</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => { setActiveTab?.('Configuración'); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl hover:bg-white/[0.05] transition-all group"
                  >
                    <Settings className="text-[#A0A0A0] group-hover:text-[#4DEEEA]" size={18} />
                    <span className="text-[10px] uppercase font-bold text-[#A0A0A0] group-hover:text-white tracking-widest">Ajustes del Nodo</span>
                  </button>

                  <button 
                    onClick={() => { setShowUserMenu(false); /* Simular cambio de seguridad */ }}
                    className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl hover:bg-white/[0.05] transition-all group"
                  >
                    <Shield className="text-[#A0A0A0] group-hover:text-[#FFD700]" size={18} />
                    <span className="text-[10px] uppercase font-bold text-[#A0A0A0] group-hover:text-white tracking-widest">Security Level</span>
                  </button>

                  <div className="h-[1px] bg-white/5 my-2 mx-4"></div>

                  <button 
                    onClick={() => { onLogout?.(); setShowUserMenu(false); }}
                    className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl hover:bg-red-500/10 transition-all group"
                  >
                    <LogOut className="text-red-500/60 group-hover:text-red-500" size={18} />
                    <span className="text-[10px] uppercase font-bold text-red-500/60 group-hover:text-red-500 tracking-widest">Desconectar Nodo</span>
                  </button>
                </div>
                
                <div className="p-4 bg-black/40 text-center rounded-b-[36px]">
                  <p className="text-[7px] font-mono text-[#4DEEEA]/20 tracking-[1em] uppercase">Aurum Ecosystem</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
