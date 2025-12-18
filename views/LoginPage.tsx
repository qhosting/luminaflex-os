
import React, { useState } from 'react';
import { UserRole } from '../App';
import { ShieldCheck, ChevronLeft, Lock, Mail, Fingerprint, Loader2, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Ingrese credenciales completas.');
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // En producción, aquí se conecta con el endpoint de autenticación que usa Postgres
      // const response = await fetch('/api/auth/login', { method: 'POST', ... });
      
      setTimeout(() => {
        let assignedRole: UserRole = 'Cliente';
        const lowerEmail = email.toLowerCase();

        // Lógica de asignación de roles basada en dominio/base de datos (Simulada para prod-ready)
        if (lowerEmail === 'ceo@luminaflex.com' || lowerEmail === 'admin@luminaflex.com') {
          assignedRole = 'CEO';
        } else if (lowerEmail.endsWith('@luminaflex.com')) {
          assignedRole = 'Colaborador';
        }

        onLogin(assignedRole);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setErrorMessage('Error de enlace con el servidor de autenticación.');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4DEEEA]/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700]/5 blur-[150px] rounded-full"></div>
      
      <div className="absolute bottom-8 left-8 font-mono text-[7px] text-white/5 tracking-[2em] pointer-events-none select-none uppercase">
        Security Node: qhosting_luminaflex-db
      </div>

      <button 
        onClick={onBack}
        disabled={isLoading}
        className="absolute top-8 left-8 flex items-center text-[#A0A0A0] hover:text-white transition-all group disabled:opacity-50 z-50"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="text-xs uppercase tracking-widest ml-2 font-tech font-bold">Portal Público</span>
      </button>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] glass-panel border border-[#FFD700]/20 mb-4 shadow-[0_0_50px_rgba(255,215,0,0.1)] relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4DEEEA]/10 to-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
            <Fingerprint size={48} className={`text-[#FFD700] transition-all ${isLoading ? 'animate-pulse scale-90' : 'group-hover:scale-110'}`} />
          </div>
          <h2 className="text-4xl font-tech font-bold tracking-tighter text-white uppercase">Acceso Autorizado</h2>
          <p className="text-[#A0A0A0] text-[10px] uppercase tracking-[0.5em] font-bold">Luminaflex OS Enterprise | Production</p>
        </div>

        <form onSubmit={handleSubmit} className={`glass-panel p-10 rounded-[48px] border transition-all duration-500 space-y-8 ${isError ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
          
          <div className="space-y-6">
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#050505] text-[8px] font-bold text-[#A0A0A0] uppercase tracking-widest">Correo Corporativo</label>
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0A0A0] group-focus-within:text-[#4DEEEA] transition-colors" size={18} />
              <input 
                type="email" 
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@luminaflex.com" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:border-[#4DEEEA]/50 focus:bg-[#4DEEEA]/5 outline-none transition-all font-tech text-lg tracking-wider disabled:opacity-50"
                required
              />
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#050505] text-[8px] font-bold text-[#A0A0A0] uppercase tracking-widest">Contraseña Encriptada</label>
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A0A0A0] group-focus-within:text-[#FFD700] transition-colors" size={18} />
              <input 
                type="password" 
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-white/10 focus:border-[#FFD700]/50 focus:bg-[#FFD700]/5 outline-none transition-all font-tech text-lg tracking-wider disabled:opacity-50"
                required
              />
            </div>
          </div>

          {isError && (
            <div className="flex items-center space-x-3 text-red-500 animate-in slide-in-from-top-2 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] rounded-2xl text-black font-bold uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(77,238,234,0.3)] relative overflow-hidden group disabled:opacity-80 text-xs border border-transparent"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 animate-spin" size={20} />
                    Firmando Nodo...
                  </>
                ) : (
                  'Iniciar Sesión Segura'
                )}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            <p className="text-[9px] text-[#A0A0A0] text-center uppercase tracking-widest leading-loose font-medium opacity-60">
               Certificación de Seguridad SSL-QUANTUM v2.5 | Aurum Capital
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
