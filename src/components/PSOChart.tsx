import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { psoData } from '../data/mockData';

const PSOChart = () => {
  return (
    <div className="w-full h-full flex flex-col p-4 relative group">
      <div className="flex justify-between items-center mb-4 z-10">
        <div>
          <h3 className="font-sans font-medium text-text-primary">PSO Convergence</h3>
          <p className="text-xs text-text-secondary">KAN Architecture Search</p>
        </div>
        <div className="bg-primary/10 border border-primary/30 px-3 py-1 rounded-full backdrop-blur-md">
          <span className="text-xs font-mono text-primary drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]">Best F1: 0.9551</span>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-10 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={psoData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" opacity={0.5} vertical={false} />
            <XAxis dataKey="iteration" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={[0.6, 1]} ticks={[0.6, 0.7, 0.8, 0.9, 1.0]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0D1526', borderColor: '#1E3A5F', borderRadius: '8px', color: '#F1F5F9' }}
              itemStyle={{ color: '#F1F5F9' }}
            />
            <Line 
              type="monotone" 
              dataKey="bestF1" 
              name="Best F1 Score"
              stroke="#0EA5E9" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#050914', stroke: '#0EA5E9', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#0EA5E9', stroke: '#fff', strokeWidth: 1 }}
              animationDuration={2500}
              animationEasing="ease-out"
            />
            <Line 
              type="monotone" 
              dataKey="avgF1" 
              name="Avg F1 Score"
              stroke="#f97316" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#050914', stroke: '#f97316', strokeWidth: 2 }}
              animationDuration={2500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Background glowing flair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
    </div>
  );
};

export default PSOChart;
