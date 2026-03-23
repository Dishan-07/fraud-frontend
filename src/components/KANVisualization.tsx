import { useEffect, useState } from 'react';

const KANVisualization = () => {
  const [analyzing, setAnalyzing] = useState(false);

  // Simulate periodic analysis waves
  useEffect(() => {
    const wave = setInterval(() => {
      setAnalyzing(true);
      setTimeout(() => setAnalyzing(false), 2500);
    }, 6000);
    return () => clearInterval(wave);
  }, []);

  // Helper arrays for rendering nodes
  const inputNodes = Array.from({ length: 8 });
  const hiddenNodes = Array.from({ length: 6 });

  return (
    <div className="w-full h-full flex flex-col p-4 relative group">
      <div className="flex justify-between items-center mb-2 z-20">
        <div>
          <h3 className="font-sans font-medium text-text-primary">KAN Neural Network</h3>
          <p className="text-xs text-text-secondary">Architecture: [17, 128, 128, 128, 1]</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${analyzing ? 'bg-secondary animate-pulse' : 'bg-transparent border border-text-secondary'}`}></span>
          <span className="text-xs font-mono text-text-secondary uppercase">{analyzing ? 'Scanning...' : 'Idle'}</span>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10 flex overflow-hidden lg:px-4">
        {/* SVG Connections Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="edge-idle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.3"></stop>
              <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.1"></stop>
            </linearGradient>
            <linearGradient id="edge-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0"></stop>
              <animate attributeName="x1" from="-100%" to="100%" dur="2s" repeatCount="indefinite" />
              <animate attributeName="x2" from="0%" to="200%" dur="2s" repeatCount="indefinite" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.8"></stop>
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          
          {/* Abstract Paths connecting columns */}
          {[15, 30, 50, 70, 85].map((y1, i) => (
             [20, 40, 60, 80].map((y2, j) => (
               <path key={`i1-${i}-${j}`} d={`M 10% ${y1}% C 25% ${y1}%, 25% ${y2}%, 38% ${y2}%`} 
                     fill="none" stroke={analyzing ? "url(#edge-active)" : "url(#edge-idle)"} strokeWidth="1" className={analyzing ? "opacity-100 transition-opacity duration-300" : "opacity-30"} />
             ))
          ))}
          {[20, 40, 60, 80].map((y1, i) => (
             [20, 40, 60, 80].map((y2, j) => (
               <path key={`h1-${i}-${j}`} d={`M 38% ${y1}% C 50% ${y1}%, 50% ${y2}%, 62% ${y2}%`} 
                     fill="none" stroke={analyzing ? "url(#edge-active)" : "url(#edge-idle)"} strokeWidth="1" style={{ transitionDelay: '300ms' }} />
             ))
          ))}
          {[20, 40, 60, 80].map((y1, i) => (
               <path key={`o1-${i}`} d={`M 62% ${y1}% C 75% ${y1}%, 75% 50%, 90% 50%`} 
                     fill="none" stroke={analyzing ? "url(#edge-active)" : "url(#edge-idle)"} strokeWidth={analyzing ? "2" : "1"} style={{ transitionDelay: '600ms' }} className={analyzing ? 'stroke-secondary drop-shadow-[0_0_5px_rgba(6,182,212,1)]' : ''} />
          ))}
        </svg>

        {/* Nodes layer */}
        <div className="w-full flex justify-between items-center relative z-10 px-[10%] cursor-default">
          {/* L0: Input */}
          <div className="flex flex-col gap-1 items-center justify-center h-full">
            {inputNodes.map((_, i) => (
              <div key={`in-${i}`} className={`w-1.5 h-1.5 rounded-full ${analyzing ? 'bg-primary shadow-[0_0_5px_rgba(14,165,233,0.8)]' : 'bg-outline-variant'}`}></div>
            ))}
            <div className="text-[9px] font-mono text-text-secondary mt-2">Input (17)</div>
          </div>
          
          {/* L1: Hidden 1 */}
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            {hiddenNodes.map((_, i) => (
              <div key={`h1-${i}`} className={`w-2 h-2 rounded-full ${analyzing ? 'bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all delay-100' : 'bg-outline-variant'}`}></div>
            ))}
            <div className="text-[9px] font-mono text-text-secondary mt-1">H1 (128)</div>
          </div>

          {/* L2: Hidden 2 */}
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            {hiddenNodes.map((_, i) => (
              <div key={`h2-${i}`} className={`w-2 h-2 rounded-full ${analyzing ? 'bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all delay-300' : 'bg-outline-variant'}`}></div>
            ))}
            <div className="text-[9px] font-mono text-text-secondary mt-1">H2 (128)</div>
          </div>

          {/* L3: Output */}
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            <div className="relative flex justify-center items-center group-hover:scale-110 transition-transform">
              <div className={`absolute -inset-4 rounded-full blur-md opacity-50 transition-all delay-500 ${analyzing ? 'bg-safe-container animate-pulse' : 'bg-transparent'}`}></div>
              <div className={`w-4 h-4 rounded-full relative z-10 transition-colors delay-500 duration-500 ${analyzing ? 'bg-safe-container shadow-[0_0_15px_rgba(16,185,129,1)]' : 'bg-outline-variant'}`}></div>
            </div>
            <div className="text-[9px] font-mono text-text-secondary mt-2">Output</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KANVisualization;
