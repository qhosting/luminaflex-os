
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  LayoutGrid, 
  Bot,
  MessageSquare,
  Network,
  Send,
  Workflow,
  Activity,
  X,
  Upload,
  Cpu,
  Loader2,
  Database,
  Globe,
  ExternalLink,
  ClipboardList,
  Layers
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserRole } from '../App';

type TabType = 'PRODUCTION' | 'QUOTES' | 'AI_NEXUS' | 'ECOSYSTEM';

interface GroundingChunk {
  web?: { uri?: string; title?: string };
}

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
  grounding?: GroundingChunk[];
}

export const Dashboard: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<TabType>('PRODUCTION');
  const [aiMessage, setAiMessage] = useState('');
  const [aiHistory, setAiHistory] = useState<ChatHistoryItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toasts, setToasts] = useState<{id: string, message: string, type: string}[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [quoteImage, setQuoteImage] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [quoteMetrics, setQuoteMetrics] = useState({ meters: 0, price: 0 });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(curr => curr.filter(t => t.id !== id)), 4000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQuoteImage(reader.result as string);
        addToast('Tu diseño está en el buffer de visión.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQuote = async () => {
    if (!quoteImage) return;
    setIsQuoting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = quoteImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: `Actúa como ingeniero de producción CNC senior de Luminaflex. Analiza este diseño para Neón Flex. Calcula la longitud total del trazo en metros basándote en proporciones industriales estándar. Devuelve estrictamente un objeto JSON: {"svg": "código svg color #4DEEEA", "meters": float, "analysis": "resumen técnico corto"}. No añadas texto adicional fuera del JSON.` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 15000 }
        }
      });

      const result = JSON.parse(response.text || "{}");
      setGeneratedSvg(result.svg);
      setQuoteMetrics({ 
        meters: result.meters || 2.5, 
        price: (result.meters || 2.5) * 1250 + 1500 
      });
      addToast('Tu análisis vectorial Nexus ha finalizado.', 'success');
    } catch (error) {
      console.error(error);
      addToast('Error en tu núcleo de visión IA.', 'error');
    } finally {
      setIsQuoting(false);
    }
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userMsg = aiMessage;
    setAiMessage('');
    setAiHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Eres NEXUS, la inteligencia operativa central de Luminaflex OS. Tu misión es asistir al usuario en la producción industrial de su marca. Eres experto en costos, logística y metalurgia. Tu tono es ejecutivo, cercano (usa 'tú') y futurista. Usa Google Search para validar datos actuales.",
          tools: [{ googleSearch: {} }]
        }
      });

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
      setAiHistory(prev => [...prev, { role: 'model', text: response.text || '', grounding }]);
    } catch (error) {
      addToast('Fallo en tu conexión con Nexus Core.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h3 className="text-5xl font-tech font-bold uppercase tracking-tighter gradient-lumina">Tu Centro de Comando</h3>
          <p className="text-[11px] text-[#A0A0A0] uppercase tracking-[0.5em] mt-4 font-bold">Estado de Tu Nodo: <span className="text-[#4DEEEA]">PRODUCCIÓN</span></p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {[
            { id: 'PRODUCTION', label: 'Producción', icon: LayoutGrid },
            { id: 'QUOTES', label: 'Nexus Vision', icon: Cpu },
            { id: 'AI_NEXUS', label: 'Nexus Core', icon: Bot },
            { id: 'ECOSYSTEM', label: 'Tu Ecosistema', icon: Network }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] text-black shadow-lg scale-105' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'PRODUCTION' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
            {['Tu Diseño', 'Tu Corte CNC', 'Tu Ensamble', 'Tu Control QA'].map((stage, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#A0A0A0] px-2">{stage}</h4>
                <div className="glass-panel min-h-[400px] rounded-[32px] border border-white/5 p-4 flex flex-col items-center justify-center opacity-10">
                  <ClipboardList size={32} />
                  <p className="text-[8px] uppercase tracking-widest mt-2">Nodo de Tu Marca Disponible</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'QUOTES' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4">
            <div className="lg:col-span-2 glass-panel p-10 rounded-[48px] border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center relative group overflow-hidden">
                    {quoteImage ? (
                      <img src={quoteImage} className="w-full h-full object-contain p-6" alt="Upload" />
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center text-[#A0A0A0] hover:text-white transition-colors">
                        <Upload size={48} className="text-[#4DEEEA] mb-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Sincroniza Tu Arte</span>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    )}
                    {isQuoting && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="animate-spin text-[#4DEEEA]" size={32} /></div>}
                  </div>
                  <button onClick={handleGenerateQuote} disabled={!quoteImage || isQuoting} className="w-full py-5 bg-[#4DEEEA] text-black font-bold uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl">
                    Analiza con Tu Nexus Vision
                  </button>
                </div>
                <div className="aspect-square bg-black/40 rounded-[40px] border border-white/5 p-8 flex items-center justify-center">
                   {generatedSvg ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: generatedSvg }} /> : <Layers size={48} className="opacity-10" />}
                </div>
              </div>
            </div>
            <div className="glass-panel p-10 rounded-[48px] border border-[#FFD700]/20 flex flex-col justify-between">
              <div>
                <h5 className="font-tech text-2xl text-[#FFD700] uppercase mb-8">Tu Presupuesto Industrial</h5>
                <div className="space-y-6">
                  <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-[10px] uppercase text-[#A0A0A0]">Metros de Tu Marca</span><span className="font-bold text-lg">{quoteMetrics.meters.toFixed(2)}m</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-[10px] uppercase text-[#A0A0A0]">Tu Inversión</span><span className="text-2xl font-tech text-[#FFD700]">${quoteMetrics.price.toLocaleString()} MXN</span></div>
                </div>
              </div>
              <button className="w-full py-5 bg-[#FFD700] text-black font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all mt-8">Emite Tu Orden de Trabajo</button>
            </div>
          </div>
        )}

        {activeTab === 'AI_NEXUS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] animate-in slide-in-from-bottom-8">
            <div className="lg:col-span-2 glass-panel rounded-[48px] border border-[#4DEEEA]/20 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-[#4DEEEA]/5 flex justify-between items-center">
                <div className="flex items-center space-x-3 text-[#4DEEEA]"><Bot size={20} /><span className="font-tech text-xl uppercase tracking-widest">Tu Nexus Intelligence Core</span></div>
                <span className="text-[8px] font-mono text-[#4DEEEA] animate-pulse">TU_SISTEMA: ACTIVO</span>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {aiHistory.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-3xl border ${chat.role === 'user' ? 'bg-[#4DEEEA]/10 border-[#4DEEEA]/20' : 'bg-white/5 border-white/10'}`}>
                      <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                      {chat.grounding && chat.grounding.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                          {chat.grounding.map((chunk: any, j: number) => chunk.web && (
                            <a key={j} href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-[8px] px-2 py-1 bg-white/5 rounded flex items-center hover:bg-[#4DEEEA]/20 text-[#A0A0A0] transition-all">
                              {chunk.web.title} <ExternalLink size={8} className="ml-1" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAiLoading && <div className="flex justify-start"><Loader2 className="animate-spin text-[#4DEEEA]" /></div>}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleAiChat} className="p-6 border-t border-white/10 relative bg-black/40">
                <input 
                  type="text" 
                  value={aiMessage}
                  onChange={e => setAiMessage(e.target.value)}
                  placeholder="Tu consulta logística o de costos aquí..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-[#4DEEEA]/50 font-tech"
                />
                <button className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-[#4DEEEA] text-black rounded-xl hover:scale-110 active:scale-95 transition-all">
                  <Send size={18} />
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-8 rounded-[48px] border border-white/5">
                <h5 className="text-[10px] uppercase font-bold text-[#A0A0A0] mb-6 tracking-widest">Tu Sincronía</h5>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-xs">Tu Integridad</span><span className="text-[#4DEEEA] font-tech">99.9%</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs">Tu Latencia</span><span className="text-[#FFD700] font-tech">0.1s</span></div>
                  <div className="h-1 bg-white/5 rounded-full mt-4"><div className="h-full bg-[#4DEEEA]" style={{width:'99%'}}></div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ECOSYSTEM' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Tu Base Postgres', icon: Database, color: 'text-green-500', status: 'En Línea' },
              { name: 'Tu Google Node', icon: Network, color: 'text-[#4DEEEA]', status: 'Sincronizado' },
              { name: 'Tu Nexus Core', icon: Bot, color: 'text-[#FFD700]', status: 'Activo' },
              { name: 'Tu Red Luminaflex', icon: Globe, color: 'text-blue-500', status: 'Online' }
            ].map((node, i) => (
              <div key={i} className="glass-panel p-8 rounded-[48px] border border-white/5 flex flex-col items-center text-center group hover:border-[#4DEEEA]/30 transition-all">
                <div className={`p-6 bg-white/5 rounded-[32px] mb-6 ${node.color}`}><node.icon size={40} /></div>
                <h5 className="font-tech text-lg uppercase font-bold text-white mb-1">{node.name}</h5>
                <p className="text-[9px] font-mono text-[#A0A0A0] uppercase tracking-widest">{node.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-10 right-10 z-[500] space-y-3 w-72">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl glass-panel border animate-in slide-in-from-right-4 flex justify-between items-center ${t.type === 'error' ? 'border-red-500/50 text-red-400' : 'border-[#4DEEEA]/50 text-[#4DEEEA]'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.message}</span>
            <button onClick={() => setToasts(curr => curr.filter(x => x.id !== t.id))}><X size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};
