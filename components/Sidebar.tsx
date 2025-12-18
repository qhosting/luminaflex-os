
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Activity, 
  Package, 
  Truck,
  LogOut,
  Users,
  Settings,
  HelpCircle,
  FileText,
  CreditCard,
  Workflow
} from 'lucide-react';
import { UserRole } from '../App';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout: () => void;
  logoUrl: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout, logoUrl }) => {
  const getMenuItems = () => {
    const base = [{ name: 'Dashboard', icon: LayoutDashboard }];
    
    if (role === 'CEO' || role === 'Admin') {
      return [
        ...base,
        { name: 'Ventas & POS', icon: CreditCard },
        { name: 'Pedidos', icon: ShoppingCart },
        { name: 'Producción', icon: Activity },
        { name: 'Inventario', icon: Package },
        { name: 'Envíos', icon: Truck },
        { name: 'Personal', icon: Users },
        { name: 'Automatización', icon: Workflow },
        { name: 'Configuración', icon: Settings },
      ];
    }
    
    if (role === 'Colaborador') {
      return [
        ...base,
        { name: 'Ventas & POS', icon: CreditCard },
        { name: 'Producción', icon: Activity },
        { name: 'Inventario', icon: Package },
      ];
    }

    if (role === 'Cliente') {
      return [
        ...base,
        { name: 'Mis Pedidos', icon: ShoppingCart },
        { name: 'Facturas', icon: FileText },
        { name: 'Soporte', icon: HelpCircle },
      ];
    }
    
    return base;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col z-20 transition-all duration-300">
      <div className="p-8 flex items-center justify-center">
        <div className="relative group cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
          {logoUrl ? (
            <div className="max-h-12 w-full flex items-center justify-center px-4">
               <img src={logoUrl} alt="Luminaflex Logo" className="max-h-full object-contain filter brightness-110 drop-shadow-[0_0_8px_rgba(77,238,234,0.3)]" />
            </div>
          ) : (
            <h1 className="text-2xl font-bold font-tech gradient-lumina tracking-tighter italic">
              LuminaFlex
            </h1>
          )}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[#A0A0A0] font-bold opacity-50">Menú Principal</p>
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.name;
          const Icon = item.icon;
          
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative group neon-glow-hover border border-transparent
                ${isActive ? 'bg-gradient-to-r from-white/5 to-transparent' : 'hover:bg-white/5'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#4DEEEA] shadow-[0_0_8px_#4DEEEA]" />
              )}
              <Icon size={18} className={`${isActive ? 'text-[#FFD700]' : 'text-[#A0A0A0] group-hover:text-white'}`} />
              <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-[#FFD700]' : 'text-[#A0A0A0] group-hover:text-white'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-[#A0A0A0] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
        <div className="p-4 rounded-2xl glass-panel border border-[#B8860B]/30 bg-gradient-to-br from-[#B8860B]/10 to-transparent">
          <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold">Holding</p>
          <p className="text-sm font-tech text-white">Aurum Capital</p>
        </div>
      </div>
    </aside>
  );
};
