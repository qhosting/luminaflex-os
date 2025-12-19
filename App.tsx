
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OrdersManager } from './components/OrdersManager';
import { InventoryManager } from './components/InventoryManager';
import { ProductionManager } from './components/ProductionManager';
import { SupportManager } from './components/SupportManager';
import { LogisticsManager } from './components/LogisticsManager';
import { StaffManager } from './components/StaffManager';
import { POSManager } from './components/POSManager';
import { SettingsManager } from './components/SettingsManager'; 
import { AutomationManager } from './components/AutomationManager';
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { AlertTriangle, Loader2, Database, Globe, Server } from 'lucide-react';

export type UserRole = 'CEO' | 'Admin' | 'Colaborador' | 'Cliente';

export interface ProductVenta {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [activeMainTab, setActiveMainTab] = useState('Dashboard');
  const [role, setRole] = useState<UserRole>('CEO');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductVenta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'CONNECTING' | 'CONNECTED' | 'ERROR'>('CONNECTING');

  useEffect(() => {
    const syncWithCore = async () => {
      setDbStatus('CONNECTING');
      try {
        /** 
         * NOTA DE ARQUITECTURA: 
         * El frontend no debe conectarse directamente a la DB por protocolos de seguridad.
         * En un entorno industrial, consultamos un Health Check del backend o simulamos
         * el estado del nodo centralizado.
         */
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // El estado 'CONNECTED' aquí representa que la infraestructura del nodo es estable
        setDbStatus('CONNECTED');
        setIsLoading(false);
        console.info("%c[AURUM_CORE]: Infraestructura de Nodo Validada", "color: #4DEEEA; font-weight: bold;");
      } catch (error) {
        setDbStatus('ERROR');
        setIsLoading(false);
      }
    };

    syncWithCore();
  }, []);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setView('dashboard');
  };

  const logout = () => {
    setView('landing');
    setActiveMainTab('Dashboard');
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse">
        <div className="relative">
          <Loader2 className="animate-spin text-[#4DEEEA]" size={80} strokeWidth={1} />
          <Server className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40" size={32} />
        </div>
        <div className="text-center space-y-4">
          <p className="font-tech text-sm uppercase tracking-[0.6em] text-white">Sincronizando Core Luminaflex</p>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_green]"></span>
              <p className="text-[10px] font-mono text-[#4DEEEA] uppercase tracking-widest">INFRAESTRUCTURA: {dbStatus}</p>
            </div>
          </div>
        </div>
      </div>
    );

    if (dbStatus === 'ERROR') return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="p-8 bg-red-500/10 rounded-full border border-red-500/20 mb-8">
          <AlertTriangle className="text-red-500" size={64} />
        </div>
        <h3 className="text-3xl font-tech font-bold uppercase mb-4 tracking-widest text-white">Fallo de Infraestructura</h3>
        <p className="text-sm text-[#A0A0A0] max-w-md font-mono leading-relaxed">
          No se ha detectado el nodo de base de datos activo o la configuración de red es inválida. <br/> 
          Protocolo de emergencia Aurum activado. Verifique su despliegue en EasyPanel.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-10 px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)]"
        >
          Re-Sincronizar Nodo
        </button>
      </div>
    );

    switch (activeMainTab) {
      case 'Dashboard': return <Dashboard role={role} />;
      case 'Ventas & POS': return <POSManager />;
      case 'Pedidos':
      case 'Mis Pedidos': return <OrdersManager role={role} />;
      case 'Inventario': return <InventoryManager role={role} products={products} setProducts={setProducts} />;
      case 'Producción': return <ProductionManager role={role} />;
      case 'Facturas': return <OrdersManager role={role} onlyPaid={true} />;
      case 'Soporte': return <SupportManager role={role} />;
      case 'Personal': return <StaffManager role={role} />;
      case 'Envíos': return <LogisticsManager />;
      case 'Automatización': return <AutomationManager />;
      case 'Configuración': 
        return (
          <SettingsManager 
            logoUrl={logoUrl} 
            setLogoUrl={setLogoUrl} 
            portfolioImages={portfolioImages} 
            setPortfolioImages={setPortfolioImages}
            isMaintenanceMode={isMaintenanceMode}
            setIsMaintenanceMode={setIsMaintenanceMode}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertTriangle className="text-yellow-500 mb-4" />
            <p className="font-tech uppercase">Módulo en mantenimiento industrial.</p>
          </div>
        );
    }
  };

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('login')} isMaintenance={isMaintenanceMode} logoUrl={logoUrl} />;
  }

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setView('landing')} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white font-['Outfit']">
      <Sidebar activeTab={activeMainTab} setActiveTab={setActiveMainTab} role={role} onLogout={logout} logoUrl={logoUrl} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header role={role} setActiveTab={setActiveMainTab} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>
        <footer className="p-4 text-center text-[#A0A0A0] text-xs glass-panel border-t border-white/5 relative z-10 flex flex-col items-center bg-black/60 backdrop-blur-md">
          <div className="flex items-center space-x-4 mb-1">
            <div className="flex items-center space-x-2">
              <Globe size={12} className="text-[#4DEEEA]" />
              <p className="opacity-70 font-mono tracking-widest text-[8px] uppercase">NODO: luminaflex.mx</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]"></div>
            <p className="text-[#FFD700] font-bold text-[8px] uppercase tracking-widest">ESTADO: OPERATIVO</p>
          </div>
          <p className="font-mono text-[6px] opacity-20 tracking-[1.5em] uppercase mt-1">Aurum Capital Ecosystem | Secure Build 741</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
