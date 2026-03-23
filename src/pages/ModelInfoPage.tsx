import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, Cpu, Box } from 'lucide-react';

const ModelInfoPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full h-full pb-8 pr-4 custom-scrollbar overflow-y-auto"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-display font-medium text-white mb-2 tracking-tight">Core Architecture Layer</h2>
        <p className="text-lg text-text-secondary">Deep dive into the proprietary PSO + KAN synergy powering FraudShield.</p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Network />, val: '1.4M', label: 'Playable Params' },
          { icon: <Cpu />, val: '12ms', label: 'Avg Inference Time' },
          { icon: <Database />, val: '80GB', label: 'Training Corpus' },
          { icon: <Box />, val: '3rd Gen', label: 'Engine Iteration' },
        ].map((m, i) => (
          <div key={i} className="glass-panel-interactive p-5 flex items-center gap-4 border-t-2 border-t-outline-variant hover:border-t-primary">
            <div className="p-3 bg-[#050505] rounded-xl text-primary">{m.icon}</div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{m.val}</p>
              <p className="text-sm text-text-secondary font-mono mt-1">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="glass-panel-interactive p-8 h-full flex flex-col justify-center border-l-2 border-l-primary">
            <h3 className="text-2xl font-display font-medium text-white mb-4">Particle Swarm Optimization (PSO)</h3>
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Unlike standard gradient descent, we utilize a highly parallelized PSO algorithm to navigate the complex topological loss landscape of financial data. This allows the model to escape deep local minima associated with highly imbalanced datasets (where non-fraud vastly outnumbers fraud).
            </p>
            <div className="bg-[#050505] rounded-xl p-4 font-mono text-xs text-text-tertiary">
              <span className="text-primary italic"># Hyper-convergence parameter</span><br/>
              fitness = w * V(i) + c1 * r1 * (pBest - X(i)) + c2 * r2 * (gBest - X(i))
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel-interactive p-8 h-full flex flex-col justify-center border-r-2 border-r-secondary">
            <h3 className="text-2xl font-display font-medium text-white mb-4">Kolmogorov-Arnold Networks (KAN)</h3>
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              By replacing fixed node activation functions (like ReLU) with learnable activation functions placed strictly on the edges (splines), our KAN implementation drastically reduces the required depth of the network while vastly increasing interpretable boundary accuracy.
            </p>
            <div className="bg-[#050505] rounded-xl p-4 font-mono text-xs text-text-tertiary">
              <span className="text-secondary italic"># Edge-based spline evaluation</span><br/>
              Φ(x, y) = Σ ( α_i * Bspline_i(x) + β_j * Bspline_j(y) )
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelInfoPage;
