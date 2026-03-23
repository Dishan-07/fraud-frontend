import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, CreditCard, ShieldCheck, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SettingsPageProps {
  onLogout?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { state, updateState } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full h-full pb-8 pr-4 custom-scrollbar overflow-y-auto"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-display font-medium text-white mb-2 tracking-tight">Account Details</h2>
          <p className="text-text-secondary">Manage your personal information, billing details, and active sessions.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-base font-semibold border border-red-500/30 transition-all duration-300"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column Controls */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Profile Box */}
          <div className="glass-panel-interactive p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <User className="text-primary" size={20} />
              <h3 className="font-medium text-xl text-white">Personal Information</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-text-tertiary font-mono mb-1">Full Name</label>
                <div className="flex items-center bg-surface-bright border border-white/5 rounded-xl px-4 py-3">
                  <User size={16} className="text-text-secondary mr-3" />
                  <input type="text" value={state.name} onChange={e => updateState({ name: e.target.value })} placeholder="Enter your name" className="bg-transparent border-none text-white text-base w-full focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-tertiary font-mono mb-1">Email Address</label>
                <div className="flex items-center bg-surface-bright border border-white/5 rounded-xl px-4 py-3">
                  <Mail size={16} className="text-text-secondary mr-3" />
                  <input type="email" value={state.email} onChange={e => updateState({ email: e.target.value })} placeholder="Enter your email" className="bg-transparent border-none text-white text-base w-full focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Billing Box */}
          <div className="glass-panel-interactive p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors"></div>
            
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <CreditCard className="text-secondary" size={20} />
              <h3 className="font-medium text-xl text-white">Payment Method</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-text-tertiary font-mono mb-1">Credit Card Number</label>
                <div className="flex items-center bg-surface-bright border border-white/5 rounded-xl px-4 py-3">
                  <CreditCard size={16} className="text-text-secondary mr-3" />
                  <input type="text" value={state.cardNumber} onChange={e => updateState({ cardNumber: e.target.value })} placeholder="**** **** **** ****" className="bg-transparent border-none text-white text-base tracking-widest font-mono w-full focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-tertiary font-mono mb-1">CVV</label>
                  <div className="flex items-center bg-surface-bright border border-white/5 rounded-xl px-4 py-3">
                    <ShieldCheck size={16} className="text-text-secondary mr-3" />
                    <input type="password" value={state.cvv} onChange={e => updateState({ cvv: e.target.value })} placeholder="***" className="bg-transparent border-none text-white text-base w-full focus:outline-none tracking-widest font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-tertiary font-mono mb-1">Expiry Date</label>
                  <div className="flex items-center bg-surface-bright border border-white/5 rounded-xl px-4 py-3">
                    <input type="text" value={state.expiry} onChange={e => updateState({ expiry: e.target.value })} placeholder="MM/YY" className="bg-transparent border-none text-white text-base w-full focus:outline-none font-mono" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Control Status */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="glass-panel-interactive p-6 flex flex-col gap-4">
            <h3 className="font-medium text-lg text-white border-b border-border/50 pb-4">Account Security</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Your account is currently protected by FraudShield AI's enterprise-grade security. All sensitive payment details are encrypted at rest.</p>
            <div className="mt-4 p-4 rounded-lg border border-[#10b981]/30 bg-[#10b981]/10 flex items-start gap-3">
              <ShieldCheck className="text-[#10b981] shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-base font-semibold text-[#10b981]">Identity Verified</p>
                <p className="text-xs text-text-tertiary mt-1">Multi-factor checking passed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
