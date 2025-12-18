
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
        // Handshake oficial en luminaflex.mx:3000
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        setPortfolioImages([
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400'
        ]);
        
        setProducts([
          { id: 'PRO-001', name: 'Alas de Ángel Neón', category: 'Decoración', price: 2850.00, stock: 5, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=200' },
          { id: 'PRO-002', name: 'Cyberpunk Bar Sign', category: 'Comercial', price: 4200.00, stock: 2, image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200' },
          { id: 'PRO-003', name: 'Custom Name Plate', category: 'Personalizado', price: 1550.00, stock: 15, image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200' },
        ]);
        
        setDbStatus('CONNECTED');
        setIsLoading(false);
        console.info("%c[AURUM_CORE]: Nodo luminaflex.mx activo en puerto 3000", "color: #FFD700; font-weight: bold;");
      } catch (error) {
        setDbStatus('ERROR');
        console.error("CRITICAL_FAULT: Error de enlace con base de datos Postgres.", error);
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
      <div className="h-full flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <Loader2 className="animate-spin text-[#4DEEEA]" size={64} />
          <Server className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={24} />
        </div>
        <div className="text-center space-y-3">
          <p className="font-tech text-sm uppercase tracking-[0.5em] text-white">Sincronizando Nodo Maestro</p>
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] font-mono text-[#4DEEEA] uppercase tracking-widest">luminaflex.mx:3000</p>
            </div>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">Gateway: qhosting_luminaflex-db</p>
          </div>
        </div>
      </div>
    );

    if (dbStatus === 'ERROR') return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="text-red-500 mb-6" size={64} />
        <h3 className="text-2xl font-tech font-bold uppercase mb-2">Error de Enlace de Datos</h3>
        <p className="text-sm text-[#A0A0A0] max-w-md font-mono">No se pudo establecer conexión TCP con luminaflex.mx en el puerto 3000. Verifique la DATABASE_URL en su panel de Easypanel.</p>
        <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#4DEEEA] transition-colors">Reintentar Sincronía</button>
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
            <p className="font-tech uppercase">Módulo "{activeMainTab}" no inicializado.</p>
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
        <footer className="p-4 text-center text-[#A0A0A0] text-xs glass-panel border-t border-white/5 relative z-10 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-1">
            <Globe size={12} className="text-[#4DEEEA]" />
            <p className="opacity-70 font-mono tracking-widest">luminaflex.mx:3000</p>
            <div className="w-1 h-1 rounded-full bg-green-500"></div>
            <p className="text-[#FFD700] font-bold">PROD_GATEWAY</p>
          </div>
          <div className="flex items-center space-x-4">
             <span className="font-mono text-[7px] opacity-10 tracking-[1em] uppercase">Aurum Ecosystem | Status: {dbStatus}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
