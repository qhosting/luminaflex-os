
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  ShoppingCart, 
  ChevronRight, 
  Cpu, 
  Sparkles,
  MessageCircle,
  Target,
  PenTool,
  ArrowUp,
  Settings2,
  Lock,
  Loader2,
  Activity,
  Terminal,
  ShieldAlert
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  isMaintenance?: boolean;
  logoUrl?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, isMaintenance = false, logoUrl }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [countdown, setCountdown] = useState(14400);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
      setShowScrollTop(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll);
    
    let timer: any;
    if (isMaintenance) {
      timer = setInterval(() => {
        setCountdown(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearInterval(timer);
    };
  }, [isMaintenance]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-['Outfit']">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none font-mono text-[8px] flex flex-wrap content-start">
           {[...Array(100)].map((_, i) => (
             <span key={i} className="p-4 tracking-widest whitespace-nowrap">212585212 741 8888</span>
           ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(77,238,234,0.05)_0%,_transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/10 animate-[scanline_3s_linear_infinite]"></div>

        <div className="max-w-3xl w-full text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-1000">
           <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                 {logoUrl ? (
                   <img src={logoUrl} alt="Luminaflex Logo" className="h-20 object-contain filter grayscale opacity-50 blur-[1px]" />
                 ) : (
                   <h1 className="text-5xl font-tech font-bold gradient-lumina tracking-tighter italic opacity-40">LUMINA<span className="text-white opacity-40">FLEX</span></h1>
                 )}
                 <div className="absolute -inset-4 bg-red-500/20 blur-xl animate-pulse"></div>
              </div>
              <div className="px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full flex items-center space-x-3 text-red-500">
                 <ShieldAlert size={16} className="animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Calibración Cuántica en Curso</span>
              </div>
           </div>

           <div className="space-y-4">
              <h2 className="text-6xl md:text-7xl font-tech font-bold uppercase tracking-tighter leading-none">
                TU ACCESO <br />
                <span className="text-red-500">ESTÁ EN PAUSA</span>
              </h2>
              <p className="text-lg text-[#A0A0A0] max-w-xl mx-auto font-light leading-relaxed">
                Estamos optimizando tus herramientas de renderizado. Tu panel de control volverá a estar en línea tras la calibración del protocolo 741.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="glass-panel p-8 rounded-[40px] border border-white/5 space-y-2">
                 <p className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest">Tiempo de Re-Link</p>
                 <p className="text-4xl font-tech font-bold text-white">{formatTime(countdown)}</p>
              </div>
              <div className="glass-panel p-8 rounded-[40px] border border-white/5 space-y-2">
                 <p className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest">Estado del Nodo</p>
                 <div className="flex items-center justify-center space-x-3">
                    <Activity size={20} className="text-red-500 animate-pulse" />
                    <p className="text-2xl font-tech font-bold text-white">OFFLINE</p>
                 </div>
              </div>
           </div>

           <div className="pt-8">
              <button onClick={onEnter} className="group flex items-center mx-auto space-x-4 px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                <Lock size={16} className="text-[#A0A0A0] group-hover:text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A0A0A0] group-hover:text-white transition-colors">Entrada de Ingeniería</span>
              </button>
           </div>
        </div>
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-x-hidden font-['Outfit']">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] z-0 overflow-hidden select-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="whitespace-nowrap text-[8px] font-mono leading-none tracking-[3em] py-2">
            918197185 8888 520 741 918197185 8888 520 741
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 right-8 z-[100] flex flex-col space-y-4">
        {showScrollTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-[#4DEEEA] hover:text-black transition-all shadow-2xl">
            <ArrowUp size={20} />
          </button>
        )}
        <button className="group relative p-5 bg-[#4DEEEA] text-black rounded-full shadow-[0_0_30px_rgba(77,238,234,0.4)] hover:scale-110 transition-all flex items-center justify-center">
          <div className="absolute right-full mr-4 px-4 py-2 bg-black/80 backdrop-blur-md border border-[#4DEEEA]/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Tu Asesor Aurum
          </div>
          <MessageCircle size={24} />
        </button>
      </div>

      <nav className={`w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto z-50 sticky top-0 backdrop-blur-xl border-b transition-all duration-500 ${scrollPos > 50 ? 'border-white/10 bg-[#050505]/80' : 'border-transparent'}`}>
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
             {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10 object-contain" /> : <h1 className="text-3xl font-tech font-bold gradient-lumina tracking-tighter italic">LUMINA<span className="text-white opacity-80">FLEX</span></h1>}
             <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] transition-all duration-500"></div>
          </div>
          <div className="hidden lg:flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700] animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Aurum Capital Subsidiary</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">
          <button onClick={() => scrollToSection('quote-ia')} className="hover:text-[#4DEEEA] transition-colors">Tu Cotizador IA</button>
          <button onClick={() => scrollToSection('servicios')} className="hover:text-[#4DEEEA] transition-colors">Tus Servicios</button>
          <button onClick={() => scrollToSection('tienda')} className="hover:text-[#FFD700] transition-colors">Tu Shop Élite</button>
          <button onClick={onEnter} className="px-8 py-3 bg-[#4DEEEA] text-black rounded-2xl hover:bg-white transition-all font-tech tracking-widest shadow-[0_0_20px_rgba(77,238,234,0.3)] font-bold uppercase">LOGIN OS</button>
        </div>
      </nav>

      <header className="relative w-full max-w-7xl mx-auto px-8 pt-32 pb-56 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center space-x-4 px-6 py-2 rounded-full border border-[#4DEEEA]/30 bg-[#4DEEEA]/5 text-[#4DEEEA] text-[10px] uppercase tracking-[0.4em] font-bold">
               <Target size={14} />
               <span>Tu Ingeniería Visual de Precisión</span>
            </div>
            <h2 className="text-7xl md:text-8xl font-tech font-bold leading-none tracking-tighter">
              TRANSFORMAMOS <br />
              <span className="gradient-lumina">TU MARCA</span> <br />
              EN LUZ ÉLITE.
            </h2>
            <p className="max-w-xl text-xl text-[#A0A0A0] font-light leading-relaxed">
              No somos solo neón. Somos la convergencia entre el diseño algorítmico CNC y el prestigio de Aurum Capital. Creamos la identidad que <span className="text-white font-bold">tú</span> necesitas para dominar tu industria.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
              <button onClick={onEnter} className="group w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-[#4DEEEA] to-[#00C6C3] text-black font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_40px_rgba(77,238,234,0.4)] hover:shadow-[0_0_60px_rgba(77,238,234,0.6)] hover:scale-105 flex items-center justify-center">
                Inicia Tu Cotización IA <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
              </button>
              <button onClick={() => scrollToSection('tienda')} className="w-full sm:w-auto px-12 py-6 border border-white/10 text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all text-sm text-center">
                Mira Tu Catálogo
              </button>
            </div>
          </div>
          <div className="relative group hidden lg:block">
             <div className="absolute inset-0 bg-gradient-to-r from-[#4DEEEA]/20 to-[#FFD700]/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
             <div className="glass-panel p-4 rounded-[60px] border border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-700 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] opacity-80 group-hover:opacity-100 transition-opacity" alt="Display" />
                <div className="absolute bottom-10 left-10 p-6 bg-black/80 backdrop-blur-md rounded-3xl border border-[#4DEEEA]/30">
                   <p className="text-[10px] font-mono text-[#4DEEEA] uppercase tracking-widest mb-1">TU_SCAN_NODE: MX-888</p>
                   <p className="text-xl font-tech font-bold text-white uppercase tracking-tighter">Tu Calidad, Certificada</p>
                </div>
             </div>
          </div>
        </div>
      </header>

      <section id="quote-ia" className="w-full bg-[#080808] border-y border-white/5 py-32 z-10 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="glass-panel p-16 rounded-[80px] border border-[#4DEEEA]/20 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#4DEEEA]/20 animate-[scanline_4s_linear_infinite]"></div>
            <div className="max-w-2xl space-y-8">
               <h3 className="text-5xl font-tech font-bold uppercase tracking-tighter">¿Listo para <span className="gradient-lumina">Tu Próximo Nivel</span>?</h3>
               <p className="text-[#A0A0A0] text-lg">
                 Nuestra IA Nexus-1 analiza tu identidad en segundos para generar tu trazado CNC optimizado. Sube tu logo y obtén tu presupuesto de alta gama al instante.
               </p>
               <div className="pt-8">
                  <button onClick={onEnter} className="px-16 py-6 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#4DEEEA] transition-all hover:scale-105 flex items-center mx-auto shadow-2xl">
                    <Cpu size={20} className="mr-4" /> Lanza Tu Simulador
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="w-full max-w-7xl mx-auto px-8 py-32 z-10">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
           <span className="text-[#FFD700] text-[11px] font-bold uppercase tracking-[0.6em]">Tus Posibilidades</span>
           <h3 className="text-5xl font-tech font-bold uppercase tracking-tighter">Soluciones para <span className="gradient-lumina">Tu Éxito</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { id: 'cat-1', title: "Tu Corporativo", icon: Shield, desc: "Identidad visual para tus holdings y sedes corporativas." },
            { id: 'cat-2', title: "Tu Retail Élite", icon: ShoppingCart, desc: "Atrae a tus clientes con la luz que define el deseo." },
            { id: 'cat-3', title: "Tu Arte Custom", icon: PenTool, desc: "Tus piezas únicas de colección limitadas a 100 unidades." }
          ].map((cat) => (
            <div key={cat.id} className="glass-panel p-12 rounded-[50px] border border-white/5 hover:border-[#4DEEEA]/40 transition-all group cursor-default">
               <div className="p-5 bg-white/5 rounded-3xl w-fit mb-8 group-hover:bg-[#4DEEEA]/10 transition-colors">
                  <cat.icon size={32} className="text-[#4DEEEA]" />
               </div>
               <h4 className="text-2xl font-tech font-bold text-white uppercase mb-4 tracking-widest">{cat.title}</h4>
               <p className="text-[#A0A0A0] text-sm leading-relaxed">{cat.desc}</p>
               <button onClick={onEnter} className="mt-10 flex items-center text-[10px] font-bold text-[#FFD700] uppercase tracking-widest hover:underline group/btn">
                  <span>Mira Tus Casos</span> <ChevronRight size={14} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
               </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full py-24 border-t border-white/10 z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6 md:col-span-1">
             <h2 className="text-3xl font-tech font-bold gradient-lumina italic">LUMINAFLEX</h2>
             <p className="text-xs text-[#A0A0A0] leading-loose uppercase tracking-widest font-bold">Lideramos tu impacto visual bajo el ecosistema Aurum Capital.</p>
          </div>
          <div className="space-y-6">
             <h5 className="text-[11px] font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Tu Navegación</h5>
             <ul className="space-y-4 text-xs text-[#A0A0A0] uppercase tracking-widest font-bold">
                <li><button onClick={() => scrollToSection('quote-ia')} className="hover:text-white transition-colors">Tu Cotizador</button></li>
                <li><button onClick={onEnter} className="hover:text-white transition-colors">Tu Galería</button></li>
                <li><button onClick={() => scrollToSection('tienda')} className="hover:text-white transition-colors">Tu Tienda</button></li>
             </ul>
          </div>
          <div className="space-y-6">
             <h5 className="text-[11px] font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Tu Seguridad</h5>
             <ul className="space-y-4 text-xs text-[#A0A0A0] uppercase tracking-widest font-bold">
                <li><button onClick={onEnter} className="hover:text-white transition-colors">Tu Privacidad</button></li>
                <li><button onClick={onEnter} className="hover:text-white transition-colors">Tu Garantía Aurum</button></li>
             </ul>
          </div>
          <div className="space-y-6">
             <h5 className="text-[11px] font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">Tu Status</h5>
             <div className="p-6 glass-panel rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-bold uppercase text-[#A0A0A0]">Tus Nodos</span>
                   <span className="text-[9px] font-bold text-[#4DEEEA]">ONLINE</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-center">
                   <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">Tu Partner: Aurum Capital</span>
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
