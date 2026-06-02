"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Loader2,
  X
} from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  created_at: string;
}

export default function WalletPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Real-Time Derived Calculations
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);

  // Modal Interaction States
  const [activeModal, setActiveModal] = useState<"fund" | "payout" | null>(null);
  const [modalAmount, setModalAmount] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalCategory, setModalCategory] = useState<string>("General");

  // Sample Targets (Static structural mockup for targets context)
  const savingsTarget = 150000;
  const currentSavingsPool = 85000;

  useEffect(() => {
    fetchWalletCore();
  }, []);

  const fetchWalletCore = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        setUserId(user.id);

        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (txError) throw txError;
        
        if (txData) {
          setTransactions(txData);
          compileWalletBalances(txData);
        }
      }
    } catch (err: any) {
      console.error("Critical error mapping digital ledger balance matrices:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const compileWalletBalances = (data: Transaction[]) => {
    let incomeSum = 0;
    let expenseSum = 0;

    data.forEach((tx) => {
      if (tx.type === "income") {
        incomeSum += tx.amount;
      } else {
        expenseSum += tx.amount;
      }
    });

    setWalletBalance(incomeSum - expenseSum);
    setMonthlyIncome(incomeSum);
    setMonthlyExpense(expenseSum);
  };

  const handleTransactionMutation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !modalAmount || !modalTitle) return;

    const numAmount = parseFloat(modalAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please provide a valid asset configuration value.");
      return;
    }

    const transactionType = activeModal === "fund" ? "income" : "expense";

    try {
      const { error } = await supabase
        .from("transactions")
        .insert([{
          user_id: userId,
          title: modalTitle,
          category: modalCategory,
          type: transactionType,
          amount: numAmount
        }]);

      if (error) throw error;

      setActiveModal(null);
      setModalAmount("");
      setModalTitle("");
      await fetchWalletCore();

    } catch (err: any) {
      alert("Error executing active funding ledger mutation: " + err.message);
    }
  };

  const formatCurrency = (val: number) => {
    return "₦" + val.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0d4d4d]" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 box-border relative">
      
      {/* Header Description Frame */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a3a] tracking-tight">
          Wallet Operations
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Execute balance funding cycles, track liquidity margins, and monitor active savings pots.
        </p>
      </div>

      {/* Top Architecture Grid: Primary Interactive Card & Quick Forms Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Modernized Digital Card Component Frame */}
        <div className="lg:col-span-2 bg-linear-to-br from-[#0d4d4d] to-[#062424] rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col justify-between min-h-55 md:min-h-60 relative overflow-hidden">
          <div className="absolute right-10 top-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-bold text-teal-200 uppercase tracking-widest">Liquid Operating Capital</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 tracking-tight breakdown-words">
                {formatCurrency(walletBalance)}
              </h1>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md shrink-0 ml-4">
              <CreditCard size={24} className="text-teal-300" />
            </div>
          </div>

          <div className="mt-8 lg:mt-12 flex justify-between items-end border-t border-white/10 pt-4 z-10">
            <div>
              <p className="text-[10px] text-teal-200 uppercase tracking-wider font-semibold">Account Sub-Node</p>
              <h3 className="text-sm font-bold tracking-wide mt-0.5">Primary Spending Wallet</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-teal-200 uppercase tracking-wider font-semibold">Status</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Verified
              </span>
            </div>
          </div>
        </div>

        {/* System Interaction Call Control Panel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-[#1e3a3a] uppercase tracking-wider mb-1">Fund Actions</h2>
            <p className="text-xs text-gray-400">Trigger standard balance modification operations directly inside Supabase.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full">
            <button 
              onClick={() => { setActiveModal("fund"); setModalCategory("Deposit"); }}
              className="w-full bg-[#0d4d4d] hover:bg-teal-800 text-white rounded-xl p-3.5 flex items-center justify-between text-sm font-bold transition-all shadow-sm"
            >
              <span>Deposit Liquidity</span>
              <Plus size={16} strokeWidth={3} />
            </button>

            <button 
              onClick={() => { setActiveModal("payout"); setModalCategory("Withdrawal"); }}
              className="w-full bg-gray-50 hover:bg-gray-100 text-[#1e3a3a] border border-gray-200 rounded-xl p-3.5 flex items-center justify-between text-sm font-bold transition-all"
            >
              <span>Simulate Outflow</span>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Row: Data Grid Aggregate Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Node Metrics */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-400 block tracking-wide uppercase truncate">Aggregate Income</span>
            <span className="text-xl font-bold text-gray-800 mt-0.5 block truncate">{formatCurrency(monthlyIncome)}</span>
          </div>
        </div>

        {/* Burn Cost Node Metrics */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 shrink-0">
            <TrendingDown size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-400 block tracking-wide uppercase truncate">Aggregate Outflow</span>
            <span className="text-xl font-bold text-gray-800 mt-0.5 block truncate">{formatCurrency(monthlyExpense)}</span>
          </div>
        </div>

        {/* Target Asset Goal Track Frame */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Target size={16} className="text-teal-700 shrink-0" />
              <span className="text-xs font-bold text-gray-400 tracking-wide uppercase truncate">Savings Goal Lock</span>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 ml-2 shrink-0">
              {Math.round((currentSavingsPool / savingsTarget) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              style={{ width: `${(currentSavingsPool / savingsTarget) * 100}%` }} 
              className="bg-[#0d4d4d] h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

      </div>

      {/* Ledger History Listing Block Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-bold text-[#1e3a3a]">Wallet Specific Log</h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time mutation telemetry for funding changes.</p>
        </div>

        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto pr-1">
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No live wallet transactions currently logged.</p>
          ) : (
            transactions.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{tx.title}</h4>
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 mt-1 inline-block max-w-full truncate">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold block ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                      {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Simulation Modal Overlay Module */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-base font-bold text-[#1e3a3a] mb-4 pr-6">
              {activeModal === "fund" ? "Deposit Operational Funds" : "Log Payout Mutation"}
            </h3>

            <form onSubmit={handleTransactionMutation} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Transaction Label</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., ATM Cash Inflow" 
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0d4d4d] font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Target Category</label>
                <input 
                  type="text" 
                  placeholder="e.g., Deposit, Salary" 
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0d4d4d] font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Value Amount (₦)</label>
                <input 
                  type="number" 
                  required
                  placeholder="Amount" 
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0d4d4d] font-mono font-bold"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 h-10 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 h-10 bg-[#0d4d4d] hover:bg-teal-800 text-white font-bold rounded-lg text-xs transition"
                >
                  Commit Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}