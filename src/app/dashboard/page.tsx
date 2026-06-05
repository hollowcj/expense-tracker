"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, PencilIcon, Bell, Plus, AlertCircle } from 'lucide-react';

interface Transaction {
    id: string;
    title: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
    created_at: string;
}

interface Category {
    id: string;
    user_id: string;
    name: string;
    color?: string;
    icon?: string;
}

interface ChartDataPoint {
    name: string;
    amount: number;
    [key: string]: any; 
}

const Dashboard = () => {
    // Auth & Metadata State
    const [userId, setUserId] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string>("User"); 
    const [view, setView] = useState<string>("monthly");

    // Dynamic Financial Balances
    const [baseMonthlyIncome, setBaseMonthlyIncome] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [totalExtraIncome, setTotalExtraIncome] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

    // Custom Categories Fetch State
    const [userCategories, setUserCategories] = useState<Category[]>([]);

    // Form Modals / UI States
    const [isEditingIncome, setIsEditingIncome] = useState<boolean>(false);
    const [newIncomeVal, setNewIncomeVal] = useState<string>("");
    
    const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
    const [expenseTitle, setExpenseTitle] = useState<string>("");
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    const [expenseAmount, setExpenseAmount] = useState<string>("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;

                if (user) {
                    setUserId(user.id);
                    if (user.user_metadata?.first_name) {
                        setFirstName(user.user_metadata.first_name);
                    }

                    // 1. Fetch Monthly Income configuration from profiles
const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('monthly_income, monthly_budget') // Add monthly_budget here
    .eq('id', user.id)
    .single();

if (!profileError && profileData) {
    setBaseMonthlyIncome(profileData.monthly_income || 0);
    // Add a state for monthlyBudget to store this value
    setMonthlyBudget(profileData.monthly_budget || 0); 
}

                    // 2. Fetch User-Specific Custom Categories
                    const { data: catData, error: catError } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('name', { ascending: true });

                    if (!catError && catData) {
                        setUserCategories(catData);
                        if (catData.length > 0) {
                            setExpenseCategory(catData[0].name);
                        }
                    }

                    // 3. Fetch User Transactions
                    const { data: transData, error: transError } = await supabase
                        .from('transactions')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (!transError && transData) {
                        setTransactions(transData);
                        
                        // Compile dynamic expenses streams
                        const calculatedExpenses = transData
                            .filter((t: Transaction) => t.type === 'expense')
                            .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
                        setTotalExpenses(calculatedExpenses);

                        // Compile dynamic extra income stream logs
                        const calculatedExtraIncome = transData
                            .filter((t: Transaction) => t.type === 'income')
                            .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
                        setTotalExtraIncome(calculatedExtraIncome);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching live dashboard metrics:", err.message);
            }
        };

        fetchDashboardData();
    }, []);

    const handleUpdateIncome = async () => {
        if (!userId) return;
        const numValue = parseFloat(newIncomeVal) || 0;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ monthly_income: numValue })
                .eq('id', userId);

            if (error) throw error;
            setBaseMonthlyIncome(numValue);
            setIsEditingIncome(false);
        } catch (err: any) {
            alert("Failed to update income configuration: " + err.message);
        }
    };

    const handleAddExpense = async () => {
        if (!userId || !expenseTitle || !expenseAmount || !expenseCategory) {
            alert("Please provide a title, amount, and pick a structured spending category.");
            return;
        }
        const numAmount = parseFloat(expenseAmount) || 0;

        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert([{
                    user_id: userId,
                    title: expenseTitle,
                    category: expenseCategory,
                    type: 'expense',
                    amount: numAmount
                }])
                .select()
                .single();

            if (error) throw error;

            const updatedList = [data, ...transactions];
            setTransactions(updatedList);
            setTotalExpenses(prev => prev + numAmount);
            
            setExpenseTitle("");
            setExpenseAmount("");
            if (userCategories.length > 0) {
                setExpenseCategory(userCategories[0].name);
            }
            setIsAddingExpense(false);
        } catch (err: any) {
            alert("Error creating ledger mutation: " + err.message);
        }
    };

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    // Balanced aggregate calculations
    const displayTotalIncome = baseMonthlyIncome + totalExtraIncome;
    const dynamicNetBalance = displayTotalIncome - totalExpenses;
    
    // Budget Exceeded Logic
    const isExceeded = monthlyBudget > 0 ? totalExpenses > monthlyBudget : false;
const usagePercentage = monthlyBudget > 0 ? Math.min((totalExpenses / monthlyBudget) * 100, 100) : 0;

    // --- DYNAMIC CHART GENERATION FROM LIVE STATE ---
    const getMonthlyChartData = (): ChartDataPoint[] => {
        const monthsKey = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const result: ChartDataPoint[] = []; 
        const d = new Date();
        for (let i = 5; i >= 0; i--) {
            const targetMonth = new Date(d.getFullYear(), d.getMonth() - i, 1);
            result.push({
                name: monthsKey[targetMonth.getMonth()],
                monthNum: targetMonth.getMonth(),
                year: targetMonth.getFullYear(),
                amount: 0
            });
        }

        transactions.forEach(t => {
            if (t.type === 'expense') {
                const tDate = new Date(t.created_at);
                const match = result.find(r => r.monthNum === tDate.getMonth() && r.year === tDate.getFullYear());
                if (match) {
                    match.amount += Number(t.amount);
                }
            }
        });
        return result;
    }

    const getWeeklyChartData = (): ChartDataPoint[] => {
        const weeklyBuckets: ChartDataPoint[] = [
            { name: 'Mon', dayIndex: 1, amount: 0 },
            { name: 'Tue', dayIndex: 2, amount: 0 },
            { name: 'Wed', dayIndex: 3, amount: 0 },
            { name: 'Thu', dayIndex: 4, amount: 0 },
            { name: 'Fri', dayIndex: 5, amount: 0 },
            { name: 'Sat', dayIndex: 6, amount: 0 },
            { name: 'Sun', dayIndex: 0, amount: 0 },
        ];

        const now = new Date();
        const currentDayIndex = now.getDay(); 
        const distanceToMonday = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
        startOfWeek.setHours(0,0,0,0);

        transactions.forEach(t => {
            if (t.type === 'expense') {
                const tDate = new Date(t.created_at);
                if (tDate >= startOfWeek) {
                    const dayIdx = tDate.getDay();
                    const bucket = weeklyBuckets.find(b => b.dayIndex === dayIdx);
                    if (bucket) {
                        bucket.amount += Number(t.amount);
                    }
                }
            }
        });
        return weeklyBuckets;
    };

    const activeChartData: ChartDataPoint[] = view === "monthly" ? getMonthlyChartData() : getWeeklyChartData();

    const formatCurrency = (val: number) => {
        return "₦" + val.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const userInitial = firstName ? firstName.charAt(0).toUpperCase() : "U";

    return (
        <div style={{paddingTop:'84px', paddingBottom:'40px', paddingLeft:'4%', paddingRight:'4%', position:'relative', maxWidth:'1400px', margin:'0 auto'}}>
             
             {/* Settings Control Drawer overlay */}
             {(isEditingIncome || isAddingExpense) && (
                 <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.4)', zIndex:99, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
                     <div style={{backgroundColor:'#fff', padding:'24px', borderRadius:'12px', width:'100%', maxWidth:'360px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
                         {isEditingIncome ? (
                             <>
                                 <h3 style={{color:'#0d4d4d', margin:'0 0 15px 0'}}>Set Monthly Income</h3>
                                 <input type="number" value={newIncomeVal} onChange={(e) => setNewIncomeVal(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #ccc', marginBottom:'15px', boxSizing:'border-box'}} />
                                 <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                                     <button onClick={() => setIsEditingIncome(false)} style={{padding:'8px 16px', borderRadius:'6px', border:'1px solid #ccc', cursor:'pointer', backgroundColor:'transparent'}}>Cancel</button>
                                     <button onClick={handleUpdateIncome} style={{padding:'8px 16px', borderRadius:'6px', backgroundColor:'#0d4d4d', color:'#fff', border:'none', cursor:'pointer'}}>Save</button>
                                 </div>
                             </>
                         ) : (
                             <>
                                 <h3 style={{color:'#0d4d4d', margin:'0 0 15px 0'}}>Add New Expense Entry</h3>
                                 <input type="text" placeholder="Title (e.g. Groceries)" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #ccc', marginBottom:'10px', boxSizing:'border-box'}} />
                                 
                                 <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #ccc', marginBottom:'10px', boxSizing:'border-box', backgroundColor:'#fff'}}>
                                     {userCategories.length === 0 ? (
                                         <option value="" disabled>No categories found. Build one in settings!</option>
                                     ) : (
                                         userCategories.map((cat) => (
                                             <option key={cat.id} value={cat.name}>
                                                 {cat.name}
                                             </option>
                                         ))
                                     )}
                                 </select>

                                 <input type="number" placeholder="Amount (₦)" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'6px', border:'1px solid #ccc', marginBottom:'15px', boxSizing:'border-box'}} />
                                 <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                                     <button onClick={() => setIsAddingExpense(false)} style={{padding:'8px 16px', borderRadius:'6px', border:'1px solid #ccc', cursor:'pointer', backgroundColor:'transparent'}}>Cancel</button>
                                     <button onClick={handleAddExpense} disabled={userCategories.length === 0} style={{padding:'8px 16px', borderRadius:'6px', backgroundColor: userCategories.length === 0 ? '#cccccc' : '#0d4d4d', color:'#fff', border:'none', cursor:'pointer'}}>Add</button>
                                 </div>
                             </>
                         )}
                     </div>
                 </div>
             )}

             {/* Main App Toolbar Bar */}
             <div style={{backgroundColor:'#E8F5F3', height:'60px', borderRadius:'100px', display:'flex', gap:'8px', alignItems:'center', paddingLeft:'20px', paddingRight:'12px', justifyContent:'flex-end', position: 'absolute', top: '12px', left: '4%', right: '4%'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                    <Bell size={17} color='#0d4d4d'/>
                </div>
                <div onClick={() => setIsEditingIncome(true)} style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                    <PencilIcon size={17} color='#0d4d4d'/>
                </div>
                <div style={{width:'44px', height:'44px', borderRadius:'50%', backgroundColor:'#0d4d4d', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                    <p style={{color:'#E8F5F3', fontWeight:'bold', fontSize:'16px', margin:'0'}}>{userInitial}</p>
                </div>
            </div>
        
        {/* Welcome Row */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'20px', marginTop:'20px'}}>
            <div style={{flex:'1 1 280px'}}>
                <h1 style={{fontSize:'calc(20px + 0.6vw)', fontWeight:'bold', color:'#111827', margin: 0, lineHeight: 1.2}}>
                    Welcome back, {firstName}
                </h1>
                <p style={{fontSize:'13px', color:'#9ca3af', marginTop:'5px', marginBottom: 0}}>
                    Here is your overview for {currentMonth}
                </p>
            </div>
            
            <button 
                onClick={() => setIsAddingExpense(true)} 
                style={{
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    gap:'8px', 
                    padding:'14px 24px', 
                    backgroundColor:'#0d4d4d', 
                    color:'#fff', 
                    border:'none', 
                    borderRadius:'12px', 
                    fontSize:'15px', 
                    cursor:'pointer', 
                    fontWeight:'bold',
                    width: 'auto',
                    minWidth: '170px',
                    boxShadow: '0 4px 14px rgba(13, 77, 77, 0.25)',
                    transition: 'transform 0.1s ease'
                }}
            >
                <Plus size={18} strokeWidth={2.5}/> Log New Expense
            </button>
        </div>

        {/* 4 Cards Grid Metrics Section */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'20px', marginTop:'30px'}}>
            <div style={{padding:'24px', backgroundColor:'#0d4d4d', borderRadius:'15px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'140px'}}>
                <p style={{fontSize:'16px', fontWeight:'500', color:'#E8F5F3', margin:0}}>Net Balance</p>
                <p style={{fontSize:'26px', fontWeight:'bolder', color:'#E8F5F3', marginTop:'24px', marginBottom:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{formatCurrency(dynamicNetBalance)}</p>
                <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', border:'1.5px solid #E8F5F3', borderRadius:'800px', padding:'3px 10px'}}>
                        <p style={{fontSize:'11px', color:'#E8F5F3', margin:'0'}}>Calculated</p>
                        <TrendingUp size={14} color='#E8F5F3'/> 
                    </div>
                </div>
            </div>
            
            {/* UPDATED BUDGET USAGE CARD */}
            <div style={{padding:'24px', backgroundColor: isExceeded ? '#ffebee' : '#E8F5F3', borderRadius:'15px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'140px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <p style={{fontSize:'16px', fontWeight:'500', color: isExceeded ? '#c62828' : '#0d4d4d', margin:0}}>Budget Usage</p>
                    {isExceeded && <AlertCircle size={18} color="#c62828" />}
                </div>
                <div style={{marginTop:'24px'}}>
                    <p style={{fontSize:'11px', color: isExceeded ? '#c62828' : '#0d4d4d', marginTop:'0', marginBottom:'6px', fontWeight: isExceeded ? 'bold' : 'normal'}}>
                        {isExceeded ? "Budget Exceeded!" : "Live Tracked Expenses"}
                    </p>
                    <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px'}}>
                        <div style={{backgroundColor: isExceeded ? '#c62828' : '#0d4d4d', borderRadius:'999px', height:'8px', width: `${usagePercentage}%`}}></div>
                    </div>
                </div>
            </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'140px'}}>
                <p style={{fontSize:'16px', fontWeight:'500', color: '#0d4d4d', margin:0}}>Total Inflow</p>
                <p style={{fontSize:'26px', fontWeight:'bolder', color:'#0d4d4d', marginTop:'24px', marginBottom:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{formatCurrency(displayTotalIncome)}</p>
                <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                    <div onClick={() => setIsEditingIncome(true)} style={{display:'flex', alignItems:'center', gap:'5px', border:'1.5px solid #0d4d4d', borderRadius:'800px', padding:'3px 10px', cursor:'pointer'}}>
                        <p style={{fontSize:'11px', color:'#0d4d4d', margin:'0'}}>Adjust base</p>
                        <PencilIcon size={11} color='#0d4d4d'/> 
                    </div>
                </div>
            </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:'140px'}}>
                <p style={{fontSize:'16px', fontWeight:'500', color: '#0d4d4d', margin:0}}>Monthly Expenses</p>
                <p style={{fontSize:'26px', fontWeight:'bolder', color:'#0d4d4d', marginTop:'24px', marginBottom:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{formatCurrency(totalExpenses)}</p>
                <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', border:'1.5px solid #0d4d4d', borderRadius:'800px', padding:'3px 10px'}}>
                        <p style={{fontSize:'11px', color:'#0d4d4d', margin:'0'}}>Live compilation</p>
                        <TrendingDown size={14} color='#0d4d4d'/> 
                    </div>
                </div>
            </div>
        </div>

        {/* Spending Trends Graph Section */}
        <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', marginTop:'30px', minHeight:'300px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px', marginBottom:'20px'}}>
                <p style={{fontSize:'17px', fontWeight:'700', color:'#0d4d4d', margin:0}}>Spending Trends</p>
                <div style={{display:'flex', gap:'8px'}}>
                    <button onClick={() => setView("weekly")} style={{padding:'6px 14px', borderRadius:'8px', fontSize:'12px', border:'1px solid #0d4d4d', cursor:'pointer', backgroundColor: view === "weekly" ? '#0d4d4d' : 'transparent', color: view === "weekly" ? 'white' : '#0d4d4d'}}>Weekly</button>
                    <button onClick={() => setView("monthly")} style={{padding:'6px 14px', borderRadius:'8px', fontSize:'12px', border:'1px solid #0d4d4d', cursor:'pointer', backgroundColor: view === "monthly" ? '#0d4d4d' : 'transparent', color: view === "monthly" ? 'white' : '#0d4d4d'}}>Monthly</button>
                </div>
            </div>
            <div style={{marginTop:'20px', width:'100%', height:'250px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeChartData} margin={{ left: -20, right: 10 }}>
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip formatter={(value) => "₦" + Number(value).toLocaleString()} />
                        <Bar dataKey="amount" fill="#0d4d4d" radius={[6,6,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>     
        </div>

        {/* Ledger Feed Section */}
        <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', marginTop:'30px'}}>
            <p style={{fontSize:'17px', fontWeight:'700', color:'#0d4d4d', marginBottom:'20px', marginTop:0}}>Recent transactions</p>
            
            <div style={{width:'100%', overflowX:'auto', WebkitOverflowScrolling:'touch'}}>
                <div style={{minWidth:'600px'}}>
                    <div style={{display:'grid', gridTemplateColumns:'2fr 1.2fr 1.2fr 1.2fr', gap:'15px', paddingBottom:'10px', borderBottom:'1px solid #a8cec1'}}>
                        <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af', margin:0}}>TRANSACTION</p>
                        <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af', margin:0}}>CATEGORY</p>
                        <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af', margin:0}}>DATE</p>
                        <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af', margin:0}}>AMOUNT</p>
                    </div>

                    {transactions.length === 0 ? (
                        <p style={{fontSize:'13px', color:'#9ca3af', textAlign:'center', marginTop:'30px', marginBottom:'10px'}}>No transactions logged yet.</p>
                    ) : (
                        transactions.map((trans) => (
                            <div key={trans.id} style={{display:'grid', gridTemplateColumns:'2fr 1.2fr 1.2fr 1.2fr', gap:'15px', paddingTop:'14px', paddingBottom:'14px', borderBottom:'1px solid #e2f2ef', alignItems:'center'}}>
                                <p style={{fontSize:'13px', color:'#111827', margin:0, fontWeight:'500', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{trans.title}</p>
                                <div style={{margin:0}}>
                                    <span style={{backgroundColor: trans.type === 'income' ? '#1dcc43' : '#cd69ff', color:'#ffffff', borderRadius:'6px', padding:'4px 10px', fontSize:'12px', fontWeight:'6px', display:'inline-block'}}>
                                        {trans.category}
                                    </span>
                                </div>
                                <p style={{fontSize:'13px', color:'#4b5563', margin:0}}>{new Date(trans.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                                <p style={{fontSize:'13px', fontWeight:'bold', color: trans.type === 'income' ? '#1dcc43' : '#e53e3e', margin:0}}>
                                    {trans.type === 'income' ? '+' : '-'}{formatCurrency(trans.amount)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>    
    </div>
    );
};

export default Dashboard;