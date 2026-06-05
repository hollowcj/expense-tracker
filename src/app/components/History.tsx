"use client";

import React, { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import { 
    Download, 
    Plus, 
    Calendar, 
    ChevronDown, 
    DollarSign, 
    ArrowUpDown, 
    MoreVertical,
    X
} from 'lucide-react';

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

const ExpenseHistory = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Sorting State
    const [sortAscending, setSortAscending] = useState<boolean>(false);

    // Filter States
    const [selectedDateRange, setSelectedDateRange] = useState<string>("30");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedAmountRange, setSelectedAmountRange] = useState<string>("all");

    // Modal Form States
    const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
    const [expenseTitle, setExpenseTitle] = useState<string>("");
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    const [expenseAmount, setExpenseAmount] = useState<string>("");
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;

                if (user) {
                    setUserId(user.id);

                    const { data: txData, error: txError } = await supabase
                        .from('transactions')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (txError) throw txError;
                    if (txData) {
                        setTransactions(txData);
                        setFilteredTransactions(txData);
                    }

                    const { data: catData, error: catError } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('name', { ascending: true });
                    
                    if (catError) throw catError;
                    if (catData) {
                        setCategories(catData);
                        if (catData.length > 0) {
                            setExpenseCategory(catData[0].name);
                        }
                    }
                }
            } catch (err: any) {
                console.error("Error retrieving ledger updates:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Filter and Sort Pipeline
    useEffect(() => {
        let updatedList = [...transactions];

        // 1. Date Filter
        if (selectedDateRange !== "all") {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - parseInt(selectedDateRange));
            updatedList = updatedList.filter(tx => new Date(tx.created_at) >= cutoffDate);
        }

        // 2. Category Filter
        if (selectedCategory !== "all") {
            updatedList = updatedList.filter(tx => tx.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // 3. Amount Filter
        if (selectedAmountRange !== "all") {
            if (selectedAmountRange === "under-10k") {
                updatedList = updatedList.filter(tx => tx.amount < 10000);
            } else if (selectedAmountRange === "10k-50k") {
                updatedList = updatedList.filter(tx => tx.amount >= 10000 && tx.amount <= 50000);
            } else if (selectedAmountRange === "over-50k") {
                updatedList = updatedList.filter(tx => tx.amount > 50000);
            }
        }

        // 4. Sort toggle by Amount
        updatedList.sort((a, b) => sortAscending ? a.amount - b.amount : b.amount - a.amount);

        setFilteredTransactions(updatedList);
    }, [selectedDateRange, selectedCategory, selectedAmountRange, transactions, sortAscending]);

    const formatCurrency = (val: number) => {
        return "₦" + val.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleAddExpense = async () => {
        if (!userId || !expenseTitle || !expenseAmount || !expenseCategory) {
            alert("Please fill out all fields before submitting.");
            return;
        }
        const numAmount = parseFloat(expenseAmount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }

        try {
            setFormSubmitting(true);
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

            // Direct local mutation update
            setTransactions(prev => [data, ...prev]);
            
            // UI State Resets
            setExpenseTitle("");
            setExpenseAmount("");
            if (categories.length > 0) {
                setExpenseCategory(categories[0].name);
            }
            setIsAddingExpense(false);
        } catch (err: any) {
            alert("Error creating ledger entry: " + err.message);
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) {
            alert("No structured data matching current filters to export.");
            return;
        }

        const headers = ["Transaction ID", "Title", "Category", "Type", "Amount (NGN)", "Date Created"];
        const csvRows = [
            headers.join(","),
            ...filteredTransactions.map(tx => [
                `"${tx.id}"`,
                `"${tx.title.replace(/"/g, '""')}"`,
                `"${tx.category}"`,
                `"${tx.type}"`,
                tx.amount,
                `"${new Date(tx.created_at).toLocaleDateString('en-NG')}"`
            ].join(","))
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Expense_History_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const selectStyle: React.CSSProperties = {
        width: '100%',
        height: '42px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '0 36px 0 12px',
        fontSize: '14px',
        color: '#374151',
        fontWeight: '500',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none'
    };

    return (
        <div style={{ width: '100%', maxWidth: '1200px', padding: '24px', boxSizing: 'border-box', margin: '0 auto' }}>
            
            {/* Modal Screen Overlay */}
            {isAddingExpense && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', boxSizing: 'border-box', position: 'relative' }}>
                        
                        <button 
                            onClick={() => setIsAddingExpense(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        >
                            <X size={20} />
                        </button>

                        <h3 style={{ color: '#0d4d4d', margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700' }}>Log New Expense</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>Enter the expense details to populate your tracking ledger.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>EXPENSE TITLE</label>
                                <input type="text" placeholder="e.g., Campus Transport" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>SPENDING CATEGORY</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} style={selectStyle}>
                                        {categories.length === 0 ? (
                                            <option value="" disabled>No categories config found</option>
                                        ) : (
                                            categories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>AMOUNT (₦)</label>
                                <input type="number" placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button onClick={() => setIsAddingExpense(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#374151', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleAddExpense} disabled={categories.length === 0 || formSubmitting} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: categories.length === 0 || formSubmitting ? '#cccccc' : '#0D4D4D', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                                {formSubmitting ? "Saving..." : "Add Entry"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1e3a3a', margin: 0, letterSpacing: '-0.5px' }}>
                        Expense History
                    </h1>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
                        Audit your structured spending patterns and log operational metrics.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button 
                        onClick={handleExportCSV}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Download size={15} strokeWidth={2.5} />
                        Export CSV
                    </button>
                    
                    <button 
                        onClick={() => setIsAddingExpense(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0D4D4D', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
                    >
                        <Plus size={15} strokeWidth={2.5} />
                        Log New Expense
                    </button>
                </div>
            </div> 

            {/* Pipeline Controls Container */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%', boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.04)', marginBottom: '24px', boxSizing: 'border-box' }}>
                
                {/* Date Filter Target */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 240px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>DATE RANGE</span>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Calendar size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                        <select 
                            value={selectedDateRange} 
                            onChange={(e) => setSelectedDateRange(e.target.value)}
                            style={{ ...selectStyle, paddingLeft: '36px' }}
                        >
                            <option value="30">Last 30 days</option>
                            <option value="60">Last 60 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="all">All Time</option>
                        </select>
                        <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                    </div>
                </div>
                
                {/* Category Filter Target */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 240px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>CATEGORY</span>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                    </div>
                </div>

                {/* Amount Filter Target */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 240px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>AMOUNT SCALAR RANGE</span>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select 
                            value={selectedAmountRange} 
                            onChange={(e) => setSelectedAmountRange(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="all">Any Amount</option>
                            <option value="under-10k">Under ₦10,000</option>
                            <option value="10k-50k">₦10,000 - ₦50,000</option>
                            <option value="over-50k">Over ₦50,000</option>
                        </select>
                        <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            {/* Core Ledger Content Architecture Container */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 18px rgba(0, 0, 0, 0.01)', width: '100%', boxSizing: 'border-box', overflowX: 'auto' }}>
                <div style={{ minWidth: '800px' }}>
                    
                    {/* Grid Title Row Header */}
                    <div style={{ display: 'flex', width: '100%', padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', boxSizing: 'border-box', alignItems: 'center' }}>
                        <div style={{ flex: '3', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
                            TRANSACTION NAME
                        </div>
                        <div style={{ flex: '1.5', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
                            DATE
                        </div>
                        <div style={{ flex: '1.5', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
                            CATEGORY
                        </div>
                        <div 
                            onClick={() => setSortAscending(prev => !prev)}
                            style={{ flex: '1.5', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px', cursor: 'pointer', userSelect: 'none' }}
                        >
                            AMOUNT <ArrowUpDown size={13} color="#64748b" />
                        </div>
                        <div style={{ flex: '1.5', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
                            LEDGER FLOW TYPE
                        </div>
                        <div style={{ width: '32px' }}></div>
                    </div>

                    {/* Table Render Core Context */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Syncing ledger assets database...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>No transaction logs match your active filters.</p>
                        </div>
                    ) : (
                        filteredTransactions.map((tx) => {
                            const isIncome = tx.type === 'income';
                            return (
                                <div key={tx.id} style={{ display: 'flex', width: '100%', padding: '14px 24px', borderBottom: '1px solid #f1f5f9', boxSizing: 'border-box', alignItems: 'center', backgroundColor: '#ffffff', transition: 'background 0.15s' }}>
                                    
                                    <div style={{ flex: '3', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ 
                                            width: '38px', 
                                            height: '38px', 
                                            borderRadius: '50%', 
                                            backgroundColor: isIncome ? '#e8f5e9' : '#ffebee', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            flexShrink: 0 
                                        }}>
                                         ₦
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{tx.title}</span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {tx.id.substring(0, 8)}</span>
                                        </div>
                                    </div>

                                    <div style={{ flex: '1.5', fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                                        {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>

                                    <div style={{ flex: '1.5' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                                            {tx.category}
                                        </span>
                                    </div>

                                    <div style={{ flex: '1.5', fontSize: '15px', fontWeight: '700', color: isIncome ? '#1dcc43' : '#e53e3e' }}>
                                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </div>

                                    <div style={{ flex: '1.5', display: 'flex', alignItems: 'center' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: isIncome ? "#2e7d32" : "#c62828",
                                            backgroundColor: isIncome ? '#e8f5e9' : '#ffebee',
                                            padding: '4px 8px',
                                            borderRadius: '6px'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isIncome ? "#4caf50" : "#f44336" }}></span>
                                            {tx.type.toUpperCase()}
                                        </span>
                                    </div>

                                    <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#94a3b8' }}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}

                    {/* Pagination Context Indicators Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#ffffff', boxSizing: 'border-box', borderTop: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                            Showing {filteredTransactions.length} of {transactions.length} total records
                        </span>
                        
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#94a3b8', borderRadius: '6px', width: '32px', height: '32px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>&lt;</button>
                            <button style={{ border: 'none', backgroundColor: '#0D4D4D', color: '#ffffff', borderRadius: '6px', width: '32px', height: '32px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>1</button>
                            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#94a3b8', borderRadius: '6px', width: '32px', height: '32px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>&gt;</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ExpenseHistory;