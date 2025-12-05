import React, { useState } from 'react';
import { analyzeTextForAI } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import ResultsDashboard from './components/ResultsDashboard';
import { BrainCircuitIcon, SparklesIcon } from './components/Icons';
import mdhLogo from './mdh.gif';
import centauroLogo from './centauro.gif';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    // Minimum text length check
    if (inputText.length < 50) {
        alert("O texto é muito curto para uma análise precisa. Por favor, insira pelo menos 50 caracteres.");
        return;
    }

    setStatus(AnalysisStatus.ANALYZING);
    try {
      const data = await analyzeTextForAI(inputText);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("API key") || error.toString().includes("API key")) {
        alert("Erro de Configuração: A Chave da API (API Key) não foi encontrada. \n\nSe você é o administrador, verifique se a variável 'VITE_GEMINI_API_KEY' está configurada corretamente no Netlify e faça um novo Deploy.");
      }
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={mdhLogo} alt="MDH Logo" className="h-12 w-auto object-contain" />
            <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
            <div className="flex items-center gap-3">
                <div className="bg-primary-500/10 p-2 rounded-lg border border-primary-500/20">
                    <BrainCircuitIcon className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Monitoramente Inteligente de Uso de <span className="text-primary-400">IA</span></h1>
                    <p className="text-xs text-slate-400">Análise de Autoria Neural</p>
                </div>
            </div>
          </div>
          <div>
            <img src={centauroLogo} alt="Centauro Logo" className="h-12 w-auto object-contain" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 md:mt-12 space-y-12">
        
        {/* Intro Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Humano ou Máquina?
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
                Cole seu texto abaixo e nossa IA analisará padrões de sintaxe, perplexidade e semântica para determinar a probabilidade de autoria artificial.
            </p>
        </section>

        {/* Input Section */}
        <section className="bg-slate-800/50 p-1 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="relative">
                <textarea
                    className="w-full h-64 bg-slate-900/80 text-slate-200 p-6 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder-slate-600 text-lg leading-relaxed font-light"
                    placeholder="Cole o texto que deseja analisar aqui..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={status === AnalysisStatus.ANALYZING}
                />
                
                {/* Character Count */}
                <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono">
                    {inputText.length} caracteres
                </div>
            </div>
            
            <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                 <button 
                    onClick={handleClear}
                    disabled={status === AnalysisStatus.ANALYZING || (!inputText && !result)}
                    className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50"
                >
                    Limpar Texto
                </button>

                <button
                    onClick={handleAnalyze}
                    disabled={status === AnalysisStatus.ANALYZING || inputText.length === 0}
                    className={`
                        group relative flex items-center gap-3 px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all
                        ${status === AnalysisStatus.ANALYZING 
                            ? 'bg-slate-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 hover:shadow-primary-500/20 hover:-translate-y-0.5'
                        }
                    `}
                >
                    {status === AnalysisStatus.ANALYZING ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Analisando Padrões...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
                            <span>Detectar Autoria</span>
                        </>
                    )}
                </button>
            </div>
        </section>

        {/* Error Message */}
        {status === AnalysisStatus.ERROR && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-center">
                Ocorreu um erro ao analisar o texto. Por favor, tente novamente mais tarde.
            </div>
        )}

        {/* Results Section */}
        {status === AnalysisStatus.COMPLETED && result && (
            <section id="results" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-700 flex-grow"></div>
                    <h2 className="text-2xl font-bold text-slate-200">Resultados da Análise</h2>
                    <div className="h-px bg-slate-700 flex-grow"></div>
                </div>
                <ResultsDashboard result={result} />
            </section>
        )}

      </main>

      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800/50 mt-auto">
        <p>@copywriter 2025 - MDH - Versão 1.0 - Desenvolvido por PVolker - |</p>
      </footer>
    </div>
  );
};

export default App;