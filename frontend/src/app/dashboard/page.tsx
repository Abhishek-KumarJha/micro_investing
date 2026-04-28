"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: number;
  amount: number;
  category: string;
  round_off_amount: number;
  is_invested: boolean;
}

interface Asset {
  id: number;
  symbol: string;
  name: string;
  risk_level: string;
  expected_returns: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recommendations, setRecommendations] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, recRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/v1/transactions/'),
        fetch('http://127.0.0.1:8000/api/v1/investments/recommendations')
      ]);
      if (txRes.ok) setTransactions(await txRes.json());
      if (recRes.ok) setRecommendations(await recRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    try {
      setInvesting(true);
      const res = await fetch('http://127.0.0.1:8000/api/v1/invest/invest_now', {
        method: 'POST'
      });
      if (res.ok) {
        await fetchData(); // Refresh data
        alert('Investment simulated successfully!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInvesting(false);
    }
  };

  const pendingTransactions = transactions.filter(tx => !tx.is_invested);
  const totalRoundOff = pendingTransactions.reduce((sum, tx) => sum + tx.round_off_amount, 0);

  const [activeTab, setActiveTab] = useState<'overview' | 'calculator'>('overview');
  
  // Calculator States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [fixedExpenses, setFixedExpenses] = useState<number>(20000);
  const [variableExpenses, setVariableExpenses] = useState<number>(15000);

  const disposableIncome = monthlyIncome - fixedExpenses - variableExpenses;
  const estimatedSpareChange = variableExpenses * 0.04;
  const recommendedMicroInvestment = Math.max(0, (disposableIncome * 0.10) + estimatedSpareChange);

  // Wealth Projection Logic
  const annualReturnRate = 0.12;
  const projectWealth = (years: number) => {
    const monthlyRate = annualReturnRate / 12;
    const months = years * 12;
    if (recommendedMicroInvestment <= 0) return 0;
    return recommendedMicroInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  };

  const wealth5Yr = projectWealth(5);
  const wealth10Yr = projectWealth(10);
  const wealth20Yr = projectWealth(20);
  const maxWealth = Math.max(wealth20Yr, 1);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-emerald-50 text-slate-800 font-sans selection:bg-emerald-100 relative">
      
      {/* Soft decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/5 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">
              🌱
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">MicroInvest</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
            Exit Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        
        {/* Simple Tab Switcher */}
        <div className="flex gap-2 p-1.5 bg-white/50 border border-slate-200/50 backdrop-blur-sm rounded-xl w-fit mb-10 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'overview' ? 'bg-gradient-to-r from-white to-slate-50 text-slate-900 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'}`}
          >
            My Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'calculator' ? 'bg-gradient-to-r from-white to-slate-50 text-slate-900 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'}`}
          >
            Planning Tools
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Money & Transactions) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* The "Piggy Bank" Summary Card */}
              <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ready to Invest</h2>
                  <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tighter mb-2">
                    ₹{totalRoundOff.toFixed(2)}
                  </div>
                  <p className="text-slate-500 text-sm">Accumulated from your recent daily spending.</p>
                </div>
                
                <button 
                  onClick={handleInvest}
                  disabled={totalRoundOff === 0 || investing || loading}
                  className="relative z-10 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 border border-emerald-400/20"
                >
                  {investing ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <>Invest Now</>
                  )}
                </button>
              </section>

              {/* Simple Transactions List */}
              <section className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-8 border border-white shadow-lg shadow-slate-200/30">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">{transactions.length} items</span>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {transactions.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-500 font-medium">No activity yet.</p>
                      <p className="text-sm text-slate-400 mt-1">Upload your bank statement to see the magic.</p>
                    </div>
                  )}
                  {loading && (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                  )}
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center p-4 rounded-2xl bg-white hover:bg-slate-50 transition-colors border border-slate-100 shadow-sm hover:shadow-md group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-xl shadow-inner border border-slate-200 group-hover:scale-105 transition-transform">
                          {tx.category.toLowerCase().includes('food') || tx.category.toLowerCase().includes('dining') ? '🍔' : 
                           tx.category.toLowerCase().includes('transport') ? '🚗' : 
                           tx.category.toLowerCase().includes('entertainment') ? '🍿' :
                           tx.category.toLowerCase().includes('electronics') ? '💻' :
                           tx.category.toLowerCase().includes('travel') ? '✈️' : '💳'}
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold">{tx.category}</p>
                          <p className="text-slate-500 text-sm">Spent ₹{tx.amount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 px-3 py-1 rounded-lg inline-block mb-1 border border-emerald-100">
                          <p className="font-bold text-sm">+ ₹{tx.round_off_amount.toFixed(2)}</p>
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider block ${tx.is_invested ? "text-blue-500" : "text-slate-400"}`}>
                          {tx.is_invested ? "Invested ✓" : "Saved"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (AI & Upload) */}
            <div className="space-y-8">
              
              <section className="bg-gradient-to-b from-white to-blue-50/30 rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20 relative z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Smart Advice</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed relative z-10">Our AI analyzes your spending habits to find the safest and fastest ways for your money to grow.</p>
                
                {/* Clean File Uploader */}
                <div className="mb-8 p-6 rounded-2xl bg-white border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative group shadow-sm">
                  <input 
                    type="file" 
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setLoading(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('http://127.0.0.1:8000/api/v1/investments/upload-predict', { method: 'POST', body: formData });
                        if (res.ok) {
                          setRecommendations(await res.json());
                          const txRes = await fetch('http://127.0.0.1:8000/api/v1/transactions/');
                          if (txRes.ok) setTransactions(await txRes.json());
                        } else {
                          alert("Error checking statement. Please ensure it is a CSV.");
                        }
                      } catch(err) {
                        console.error(err);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Upload Bank Statement</p>
                    <p className="text-xs text-slate-400 mt-1">.CSV format</p>
                  </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-3 relative z-10">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Suggestions For You</h3>
                  
                  {loading && (
                    <div className="text-center py-6">
                      <p className="text-slate-500 text-sm animate-pulse">Thinking...</p>
                    </div>
                  )}
                  {!loading && recommendations.length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-slate-500 text-sm">No suggestions yet.</p>
                    </div>
                  )}
                  {!loading && recommendations.map((asset, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-slate-900 font-bold text-lg">{asset.symbol}</h3>
                          <p className="text-slate-500 text-xs">{asset.name}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          asset.risk_level === 'Aggressive' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          asset.risk_level === 'Moderate' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {asset.risk_level}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                        <span className="text-slate-500 text-xs font-medium">Expected Return</span>
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded">+{asset.expected_returns}% / yr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Calculator View */
          <div className="space-y-8 animate-fade-in">
            <section className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 border border-white shadow-xl shadow-slate-200/50">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-4">Investment Planner</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Enter your basic monthly expenses below. We'll show you exactly how much passive wealth you can build without changing your lifestyle.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 shadow-inner">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Monthly Income (₹)</label>
                    <input 
                      type="number" 
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Fixed Bills (Rent, EMI, Utilities) (₹)</label>
                    <input 
                      type="number" 
                      value={fixedExpenses}
                      onChange={(e) => setFixedExpenses(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Variable Spending (Food, Fun) (₹)</label>
                    <input 
                      type="number" 
                      value={variableExpenses}
                      onChange={(e) => setVariableExpenses(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-5">
                  <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-md">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Money Left Over</h3>
                    <div className="text-3xl font-black text-slate-900">₹{Math.max(0, disposableIncome).toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 shadow-md relative overflow-hidden">
                    <h3 className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Est. Passive Savings</h3>
                    <div className="text-3xl font-black text-emerald-600">₹{Math.max(0, estimatedSpareChange).toLocaleString()}</div>
                    <p className="text-xs text-emerald-600/70 mt-1 font-medium">Automatic round-offs from daily spending</p>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 relative overflow-hidden transform hover:scale-[1.02] transition-transform">
                    <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Smart Target to Invest</h3>
                    <div className="text-4xl font-black text-white relative z-10">₹{Math.max(0, recommendedMicroInvestment).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <p className="text-xs text-blue-200 mt-2 font-medium relative z-10">Passive Savings + 10% of Left Over Money</p>
                  </div>
                </div>
              </div>
            </section>

            {/* See Your Future Component Fixes */}
            <section className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl shadow-slate-200/50 text-center overflow-visible">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">See Your Future</h2>
              <p className="text-slate-500 max-w-2xl mx-auto mb-16">
                If you just set aside <strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">₹{recommendedMicroInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> every month automatically, here is what your wealth could look like.
              </p>
              
              {/* Increased height, added pt-12 to ensure numbers don't clip, removed overflow-hidden */}
              <div className="flex items-end justify-center gap-6 sm:gap-16 h-72 pt-12 mt-8 px-4 border-b border-slate-200 pb-0">
                
                {/* 5 Years */}
                <div className="flex flex-col items-center w-full max-w-[140px] group relative">
                  {/* Made text permanently visible instead of hover, positioned absolutely above the bar so it never clips */}
                  <div className="absolute -top-10 text-emerald-600 font-extrabold text-lg transition-transform group-hover:-translate-y-2 group-hover:scale-110">
                    ₹{(wealth5Yr / 100000).toFixed(2)}L
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-300 to-emerald-500 rounded-t-xl shadow-lg shadow-emerald-500/20 transition-all duration-1000 ease-out group-hover:brightness-110 border-x border-t border-emerald-400/50"
                    style={{ height: `${Math.max(8, (wealth5Yr / maxWealth) * 100)}%` }}
                  ></div>
                  <div className="mt-4 text-slate-600 font-bold text-sm pb-4 tracking-wide uppercase">5 Yrs</div>
                </div>

                {/* 10 Years */}
                <div className="flex flex-col items-center w-full max-w-[140px] group relative">
                  <div className="absolute -top-10 text-blue-600 font-extrabold text-lg transition-transform group-hover:-translate-y-2 group-hover:scale-110">
                    ₹{(wealth10Yr / 100000).toFixed(2)}L
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-300 to-blue-500 rounded-t-xl shadow-lg shadow-blue-500/20 transition-all duration-1000 ease-out group-hover:brightness-110 border-x border-t border-blue-400/50"
                    style={{ height: `${Math.max(8, (wealth10Yr / maxWealth) * 100)}%` }}
                  ></div>
                  <div className="mt-4 text-slate-600 font-bold text-sm pb-4 tracking-wide uppercase">10 Yrs</div>
                </div>

                {/* 20 Years */}
                <div className="flex flex-col items-center w-full max-w-[140px] group relative">
                  <div className="absolute -top-10 text-indigo-600 font-extrabold text-xl transition-transform group-hover:-translate-y-2 group-hover:scale-110">
                    ₹{(wealth20Yr / 10000000).toFixed(2)}Cr
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-t-xl shadow-xl shadow-indigo-500/30 transition-all duration-1000 ease-out group-hover:brightness-110 border-x border-t border-indigo-400/50"
                    style={{ height: '100%' }}
                  ></div>
                  <div className="mt-4 text-slate-900 font-black text-sm pb-4 tracking-wide uppercase">20 Yrs</div>
                </div>

              </div>
              <p className="text-xs font-medium text-slate-400 mt-6">* Projections based on historical 12% average returns.</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
