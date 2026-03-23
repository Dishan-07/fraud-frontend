import React, { useState } from 'react';
import MetricCards from '../components/MetricCards';
import PSOChart from '../components/PSOChart';
import KANVisualization from '../components/KANVisualization';
import TransactionTable from '../components/TransactionTable';
import AnalyzeForm from '../components/AnalyzeForm';
import ResultsPanel from '../components/ResultsPanel';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null); // ← ADDED

  // ── FIXED: store real prediction result ──────────────────
  const handleAnalyze = (result: any) => {
    setPredictionResult(result);  // ← save real result
    setShowResults(true);
  };

  return (
    <div className="flex flex-1 gap-6 w-full max-w-full overflow-hidden">
      {/* CENTER COLUMN */}
      <main className="flex-1 flex flex-col gap-6 w-full lg:w-[65%] overflow-y-auto pr-2 custom-scrollbar">
        <MetricCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="glass-panel h-80 flex items-center justify-center"
          >
            <PSOChart />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="glass-panel h-80 flex flex-col items-center justify-center"
          >
            <KANVisualization />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass-panel flex-1 min-h-[350px] flex justify-center items-center"
        >
          <TransactionTable />
        </motion.div>
      </main>

      {/* RIGHT COLUMN */}
      <aside className="hidden xl:flex flex-col w-[35%] min-w-[380px] max-w-[450px] gap-6 overflow-y-auto pr-2 custom-scrollbar pb-6 relative">

        {/* FIXED: pass handleAnalyze to get real result */}
        <AnalyzeForm onAnalyze={handleAnalyze} />

        <div className={`transition-all duration-700 ease-in-out overflow-hidden flex flex-col ${showResults ? 'max-h-[800px] opacity-100 shrink-0' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          {/* FIXED: pass real data to ResultsPanel */}
          <ResultsPanel show={showResults} data={predictionResult} />
        </div>
      </aside>
    </div>
  );
};

export default DashboardPage;