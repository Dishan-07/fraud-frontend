import { mockTransactions } from '../data/mockData';
import { ChevronRight, ShieldAlert, ShieldCheck } from 'lucide-react';

const TransactionTable = () => {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-sans font-bold text-lg text-text-primary">Recent Transactions</h3>
        <button className="text-sm text-primary hover:text-secondary transition-colors flex items-center font-medium">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 text-xs font-mono text-text-secondary uppercase tracking-wider">
              <th className="pb-3 pl-2 font-medium">Trx ID</th>
              <th className="pb-3 font-medium">Merchant</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Time / Dist</th>
              <th className="pb-3 font-medium">Verdict</th>
              <th className="pb-3 font-medium pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-sans divide-y divide-outline-variant/30">
            {mockTransactions.map((trx, i) => (
              <tr 
                key={trx.id} 
                className={`group hover:bg-white/[0.02] transition-colors
                  ${!trx.safe ? 'bg-error-container/[0.03] border-l-2 border-l-error-container/50' : 'border-l-2 border-l-transparent hover:border-l-safe-container/30'}
                `}
                style={{ animationDelay: `${200 + i * 50}ms` }}
              >
                <td className="py-3 pl-2 font-mono text-sm text-text-secondary group-hover:text-text-primary transition-colors">{trx.id}</td>
                <td className="py-3 font-medium text-text-primary">{trx.merchant}</td>
                <td className="py-3 text-sm text-text-secondary">{trx.category.replace('_', ' ')}</td>
                <td className="py-3 font-mono font-medium">${trx.amount.toFixed(2)}</td>
                <td className="py-3 text-sm text-text-secondary">
                  <span>{trx.time}</span>
                  <span className="mx-1">•</span>
                  <span>{trx.location}</span>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider
                    ${trx.safe 
                      ? 'bg-safe-container/10 text-safe-container border-safe-container/20' 
                      : 'bg-error-container/10 text-error-container border-error-container/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]'}
                  `}>
                    {!trx.safe && <ShieldAlert size={12} className="text-error-container" />}
                    {trx.safe && <ShieldCheck size={12} className="text-safe-container" />}
                    {trx.safe ? 'Safe' : 'Fraud'}
                  </span>
                </td>
                <td className="py-3 pr-2 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-medium px-2 py-1 rounded border border-outline-variant hover:bg-white/5 text-text-primary">
                      Details
                    </button>
                    {!trx.safe && (
                      <button className="text-xs font-medium px-2 py-1 rounded border border-error-container/50 hover:bg-error-container/20 text-error-container">
                        Block
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
