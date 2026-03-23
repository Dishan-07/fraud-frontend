/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Zap, MapPin, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { analyzeTransaction } from '../api/predict';  // ← ADDED

const AnalyzeForm = ({ onAnalyze }: { onAnalyze: (data: any) => void }) => {
  const { updateState } = useAppContext();
  const [formData, setFormData] = useState({
    amount: '', merchant: '', category: 'shopping_pos', cc_num: '', gender: 'M',
    city_pop: '', job: '', hour: '14', day: '1', month: '6', year: '2026',
    merch_lat: '', merch_long: '', lat: '', long: '',
    distance: '', amt_log: '', amt_per_hour: '',
    is_night: false, is_weekend: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // Auto-calculations
  useEffect(() => {
    const newCalculated = { ...formData };

    if (formData.amount) {
      newCalculated.amt_log = Math.log10(1 + parseFloat(formData.amount)).toFixed(4);
    }

    if (formData.amount && formData.hour) {
      newCalculated.amt_per_hour = (parseFloat(formData.amount) / (parseInt(formData.hour) + 1)).toFixed(2);
    }

    // Real haversine distance calculation
    if (formData.merch_lat && formData.merch_long && formData.lat && formData.long) {
      const toRad = (deg: number) => deg * Math.PI / 180;
      const R = 6371;
      const lat1 = parseFloat(formData.lat);
      const lon1 = parseFloat(formData.long);
      const lat2 = parseFloat(formData.merch_lat);
      const lon2 = parseFloat(formData.merch_long);
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      newCalculated.distance = dist.toFixed(2);
    }

    const hr = parseInt(formData.hour || '0');
    newCalculated.is_night = (hr >= 22 || hr <= 5);
    const d = parseInt(formData.day || '0');
    newCalculated.is_weekend = (d === 0 || d === 6);

    if (newCalculated.amt_log !== formData.amt_log ||
      newCalculated.is_night !== formData.is_night ||
      newCalculated.is_weekend !== formData.is_weekend ||
      newCalculated.amt_per_hour !== formData.amt_per_hour ||
      newCalculated.distance !== formData.distance) {
      setFormData(newCalculated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.amount, formData.hour, formData.merch_lat, formData.merch_long, formData.lat, formData.long, formData.day]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ── FIXED: Now calls real API ─────────────────────────────
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      updateState({ cardNumber: formData.cc_num });
      const result = await analyzeTransaction(formData);  // ← REAL API CALL
      onAnalyze(result);  // ← passes REAL result to parent
    } catch (error) {
      console.error("Analysis failed:", error);
      onAnalyze(formData); // fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-5">
      <div className="flex items-center gap-2 mb-4 text-secondary pb-2 border-b border-outline-variant/50">
        <Zap size={20} className={isLoading ? 'animate-pulse' : ''} />
        <h3 className="font-sans font-bold text-xl text-text-primary">Analyze Transaction</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-6">
        {/* Core Info */}
        <div className="space-y-4">
          <InputGroup name="amount" label="Transaction Amount ($)" type="number" step="0.01" prefix="$" value={formData.amount} onChange={handleChange} required />
          <InputGroup name="merchant" label="Merchant Name" value={formData.merchant} onChange={handleChange} required />

          <div className="relative group">
            <select name="category" value={formData.category} onChange={handleChange} className="peer w-full bg-transparent border-b-2 border-outline-variant py-2 px-1 text-text-primary text-base focus:outline-none focus:border-primary appearance-none transition-colors">
              {['grocery_pos', 'shopping_net', 'misc_net', 'gas_transport', 'grocery_net', 'shopping_pos', 'misc_pos', 'food_dining', 'personal_care', 'health_fitness', 'travel', 'kids_pets', 'home', 'entertainment', 'education'].map(c => (
                <option key={c} value={c} className="bg-background text-text-primary">{c.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
            <label className="absolute -top-3 left-1 text-xs font-semibold text-primary font-mono transition-all">MERCHANT CATEGORY</label>
          </div>

          <InputGroup name="cc_num" label="Card Number (cc_num)" type="password" placeholder="**** **** **** ****" value={formData.cc_num} onChange={handleChange} required />
        </div>

        {/* Spatial & Demographic */}
        <div className="space-y-4 pt-2 border-t border-outline-variant/30">
          <h4 className="text-xs font-semibold text-text-secondary font-mono tracking-widest uppercase">Demographics & Spatial</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group pt-4 mt-1">
              <select name="gender" value={formData.gender} onChange={handleChange} className="peer w-full bg-transparent border-b-2 border-outline-variant py-2 px-1 text-text-primary text-base focus:outline-none focus:border-primary appearance-none transition-colors">
                <option value="M" className="bg-background text-text-primary">Male (M)</option>
                <option value="F" className="bg-background text-text-primary">Female (F)</option>
              </select>
            </div>
            <InputGroup name="city_pop" label="City Pop." type="number" value={formData.city_pop} onChange={handleChange} />
          </div>
          <InputGroup name="job" label="Cardholder Job" value={formData.job} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup name="lat" label="User Lat" type="number" step="0.0001" value={formData.lat} onChange={handleChange} />
            <InputGroup name="long" label="User Long" type="number" step="0.0001" value={formData.long} onChange={handleChange} />
            <InputGroup name="merch_lat" label="Merch Lat" type="number" step="0.0001" value={formData.merch_lat} onChange={handleChange} />
            <InputGroup name="merch_long" label="Merch Long" type="number" step="0.0001" value={formData.merch_long} onChange={handleChange} />
          </div>
        </div>

        {/* Temporal */}
        <div className="space-y-4 pt-2 border-t border-outline-variant/30">
          <h4 className="text-xs font-semibold text-text-secondary font-mono tracking-widest uppercase">Temporal Features</h4>
          <div className="flex items-center gap-4">
            <Clock size={16} className="text-text-secondary" />
            <div className="flex-1 relative group">
              <input type="range" name="hour" min="0" max="23" value={formData.hour} onChange={handleChange} className="w-full accent-secondary" />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>00:00</span>
                <span className="text-secondary font-bold">{formData.hour.padStart(2, '0')}:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Computed (Readonly) */}
        <div className="p-3 bg-surface-container-high/50 border border-outline-variant/50 rounded-lg space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 blur-xl rounded-full"></div>
          <h4 className="text-xs font-semibold text-secondary font-mono tracking-widest uppercase flex items-center gap-1">
            <Zap size={10} /> Auto-Computed Features
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            <ReadOnlyField label="Amt Log" value={formData.amt_log} />
            <ReadOnlyField label="Amt/Hour" value={formData.amt_per_hour} />
            <ReadOnlyField label="Distance (km)" value={formData.distance} icon={<MapPin size={10} />} />
            <div className="col-span-2 flex gap-4 mt-2">
              <Toggle label="Is Night" checked={formData.is_night} readOnly />
              <Toggle label="Is Weekend" checked={formData.is_weekend} readOnly />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 py-3 rounded-lg font-bold tracking-widest uppercase relative overflow-hidden transition-all duration-300
            ${isLoading ? 'bg-surface-container-high text-text-secondary border border-outline-variant' : 'btn-primary'}
          `}
        >
          {isLoading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-scan"></div>}
          <span className="relative z-10">{isLoading ? 'Analyzing...' : 'Analyze Transaction'}</span>
        </button>
      </form>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, type = "text", ...rest }: { label: string, name: string, value?: string, onChange?: any, type?: string, [key: string]: any }) => (
  <div className="relative group pt-4 mt-1">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      autoComplete="new-password"
      className="peer w-full bg-transparent border-b-2 border-outline-variant py-2 px-1 text-text-primary text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
      placeholder={label}
      {...rest}
    />
    <label
      htmlFor={name}
      className={`absolute left-1 transition-all duration-300 font-mono text-text-secondary pointer-events-none
        ${value ? 'top-0 text-sm font-semibold text-primary' : 'top-6 text-base peer-focus:top-0 peer-focus:text-sm peer-focus:font-semibold peer-focus:text-primary'}
      `}
    >
      {label}
    </label>
    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 peer-focus:w-full"></div>
    <style>{`
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, 
      input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #0b1121 inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
      }
    `}</style>
  </div>
);

const ReadOnlyField = ({ label, value, icon = undefined }: { label: string, value?: string | number, icon?: any }) => (
  <div className="flex justify-between items-center bg-background/40 p-1.5 rounded border border-white/5">
    <span className="text-text-secondary flex items-center gap-1 text-xs">{icon}{label}</span>
    <span className="text-text-primary font-bold">{value || '—'}</span>
  </div>
);

const Toggle = ({ label, checked }: { label: string, checked?: boolean, readOnly?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={`w-6 h-3 rounded-full relative transition-colors ${checked ? 'bg-secondary' : 'bg-outline-variant'}`}>
      <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-transform ${checked ? 'translate-x-3.5' : 'translate-x-0.5'}`}></div>
    </div>
    <span className="text-xs text-text-secondary">{label}</span>
  </div>
);

export default AnalyzeForm;