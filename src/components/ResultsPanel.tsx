import { ShieldAlert, ShieldCheck, Crosshair } from 'lucide-react';

interface ResultData {
  fraud_probability?: number;
  prediction?: string;
  confidence?: {
    precision: number;
    recall: number;
    roc_auc: number;
  };
  threshold?: number;
  risk_factors?: {
    amount: number;
    time: number;
    distance: number;
    category: number;
  };
}

const ResultsPanel = ({ show, data }: { show?: boolean; data?: ResultData }) => {
  if (!show) return null;

  // ── USE REAL DATA from API ──────────────────────────────
  const riskScore = data?.fraud_probability ?? 0;
  const prediction = data?.prediction ?? "SAFE";
  const isHighRisk = prediction === "FRAUD";
  const threshold = data?.threshold ?? 0.823;

  return (
    <div className="w-full h-full flex flex-col p-6 lg:p-8 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">

      {/* Background glow */}
      <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-20 ${isHighRisk ? 'bg-red-600' : 'bg-emerald-600'} pointer-events-none transition-colors duration-1000`} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-10 bg-blue-600 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 z-10">
        <h3 className="text-white/90 font-semibold tracking-wide flex items-center gap-2 text-lg">
          <Crosshair size={20} className="text-blue-400" />
          Analysis Report
        </h3>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${isHighRisk
          ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          }`}>
          {isHighRisk ? 'Critical Risk' : 'Verified Secure'}
        </div>
      </div>

      {/* Circular Risk Meter */}
      <div className="flex flex-col justify-center items-center flex-1 relative z-10 min-h-[200px]">
        <div className="relative flex items-center justify-center w-56 h-56">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="2 4" />
          </svg>
          {/* Background ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          </svg>
          {/* Threshold marker */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none"
              stroke="rgba(255,200,0,0.5)" strokeWidth="2" strokeDasharray="2 4"
              strokeDashoffset={251.2 - (251.2 * threshold * 100) / 100} />
          </svg>
          {/* Progress ring */}
          <svg className={`absolute inset-0 w-full h-full -rotate-90 ${isHighRisk ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isHighRisk ? "#ff4b4b" : "#10b981"} />
                <stop offset="100%" stopColor={isHighRisk ? "#991b1b" : "#047857"} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="none"
              stroke="url(#riskGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * riskScore) / 100}
              className="transition-all duration-1000" />
          </svg>

          {/* Center text */}
          <div className="text-center mt-2">
            <span className={`text-6xl font-light tracking-tighter ${isHighRisk ? 'text-red-400' : 'text-emerald-400'} drop-shadow-[0_0_10px_currentColor]`}>
              {riskScore.toFixed(1)}<span className="text-3xl text-white/30 ml-1 font-normal">%</span>
            </span>
            <p className="text-xs text-white/40 mt-2 uppercase tracking-[0.2em] font-medium">Risk Score</p>
            <p className="text-xs text-yellow-400/60 mt-1">Threshold: {(threshold * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Alert / Safe Card */}
      {isHighRisk ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 mt-4 mb-4 relative overflow-hidden group backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="bg-red-500/20 p-2.5 rounded-xl flex-shrink-0 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <ShieldAlert className="text-red-400" size={24} />
          </div>
          <div>
            <h4 className="text-red-400 font-bold text-sm tracking-wide mb-1">⚠ FRAUDULENT TRANSACTION DETECTED</h4>
            <p className="text-xs text-white/70 leading-relaxed">Immediate card block recommended.</p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-4 mt-4 mb-4 backdrop-blur-md">
          <div className="bg-emerald-500/20 p-2.5 rounded-xl flex-shrink-0 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <ShieldCheck className="text-emerald-400" size={24} />
          </div>
          <div>
            <h4 className="text-emerald-400 font-bold text-sm tracking-wide mb-1">✓ TRANSACTION VERIFIED SAFE</h4>
            <p className="text-xs text-white/70 leading-relaxed">No suspicious patterns detected.</p>
          </div>
        </div>
      )}

      {/* Confidence Metrics */}
      {data?.confidence && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            { label: "Precision", value: (data.confidence.precision * 100).toFixed(1) + "%" },
            { label: "Recall", value: (data.confidence.recall * 100).toFixed(1) + "%" },
            { label: "ROC-AUC", value: data.confidence.roc_auc.toFixed(4) },
          ].map(m => (
            <div key={m.label} className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
              <p className="text-white/40 text-[10px] uppercase tracking-wider">{m.label}</p>
              <p className="text-white font-bold text-sm mt-1">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes circleFill { from { stroke-dashoffset: 251.2; } }
      `}</style>
    </div>
  );
};

export default ResultsPanel;