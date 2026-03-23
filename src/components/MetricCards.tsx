/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { CreditCard, AlertTriangle, Crosshair, ShieldCheck } from 'lucide-react';

const MetricCards = () => {
  return (
    <div className="grid grid-cols-4 gap-5 w-full mb-6 shrink-0">
      <Card
        title="Total Transactions"
        value={124859}
        prefix=""
        colorClass="border-t-primary"
        icon={<CreditCard className="text-primary" size={24} />}
        delay="delay-100"
      />
      <Card
        title="Fraud Detected Today"
        value={432}
        prefix=""
        colorClass="border-t-error-container"
        icon={<AlertTriangle className="text-error-container" size={24} />}
        delay="delay-200"
      />
      <Card
        title="Model Accuracy"
        value={97.66}
        suffix="%"
        decimals={2}
        colorClass="border-t-secondary"
        icon={<Crosshair className="text-secondary" size={24} />}
        delay="delay-300"
      />
      <Card
        title="Money Protected"
        value={142850}
        prefix="$"
        colorClass="border-t-safe-container"
        icon={<ShieldCheck className="text-safe-container" size={24} />}
        delay="delay-400"
      />
    </div>
  );
};

const Card = ({ title, value, prefix = "", suffix = "", decimals = 0, colorClass, icon, delay }: any) => {
  // Simple count up effect
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = parseFloat(value);
    const duration = 1500;
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp!) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(start + (end - start) * easeProgress);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  const formattingOptions = decimals > 0 ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {};
  const formattedValue = displayValue.toLocaleString('en-US', formattingOptions);

  return (
    <div className={`glass-panel-interactive p-4 relative overflow-hidden group ${colorClass} border-t-[3px] fade-in-up ${delay}`}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-text-secondary">{title}</h3>
        <div className="p-1.5 bg-white/5 rounded-md backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="font-mono text-3xl font-bold text-text-primary tracking-tight">
          {prefix}{formattedValue}{suffix}
        </span>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
    </div>
  );
};

export default MetricCards;
