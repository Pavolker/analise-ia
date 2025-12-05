import React from 'react';
import { AnalysisResult } from '../types';
import GaugeChart from './GaugeChart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BrainCircuitIcon, AlertTriangleIcon, CheckCircleIcon } from './Icons';

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Main Gauge Card */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuitIcon className="w-24 h-24 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Veredito Principal</h3>
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <p className={`text-3xl font-bold ${result.aiScore > 50 ? 'text-pink-500' : 'text-emerald-400'}`}>
                {result.verdict}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Confiança: <span className="text-slate-200 font-medium">{result.confidence}</span>
              </p>
            </div>
          </div>
          <GaugeChart value={result.aiScore} />
        </div>

        {/* Breakdown Card */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 flex flex-col justify-center">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-6">Composição Estimada</h3>
            
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-pink-400 font-medium flex items-center gap-2">
                             <BrainCircuitIcon className="w-4 h-4"/> Inteligência Artificial
                        </span>
                        <span className="text-white font-bold">{result.aiScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000" 
                            style={{ width: `${result.aiScore}%` }}
                        ></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-400 font-medium flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4"/> Autoria Humana
                        </span>
                        <span className="text-white font-bold">{result.humanScore}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" 
                            style={{ width: `${result.humanScore}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Flags Card */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700">
             <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
                Indicadores Chave
             </h3>
             <ul className="space-y-3">
                {result.flags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-amber-400 mt-2"></div>
                        <span className="text-slate-300 text-sm leading-relaxed">{flag}</span>
                    </li>
                ))}
             </ul>
        </div>
      </div>

      {/* Deep Analysis & Tone Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Textual Analysis */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Análise Detalhada</h3>
            <p className="text-slate-300 leading-7 text-sm md:text-base">
                {result.reasoning}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-500 italic">
                    Nota: Os detectores de IA são probabilísticos. Este resultado é uma estimativa baseada em padrões linguísticos e não deve ser considerado prova definitiva.
                </p>
            </div>
        </div>

        {/* Tone Chart */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 min-h-[300px] flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Análise de Tom & Estilo</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={result.toneAnalysis}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                            dataKey="label" 
                            type="category" 
                            width={80} 
                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                            {result.toneAnalysis.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#38bdf8' : '#64748b'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;