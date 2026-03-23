import { Shield, LayoutDashboard, Activity, BarChart2, Info, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="glass-panel w-full h-full flex flex-col justify-between p-6 fade-in-up delay-100">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 bg-secondary rounded-full opacity-20 animate-pulse-slow blur-md"></div>
            <Shield className="text-secondary w-8 h-8 relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
          <h1 className="font-display font-bold text-2xl text-text-primary tracking-wide">
            FraudShield <span className="text-secondary">AI</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/live" icon={<Activity size={20} />} label="Live Detection" />
          <NavItem to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
          <NavItem to="/model" icon={<Info size={20} />} label="Model Info" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
      </div>

      {/* Model Status Card */}
      <div className="bg-[#0b101d] rounded-xl p-4 border border-outline-variant/50 relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-safe-container shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
          <span className="font-sans font-medium text-sm text-text-primary">System Online</span>
        </div>
        <p className="font-mono text-xs text-text-secondary">PSO+KAN Active</p>
        <p className="font-mono text-xs text-text-secondary mt-1">Latency: 12ms</p>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-sans font-medium transition-all duration-300 w-full text-left
        ${isActive 
          ? 'bg-primary/10 text-primary border-l-2 border-primary shadow-[inset_4px_0_0_rgba(14,165,233,0.5)]' 
          : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border-l-2 border-transparent hover:border-text-secondary/30'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]' : ''}>{icon}</span>
          {label}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;
