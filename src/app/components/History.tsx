"use client"
import React from "react";
// Added Calendar to your imports for the filter section!
import { Download, Plus, Calendar, ChevronDown } from 'lucide-react';

const ExpenseHistory = () => {
  return (
    
    <div style={{ width: '100%', maxWidth: '1200px', padding: '0px 24px 24px 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px', 
        width: '100%'
      }}>
        
        
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e3a3a', 
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Expense History
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b', 
            margin: '4px 0 0 0'
          }}>
            Analyze and manage your transaction records with precision.
          </p>
        </div>

        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',            
            backgroundColor: '#ffffff',
            color: '#374151', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            padding: '8px 16px', // Balanced the padding a bit for better look
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            <Download size={14} strokeWidth={2.5} color="#374151" />
            Export CSV
          </button>

        
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',            
            backgroundColor: '#0D4D4D', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '8px',
            padding: '8px 16px', 
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            <Plus size={14} strokeWidth={2.5} color="#ffffff" />
            Add Transaction
          </button>
        </div>

      </div> 


      
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',          
        padding: '16px 20px',          
        display: 'flex', 
        gap: '12px',                   
        alignItems: 'flex-end',        
        width: '100%',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.04)', 
        marginBottom: '32px',    
        boxSizing: 'border-box'      
      }}>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            color: '#9ca3af', 
            letterSpacing: '0.5px',
            margin: 0,
            padding: 0,
            textAlign: 'left'
          }}>
            DATE RANGE
          </span>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 10px',
            cursor: 'pointer',
            height: '40px',
            boxSizing: 'border-box'
          }}>
            <Calendar size={14} color="#9ca3af" />
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap' }}>Last 30 days</span>
          </div>
        </div>
        
       
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: 0, padding: 0 }}>
            CATEGORY
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',         
            padding: '8px 10px',         
            cursor: 'pointer',
            height: '40px',              
            boxSizing: 'border-box'      
          }}>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              All Categories
            </span>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </div>

        
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: 0, padding: 0 }}>
            AMOUNT RANGE
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',         
            padding: '8px 10px',         
            cursor: 'pointer',
            height: '40px',              
            boxSizing: 'border-box'      
          }}>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap' }}>
              Any Amount
            </span>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </div>

        
    
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 0%', minWidth: 0, alignItems: 'stretch' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', margin: 0, padding: 0 }}>
            STATUS
          </span>
          
          <div style={{
            display: 'flex',
            gap: '6px',
            height: '40px',
            boxSizing: 'border-box'
          }}>
            
            <button style={{
              flex: 1,
              backgroundColor: '#E6F4F4', 
              color: '#0D4D4D',           
              border: '1px solid #B2DDDD', 
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              All
            </button>

            
            <button style={{
              flex: 1,
              backgroundColor: '#ffffff',
              color: '#64748b',           
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              Pending
            </button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ExpenseHistory;