"use client"
import React from "react";
import { Download, Plus, Calendar, ChevronDown, Cloud, Utensils, Palette, Car, MoreVertical, ArrowUpDown } from 'lucide-react';

const ExpenseHistory = () => {
  
  const transactions = [
    {
      id: 1,
      name: "AWS Cloud Infrastructure",
      description: "Billing cycle June",
      date: "Jun 24, 2024",
      category: "Software",
      amount: "$1,240.00",
      status: "Completed",
      icon: <Cloud size={16} color="#0D4D4D" />,
      iconBg: "#E6F4F4"
    },
    {
      id: 2,
      name: "Client Dinner - Blue Water",
      description: "Account management",
      date: "Jun 22, 2024",
      category: "Travel & Ent.",
      amount: "$342.50",
      status: "Pending",
      icon: <Utensils size={16} color="#b45309" />,
      iconBg: "#fef3c7"
    },
    {
      id: 3,
      name: "Adobe Creative Cloud",
      description: "Monthly subscription",
      date: "Jun 20, 2024",
      category: "Software",
      amount: "$52.99",
      status: "Completed",
      icon: <Palette size={16} color="#0D4D4D" />,
      iconBg: "#E6F4F4"
    },
    {
      id: 4,
      name: "Uber Business",
      description: "Office to Airport",
      date: "Jun 18, 2024",
      category: "Travel",
      amount: "$45.20",
      status: "Completed",
      icon: <Car size={16} color="#0D4D4D" />,
      iconBg: "#E6F4F4"
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '0px 24px 24px 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e3a3a', margin: 0, letterSpacing: '-0.5px' }}>
            Expense History
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            Analyze and manage your transaction records with precision.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <Download size={14} strokeWidth={2.5} color="#374151" />
            Export CSV
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0D4D4D', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
            <Plus size={14} strokeWidth={2.5} color="#ffffff" />
            Add Transaction
          </button>
        </div>
      </div> 

      
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-end', width: '100%', boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.04)', marginBottom: '24px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px', margin: 0, padding: 0, textAlign: 'left' }}>DATE RANGE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', height: '40px', boxSizing: 'border-box' }}>
            <Calendar size={14} color="#9ca3af" />
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap' }}>Last 30 days</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px', margin: 0, padding: 0 }}>CATEGORY</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', height: '40px', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>All Categories</span>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px', margin: 0, padding: 0 }}>AMOUNT RANGE</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', height: '40px', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap' }}>Any Amount</span>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px', margin: 0, padding: 0 }}>STATUS</span>
          <div style={{ display: 'flex', gap: '6px', height: '40px', boxSizing: 'border-box' }}>
            <button style={{ flex: 1, backgroundColor: '#E6F4F4', color: '#0D4D4D', border: '1px solid #B2DDDD', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>All</button>
            <button style={{ flex: 1, backgroundColor: '#ffffff', color: '#64748b', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' }}>Pending</button>
          </div>
        </div>
      </div>

    
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 18px rgba(0, 0, 0, 0.01)', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        
        <div style={{ display: 'flex', width: '100%', padding: '16px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxSizing: 'border-box', alignItems: 'center' }}>
          <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
            TRANSACTION <ArrowUpDown size={12} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
            DATE <ChevronDown size={12} />
          </div>
          <div style={{ flex: 1.5, fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
            CATEGORY
          </div>
          <div style={{ flex: 1.5, fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
            AMOUNT
          </div>
          <div style={{ flex: 1.5, fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>
            STATUS
          </div>
          <div style={{ width: '24px' }}></div>
        </div>

        
        {transactions.map((tx) => (
          <div key={tx.id} style={{ display: 'flex', width: '100%', padding: '16px 24px', borderBottom: '1px solid #f1f5f9', boxSizing: 'border-box', alignItems: 'center', backgroundColor: '#ffffff' }}>
            
            
            <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: tx.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {tx.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{tx.name}</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{tx.description}</span>
              </div>
            </div>

            
            <div style={{ flex: 1.5, fontSize: '14px', color: '#475569', fontWeight: '500' }}>
              {tx.date}
            </div>

          
            <div style={{ flex: 1.5 }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                {tx.category}
              </span>
            </div>

            
            <div style={{ flex: 1.5, fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
              {tx.amount}
            </div>

            
            <div style={{ flex: 1.5, display: 'flex', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: tx.status === "Completed" ? "#0D4D4D" : "#b45309",
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tx.status === "Completed" ? "#14b8a6" : "#f59e0b" }}></span>
                {tx.status}
              </span>
            </div>

            
            <div style={{ width: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <MoreVertical size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
            </div>

          </div>
        ))}

        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
            Showing 1-10 of 142 transactions
          </span>
          
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#94a3b8', borderRadius: '6px', width: '32px', height: '32px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</button>
            <button style={{ border: 'none', backgroundColor: '#0D4D4D', color: '#ffffff', borderRadius: '6px', width: '32px', height: '32px', fontWeight: '600', cursor: 'pointer' }}>1</button>
            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '6px', width: '32px', height: '32px', fontWeight: '500', cursor: 'pointer' }}>2</button>
            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '6px', width: '32px', height: '32px', fontWeight: '500', cursor: 'pointer' }}>3</button>
            <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '6px', width: '32px', height: '32px', fontWeight: '500', cursor: 'pointer' }}>15</button>
            <button style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ExpenseHistory;