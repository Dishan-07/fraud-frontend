import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Fingerprint, Activity, Server } from 'lucide-react';

const mockStream = [
  { id: 'TX-9901A', src: '92.168.1.10', dist: '12km', score: 0.12, status: 'SAFE' },
  { id: 'TX-9901B', src: '110.45.2.1', dist: '4005km', score: 0.89, status: 'BLOCK' },
  { id: 'TX-9902A', src: '10.0.0.55', dist: '2km', score: 0.05, status: 'SAFE' },
  { id: 'TX-9903X', src: '192.168.2.1', dist: '15km', score: 0.22, status: 'SAFE' },
  { id: 'TX-9904Y', src: '45.22.11.9', dist: '850km', score: 0.94, status: 'BLOCK' },
];

const LiveDetectionPage: React.FC = () => {
  const [logs, setLogs] = useState<typeof mockStream>(mockStream.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLog = mockStream[Math.floor(Math.random() * mockStream.length)];
        const newLog = { ...nextLog, id: `TX-${Math.floor(Math.random() * 10000)}Z` };
        return [newLog, ...prev].slice(0, 15);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full h-full pb-8 pr-4 overflow-hidden gap-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display font-medium text-white mb-2 tracking-tight">Live Threat Telemetry</h2>
          <p className="text-text-secondary flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-error-container animate-pulse"></div> Socket connected to core engine cluster.</p>
        </div>
        <div className="flex bg-surface-bright rounded-xl p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <button className="px-6 py-2 bg-[#0A0A0A] text-white rounded-lg text-sm shadow-[0_2px_8px_rgba(0,0,0,0.8)] border border-white/5">Raw Feed</button>
          <button className="px-6 py-2 text-text-secondary rounded-lg text-sm hover:text-white transition-colors">Visualizer</button>
        </div>
      </div>
      
      <div className="flex gap-6 h-full min-h-[500px]">
        {/* Left: Terminal Log */}
        <div className="w-[60%] glass-panel-interactive flex flex-col overflow-hidden border-t-4 border-t-primary">
          <div className="bg-[#050505] p-3 border-b border-border/50 flex items-center gap-2">
            <Server size={14} className="text-text-secondary" />
            <span className="font-mono text-xs text-text-secondary tracking-widest uppercase">sys.packet_stream // cluster_alpha</span>
          </div>
          <div className="flex-1 p-4 overflow-hidden bg-[#020202]">
            <div className="grid grid-cols-5 text-xs font-mono text-text-tertiary mb-4 border-b border-border/30 pb-2">
              <span className="col-span-1">PACKET_ID</span>
              <span className="col-span-1">IP_SOURCE</span>
              <span className="col-span-1">GEO_DELTA</span>
              <span className="col-span-1">KAN_SCORE</span>
              <span className="col-span-1">SYS_ACT</span>
            </div>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div 
                    key={log.id + i}
                    initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                    className="grid grid-cols-5 text-sm font-mono items-center py-2 border-b border-white/5"
                  >
                    <span className="col-span-1 text-primary">{log.id}</span>
                    <span className="col-span-1 text-text-secondary">{log.src}</span>
                    <span className="col-span-1 text-text-secondary">{log.dist}</span>
                    <span className="col-span-1 text-white">{log.score.toFixed(4)}</span>
                    <span className={`col-span-1 px-2 py-1 flex items-center gap-2 max-w-fit rounded text-xs ${log.status === 'BLOCK' ? 'bg-error-container/20 text-error-container border border-error-container/30' : 'bg-surface-bright text-text-secondary'}`}>
                      {log.status === 'BLOCK' ? <ShieldAlert size={10} /> : <Activity size={10} />}
                      {log.status}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Radar/Node Details */}
        <div className="w-[40%] flex flex-col gap-6">
          <div className="glass-panel-interactive h-[250px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] opacity-50"></div>
            {/* Mock CSS Radar */}
            <div className="w-48 h-48 rounded-full border border-secondary/20 relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-secondary/20"></div>
              <div className="w-16 h-16 rounded-full border border-secondary/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary/20 to-transparent animate-spin [animation-duration:3s] rounded-full blur-sm"></div>
              
              <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-error-container animate-ping"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-primary/80"></div>
            </div>
          </div>
          
          <div className="glass-panel-interactive flex-1 p-6">
            <h3 className="font-mono text-base tracking-widest text-[#A1A1AA] uppercase mb-4 flex items-center gap-2"><Fingerprint size={14}/> Active Node Trace</h3>
            <div className="bg-[#050505] rounded-xl p-4 border border-white/5 border-l-2 border-l-error-container font-mono text-sm space-y-2">
              <p className="text-white">Tracing Threat Origin...</p>
              <p className="text-[#52525B]">HOP 1: 192.168.1.1 (CLEAN)</p>
              <p className="text-[#52525B]">HOP 2: 10.4.5.21 (CLEAN)</p>
              <p className="text-error-container underline decoration-error-container/30">HOP 3: 45.22.11.9 (KNOWN OFFENDER)</p>
              <div className="pt-2 mt-2 border-t border-white/5 flex gap-2">
                <span className="px-2 py-0.5 bg-error-container text-black font-bold">BLOCK ENFORCED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveDetectionPage;
