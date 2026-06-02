"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  AlertCircle, 
  Zap, 
  ShoppingBag, 
  ArrowLeftRight 
} from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  created_at: string;
}

interface CategoryTotal {
  name: string;
  amount: number;
  percentage: number;
}

export default function InsightPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Computed Insight Metrics
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [highestCategory, setHighestCategory] = useState<{ name: string; amount: number }>({ name: "None", amount: 0 });
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  
  // Weekly Chart Array (Mon - Sun values derived dynamically)
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchInsightEngine = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (user) {
          // Fetch transactions for analytical parsing
          const { data: txData, error: txError } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (txError) throw txError;
          
          if (txData) {
            setTransactions(txData);
            calculateMetrics(txData);
          }
        }
      } catch (err: any) {
        console.error("Error building analytical insight layout:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsightEngine();
  }, []);

  const calculateMetrics = (data: Transaction[]) => {
    let incomeSum = 0;
    let expenseSum = 0;
    const categoriesMap: { [key: string]: number } = {};
    const daysOfWeekMap = [0, 0, 0, 0, 0, 0, 0]; // Mon = 0, Tue = 1 ... Sun = 6

    data.forEach((tx) => {
      const amt = tx.amount;
      if (tx.type === "income") {
        incomeSum += amt;
      } else {
        expenseSum += amt;
        
        // Map spending to specific categories
        const catName = tx.category || "Uncategorized";
        categoriesMap[catName] = (categoriesMap[catName] || 0) + amt;

        // Map spending to day of the week for the chart
        const txDate = new Date(tx.created_at);
        let dayIndex = txDate.getDay() - 1; // Adjust so Monday is index 0
        if (dayIndex === -1) dayIndex = 6; // Sunday fix
        
        daysOfWeekMap[dayIndex] += amt;
      }
    });

    setTotalIncome(incomeSum);
    setTotalExpenses(expenseSum);
    setWeeklyData(daysOfWeekMap);

    // Process Category Breakdown Percentages
    const processedCats: CategoryTotal[] = Object.keys(categoriesMap).map((key) => {
      const catAmt = categoriesMap[key];
      return {
        name: key,
        amount: catAmt,
        percentage: expenseSum > 0 ? Math.round((catAmt / expenseSum) * 100) : 0,
      };
    }).sort((a, b) => b.amount - a.amount);

    setCategoryTotals(processedCats);

    if (processedCats.length > 0) {
      setHighestCategory({ name: processedCats[0].name, amount: processedCats[0].amount });
    } else {
      setHighestCategory({ name: "None", amount: 0 });
    }
  };

  const formatCurrency = (val: number) => {
    return "₦" + val.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Find max value in weekly layout array to maintain accurate CSS bar scaling
  const maxWeeklyExpense = Math.max(...weeklyData, 1000);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-500 font-medium animate-pulse">Analyzing transaction clusters...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 box-border">
      
      {/* Dynamic Insight Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a3a] tracking-tight">
          Financial Diagnostics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Deep data analysis mapping your systemic cash outflow and structural spending behavior.
        </p>
      </div>

      {/* Advanced Analytic Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Savings Velocity Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Savings Velocity</span>
              <h2 className="text-2xl font-bold text-[#0d4d4d] mt-1">
                {formatCurrency(totalIncome - totalExpenses)}
              </h2>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl">
              <Zap size={18} className="text-[#0d4d4d]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 border-t border-slate-50 pt-3">
            Net capital added to your cash reserves over this statement cycle.
          </p>
        </div>

        {/* Highest Risk Expense Node */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Cost Center</span>
              <h2 className="text-2xl font-bold text-orange-600 mt-1 truncate max-w-45">
                {highestCategory.name}
              </h2>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <ShoppingBag size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 border-t border-slate-50 pt-3">
            Consumed <strong className="text-slate-700 font-semibold">{formatCurrency(highestCategory.amount)}</strong> of your liquidity pool.
          </p>
        </div>

        {/* Liquidity Burn Rate */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Liquidity Burn Rate</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}%
              </h2>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ArrowLeftRight size={18} className="text-slate-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 border-t border-slate-50 pt-3">
            Percentage of total revenue fully exhausted by operations.
          </p>
        </div>

      </div>

      {/* Main Structural Insight Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Weekly Velocity Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-[#1e3a3a]">Weekly Outflow Volatility</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracks cumulative spending spikes across each day.</p>
          </div>

          <div className="h-64 flex items-end gap-3 px-2 pt-8 relative">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const dayValue = weeklyData[i] || 0;
              const calculatedHeight = `${Math.max((dayValue / maxWeeklyExpense) * 100, 4)}%`;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded pointer-events-none absolute bottom-full mb-2 z-10 whitespace-nowrap shadow-md font-mono">
                    {formatCurrency(dayValue)}
                  </span>
                  
                  {/* Active Bar Component */}
                  <div 
                    style={{ height: calculatedHeight }} 
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      dayValue === maxWeeklyExpense && dayValue > 0 
                        ? "bg-orange-500" 
                        : "bg-[#0d4d4d] hover:bg-teal-700"
                    }`}
                  />
                  
                  <span className="text-xs font-semibold text-slate-400 mt-1">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Category Distribution Engine */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1e3a3a]">Structural Outflow</h3>
              <p className="text-xs text-slate-400 mt-0.5">Budget category distribution analytics.</p>
            </div>
            <PieChart size={16} className="text-slate-400" />
          </div>

          {categoryTotals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle size={24} className="text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 max-w-55">Log expense entries to unlock distribution insight pipelines.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {categoryTotals.slice(0, 5).map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-semibold truncate max-w-40">{cat.name}</span>
                    <span className="text-slate-500 font-mono">
                      {formatCurrency(cat.amount)} <span className="text-slate-400 text-[10px]">({cat.percentage}%)</span>
                    </span>
                  </div>
                  
                  {/* Progress Bar Track */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0d4d4d] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}