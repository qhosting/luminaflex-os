import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Scissors, 
  Zap, 
  Ruler, 
  DollarSign, 
  LayoutGrid, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Bot,
  MessageSquare,
  Network,
  Send,
  Workflow,
  Activity,
  Link,
  RefreshCw,
  Bell,
  X,
  Info,
  FileText,
  Clock,
  Upload,
  ImageIcon,
  Cpu,
  Download,
  Maximize2,
  Play,
  Terminal,
  Settings2,
  Loader2,
  Database,
  Server,
  Cloud,
  ShieldCheck,
  Globe,
  Cpu as CpuIcon,
  ExternalLink
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserRole } from '../App';

type TabType = 'PRODUCTION' | 'SMART_CUT' | 'QUOTES' | 'ROI' | 'AI_NEXUS' | 'ECOSYSTEM';

interface Order {
  id: string;
  client: string;
  urgency: 'Baja' | 'Media' | 'Alta';
  stage: number;
  description?: string;
  file?: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiHistory, setAiHistory] = useState<ChatHistoryItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Smart Quote States
  const [quoteImage, setQuoteImage] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [quoteMetrics, setQuoteMetrics] = useState({ meters: 0, acrylic: 0, price: 0 });

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM]: Aurum OS Initialized...",
    "[NETWORK]: Connected to mx-luminaflex-node",
    "[AI]: Cognitive model gemini-3-pro-preview standby."
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}]: ${msg}`]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQuoteImage(reader.result as string);
        addToast('Imagen cargada en el buffer de visión.', 'info');
        addLog("VISION: Input image received.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQuote = async () => {
    if (!quoteImage) return;
    setIsQuoting(true);
    setAiAnalysis("Iniciando análisis de geometría vectorial...");
    addLog("AI VISION: Engine starting for CNC analysis...");

    try {
      const apiKey = (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const base64Data = quoteImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: `Analiza este logo para corte láser CNC. Devuelve un JSON: { "svg": "código svg cian/transparente", "pathLength": float_metros, "analysis": "texto_breve" }. Importante: Paths cerrados.` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 15000 }
        }
      });

      const result = JSON.parse(response.text || "{}");
      setGeneratedSvg(result.svg);
      setAiAnalysis(result.analysis || "Análisis completado.");
      const meters = result.pathLength || 3.2;
      const price = (meters * 1100) + (0.6 * 1950) + 1500; 
      setQuoteMetrics({ meters, acrylic: 0.6, price });
      addToast('Vectorización CNC completada.', 'success');
      addLog(`QUOTE_SUCCESS: ${meters}m detectados.`);
    } catch (error) {
      addToast('Fallo en el núcleo de visión CNC.', 'error');
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
    addLog(`AI_CHAT: Query received.`);

    try {
      const apiKey = (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Eres NEXUS, la IA de gestión de Luminaflex (Holding Aurum Capital). Ayudas al CEO a tomar decisiones estratégicas sobre producción de neón flex, costos en MXN y logística. Tono: Ejecutivo, tecnológico, preciso. Usa Google Search para validar precios actuales de materiales si es necesario.",
          tools: [{ googleSearch: {} }]
        }
      });

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
      const modelResponse: ChatHistoryItem = { 
        role: 'model', 
        text: response.text || '', 
        grounding 
      };
      
      setAiHistory(prev => [...prev, modelResponse]);
    } catch (error) {
      addToast('Error en enlace cognitivo AI.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const [orders, setOrders] = useState<Order[]>([
    { id: 'LX-901', client: 'Cyber Punk Bar', urgency: 'Alta', stage: 0, description: 'Letrero Neón 120x60cm, Color Cian Eléctrico' },
    { id: 'LX-902', client: 'Aether Studio', urgency: 'Media', stage: 1, description: 'Logo corporativo minimalista, Dorado Aurum' },
    { id: 'LX-903', client: 'Golden Hour', urgency: 'Alta', stage: 2, description: 'Frase motivacional 200cm, Mezcla RGB' },
  ]);

  const stages = ['Diseño Vector', 'Corte CNC', 'Ensamble LED', 'Quality Check'];

  const moveOrder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders(orders.map(o => o.id === id && o.stage < 3 ? { ...o, stage: o.stage + 1 } : o));
    addToast('Estado de producción actualizado.', 'info');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'PRODUCTION':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {stages.map((stageName, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#A0A0A0]">{stageName}</h4>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[#4DEEEA]">
                    {orders.filter(o => o.stage === idx).length}
                  </span>
                </div>
                <div className="space-y-4 min-h-[400px] p-2 bg-white/[0.02] rounded-3xl border border-white/5">
                  {orders.filter(o => o.stage === idx).map(order => (
                    <div 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-[#4DEEEA]/30 transition-all group relative overflow-hidden cursor-pointer neon-glow-hover"
                    >
                      <div className={`absolute top-0 right-0 w-1 h-full ${order.urgency === 'Alta' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[#FFD700]'}`}></div>
                      <p className="text-[9px] font-tech text-[#4DEEEA] mb-1">{order.id}</p>
                      <h5 className="text-sm font-bold text-white mb-3 truncate">{order.client}</h5>
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] uppercase font-bold px-2 py-0.5 rounded ${order.urgency === 'Alta' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-[#A0A0A0]'}`}>
                          {order.urgency}
                        </span>
                        {idx < 3 && (
                          <button onClick={(e) => moveOrder(order.id, e)} className="p-1.5 rounded-lg bg-[#4DEEEA]/10 text-[#4DEEEA] hover:bg-[#4DEEEA] hover:text-black transition-all">
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'QUOTES':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-8 rounded-[40px] border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="font-tech text-2xl uppercase tracking-widest text-white flex items-center">
                      <Cpu className="text-[#4DEEEA] mr-3" /> Vectorización IA Vision
                    </h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="aspect-square bg-white/[0.03] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative group overflow-hidden">
                      {quoteImage ? (
                        <img src={quoteImage} className="w-full h-full object-contain p-4" alt="Input" />
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                          <Upload size={40} className="text-[#A0A0A0]" />
                          <span className="text-[10px] uppercase font-bold mt-4">Subir Logo</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                      {isQuoting && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-[#4DEEEA]" /></div>}
                    </div>
                    <button onClick={handleGenerateQuote} disabled={!quoteImage || isQuoting} className="w-full py-4 bg-[#4DEEEA] text-black font-bold uppercase tracking-widest rounded-2xl">
                      Generar Vector
                    </button>
                  </div>
                  <div className="space-y-4 text-center">
                    <div className="aspect-square bg-[#050505] border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
                      {generatedSvg ? <div className="w-full h-full p-8" dangerouslySetInnerHTML={{ __html: generatedSvg }} /> : <Layers size={48} className="opacity-10" />}
                    </div>
                    <p className="text-[10px] text-white/50 italic">{aiAnalysis || "Análisis pendiente..."}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-[40px] border border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-transparent">
              <h5 className="font-tech text-xl text-[#FFD700] uppercase mb-6">Cotización Estratégica</h5>
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex justify-between text-xs"><span>Metros Trazado:</span><span>{quoteMetrics.meters.toFixed(2)}m</span></div>
                <div className="flex justify-between text-xs"><span>Inversión Estimada:</span><span className="text-[#FFD700] font-bold">${quoteMetrics.price.toLocaleString()} MXN</span></div>
              </div>
              <button className="w-full mt-8 py-5 bg-[#FFD700] text-black font-bold rounded-2xl uppercase tracking-widest text-xs">Negociar con Cliente</button>
            </div>
          </div>
        );
      case 'AI_NEXUS':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] animate-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-2 flex flex-col glass-panel rounded-[40px] border border-[#4DEEEA]/20 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#4DEEEA]/5">
                 <div className="flex items-center space-x-3">
                    <Bot className="text-[#4DEEEA]" />
                    <h4 className="font-tech text-xl uppercase tracking-widest">Nexus Intelligence Core</h4>
                 </div>
                 <span className="text-[9px] font-mono text-[#4DEEEA] animate-pulse">SEARCH_GROUNDING: ON</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {aiHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                    <MessageSquare size={48} />
                    <p className="text-xs uppercase tracking-widest">Consultar Tendencias de Mercado o Estrategia Aurum</p>
                  </div>
                )}
                {aiHistory.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-3xl border ${chat.role === 'user' ? 'bg-[#4DEEEA]/10 border-[#4DEEEA]/20 rounded-tr-none' : 'bg-white/5 border-white/10 rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                      
                      {chat.grounding && chat.grounding.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                           <p className="text-[8px] font-bold text-[#4DEEEA] uppercase tracking-widest flex items-center">
                             <Globe size={10} className="mr-2" /> Fuentes de Verificación:
                           </p>
                           <div className="flex flex-wrap gap-2">
                             {chat.grounding.map((chunk, j) => chunk.web && chunk.web.uri && (
                               <a key={j} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[8px] bg-white/5 px-2 py-1 rounded border border-white/10 hover:bg-[#4DEEEA]/20 transition-all flex items-center text-[#A0A0A0] hover:text-white">
                                 {chunk.web.title || 'Enlace'} <ExternalLink size={8} className="ml-1" />
                               </a>
                             ))}
                           </div>
                        </div>
                      )}

                      <span className="text-[8px] uppercase font-mono mt-3 block opacity-40">{chat.role === 'user' ? 'CEO_ID: MX-419' : 'AI_NEXUS_ENGINE'}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleAiChat} className="p-6 bg-black/40 border-t border-white/10 relative">
                <input 
                  type="text" 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Consulte a Nexus sobre precios actuales de acrílico o tendencias de neón..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-[#4DEEEA]/50 transition-all font-tech"
                />
                <button disabled={isAiLoading} className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-[#4DEEEA] text-black rounded-xl hover:scale-105 active:scale-95 transition-all">
                  {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-[32px] border border-white/5 bg-white/[0.01]">
                <h5 className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest mb-4">Métricas de Contexto AI</h5>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/60">Precisión Operativa</span><span className="text-sm font-tech text-[#4DEEEA]">99.8%</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/60">Latencia Cognitiva</span><span className="text-sm font-tech text-[#FFD700]">0.8s</span></div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-gradient-to-r from-[#4DEEEA] to-[#FFD700]" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-[32px] border border-[#FFD700]/20 bg-[#FFD700]/5">
                 <p className="text-[10px] font-bold text-[#FFD700] uppercase mb-2 flex items-center"><AlertCircle size={12} className="mr-2" /> Sugerencia de Nexus</p>
                 <p className="text-xs italic text-white/80 font-tech">"El costo del acrílico ha subido un 4% en el mercado global. Recomiendo ajustar márgenes."</p>
              </div>
            </div>
          </div>
        );
      case 'ECOSYSTEM':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {[
              { name: 'Aurum Database', status: 'Backed Up', icon: Database, color: 'text-green-500', detail: 'Last: 03:00 AM' },
              { name: 'Google Drive', status: 'Synced', icon: Cloud, color: 'text-[#4DEEEA]', detail: '420GB / 2TB' },
              { name: 'Chatwoot Reminders', status: 'Active', icon: Bell, color: 'text-[#FFD700]', detail: '2 Alertas Pendientes' },
              { name: 'n8n Automations', status: 'Connected', icon: Workflow, color: 'text-blue-500', detail: 'SEC_8888 Enabled' }
            ].map((node, i) => (
              <div key={i} className="glass-panel p-8 rounded-[40px] border border-white/5 hover:border-white/20 transition-all group flex flex-col items-center text-center">
                 <div className={`p-6 bg-white/5 rounded-[30px] mb-6 group-hover:bg-white/10 transition-colors ${node.color}`}>
                    <node.icon size={40} />
                 </div>
                 <h5 className="text-lg font-tech font-bold uppercase text-white mb-1">{node.name}</h5>
                 <p className={`text-[10px] font-bold uppercase tracking-widest ${node.color} mb-4`}>{node.status}</p>
                 <div className="w-full pt-4 border-t border-white/5">
                    <p className="text-[9px] font-mono text-[#A0A0A0] uppercase">{node.detail}</p>
                 </div>
              </div>
            ))}
            <div className="md:col-span-2 xl:col-span-4 glass-panel p-8 rounded-[40px] border border-white/5 mt-4">
               <h4 className="text-xl font-tech font-bold uppercase tracking-widest mb-6">Tráfico de Red Aurum (24h)</h4>
               <div className="h-40 flex items-end space-x-2">
                  {[40, 60, 45, 90, 65, 80, 55, 75, 95, 40, 60, 85, 50, 70, 90, 100, 60, 45, 30, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-[#4DEEEA]/40 to-[#4DEEEA] rounded-t-lg transition-all hover:opacity-100 opacity-60" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 text-[9px] font-mono text-[#A0A0A0] uppercase tracking-widest">
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
               </div>
            </div>
          </div>
        );
      case 'ROI':
        return (
          <div className="max-w-4xl mx-auto glass-panel p-12 rounded-[50px] border border-white/10 animate-in slide-in-from-bottom-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest">Ajuste de Carga de Neón</label>
                  <input type="range" min="1" max="50" step="0.5" value={quoteMetrics.meters || 10} onChange={(e) => setQuoteMetrics({...quoteMetrics, meters: parseFloat(e.target.value)})} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4DEEEA]" />
                  <p className="text-[#4DEEEA] font-tech text-3xl font-bold">{(quoteMetrics.meters || 10).toFixed(1)} <span className="text-xs uppercase">Metros</span></p>
                </div>
                <button onClick={() => addToast('Sincronizado con Aurum Cloud.', 'success')} className="w-full py-5 bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] text-black font-bold uppercase rounded-2xl tracking-widest text-xs">Sincronizar Datos</button>
              </div>
              <div className="flex flex-col justify-center items-center p-10 bg-white/[0.03] rounded-[50px] border border-white/5">
                <h5 className="text-[10px] uppercase font-bold text-[#A0A0A0] mb-4 tracking-widest">Utilidad Estimada</h5>
                <p className="text-7xl font-tech font-bold text-[#FFD700] tracking-tighter">$ 12.8k</p>
                <div className="mt-8 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-green-500/20">MXN Neto / Proyecto</div>
              </div>
            </div>
          </div>
        );
      case 'SMART_CUT':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-2 glass-panel p-8 rounded-[40px] border border-white/10 relative">
              <h4 className="font-tech text-xl uppercase tracking-widest text-white mb-8">Simulador de Nesting 300x200</h4>
              <div className="aspect-[3/2] w-full bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 p-8 grid grid-cols-8 grid-rows-5 gap-3">
                   {[...Array(40)].map((_, i) => (
                     <div key={i} className={`rounded-lg border transition-all ${i < 34 ? 'bg-[#4DEEEA]/10 border-[#4DEEEA]/30' : 'bg-white/5 border-dashed border-white/10 opacity-20'}`}></div>
                   ))}
                </div>
              </div>
              <button className="w-full mt-8 py-5 bg-[#FFD700] text-black font-bold uppercase tracking-[0.3em] text-xs rounded-2xl flex items-center justify-center">
                <Play size={18} className="mr-4" /> Inicializar Corte
              </button>
            </div>
            <div className="space-y-6">
              <div className="glass-panel p-8 rounded-[40px] border border-white/5"><Ruler className="text-[#4DEEEA] mb-5" /><p className="text-4xl font-tech font-bold text-white">5.18 <span className="text-sm opacity-40">m²</span></p></div>
              <div className="glass-panel p-8 rounded-[40px] border border-white/5"><Layers className="text-[#FFD700] mb-5" /><p className="text-4xl font-tech font-bold text-white">$ 840 <span className="text-sm opacity-40">MXN</span></p></div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h3 className="text-5xl font-tech font-bold uppercase tracking-tighter gradient-lumina leading-none">Command Center</h3>
          <p className="text-[11px] text-[#A0A0A0] uppercase tracking-[0.5em] mt-4 font-bold">Localización: <span className="text-[#4DEEEA]">MÉXICO_HQ_NODE</span></p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white/[0.03] p-1 rounded-2xl border border-white/10 overflow-x-auto">
          {[
            { id: 'PRODUCTION', label: 'Producción', icon: LayoutGrid }, 
            { id: 'QUOTES', label: 'Cotizador Vision', icon: CpuIcon }, 
            { id: 'AI_NEXUS', label: 'Nexus AI', icon: Bot },
            { id: 'SMART_CUT', label: 'Smart Cut', icon: Scissors }, 
            { id: 'ROI', label: 'Estrategia', icon: TrendingUp },
            { id: 'ECOSYSTEM', label: 'Ecosistema', icon: Network }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as TabType)} 
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all font-tech font-bold uppercase text-[9px] tracking-widest border border-transparent
                ${activeTab === tab.id ? 'bg-gradient-to-r from-[#4DEEEA] to-[#FFD700] text-black shadow-lg scale-105' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'}
              `}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-[500px] relative z-10">{renderTabContent()}</div>

      {/* Toast Manager */}
      <div className="fixed bottom-10 right-10 z-[500] space-y-3 w-72">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl glass-panel border animate-in slide-in-from-right-4 flex justify-between items-center ${t.type === 'error' ? 'border-red-500/50 text-red-400' : 'border-[#4DEEEA]/50 text-[#4DEEEA]'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.message}</span>
            <button onClick={() => removeToast(t.id)}><X size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};