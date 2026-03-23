import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const timeData = [
  { time: '00:00', safe: 4000, fraud: 240 },
  { time: '04:00', safe: 3000, fraud: 139 },
  { time: '08:00', safe: 8000, fraud: 980 },
  { time: '12:00', safe: 12000, fraud: 1300 },
  { time: '16:00', safe: 15000, fraud: 800 },
  { time: '20:00', safe: 11000, fraud: 450 },
  { time: '23:59', safe: 6000, fraud: 300 },
];

const categoryData = [
  { name: 'Shopping (POS)', value: 400 },
  { name: 'Online Retail', value: 300 },
  { name: 'Crypto Exchange', value: 300 },
  { name: 'Travel', value: 200 },
];
const COLORS = ['#FFFFFF', '#A1A1AA', '#52525B', '#1E1E1E'];

const AnalyticsPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full h-full pb-8 pr-4 custom-scrollbar overflow-y-auto"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-display font-medium text-white mb-2 tracking-tight">System Analytics</h2>
          <p className="text-text-secondary">Comprehensive historical data visualization mapping KAN inferences globally.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-bright text-text-primary rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">Export CSV</button>
          <button className="px-4 py-2 bg-primary text-background rounded-xl text-sm font-semibold shadow-[0_4px_14px_0_rgba(255,255,255,0.3)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-0.5 transition-all">Generate Report</button>
        </div>
      </div>
      
      {/* Top Main Chart */}
      <div className="glass-panel-interactive p-6 mb-6 h-[400px] flex flex-col">
        <h3 className="font-medium text-lg mb-6 text-white">Detection Volatility (24h)</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3366" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF3366" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#52525B" tick={{fill: '#A1A1AA', fontSize: 12}} />
              <YAxis stroke="#52525B" tick={{fill: '#A1A1AA', fontSize: 12}} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#FAFAFA' }}
              />
              <Area type="monotone" dataKey="safe" stroke="#FFFFFF" fillOpacity={1} fill="url(#colorSafe)" />
              <Area type="monotone" dataKey="fraud" stroke="#FF3366" fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-6 h-[350px]">
        <div className="glass-panel-interactive p-6 flex flex-col">
          <h3 className="font-medium text-lg mb-6 text-white">Fraud by Category</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '12px' }}
                  itemStyle={{ color: '#FAFAFA' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel-interactive p-6 flex flex-col">
           <h3 className="font-medium text-lg mb-6 text-white">Top Target Regions</h3>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={timeData.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1A1A1A" />
                 <XAxis type="number" stroke="#52525B" tick={{fill: '#A1A1AA', fontSize: 12}} />
                 <YAxis dataKey="time" type="category" stroke="#52525B" tick={{fill: '#A1A1AA', fontSize: 12}} />
                 <RechartsTooltip 
                   cursor={{fill: '#111111'}}
                   contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '12px' }}
                 />
                 <Bar dataKey="fraud" fill="#FFFFFF" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
