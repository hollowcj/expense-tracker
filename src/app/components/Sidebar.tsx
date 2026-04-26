"use client";
import React from 'react';
import { LayoutGrid, History, BarChart3, FileText, Wallet, Settings, ChartBarIncreasing, DollarSign, Cog } from 'lucide-react';

const Sidebar = () => {
    const [activePage, setActivePage] = React.useState("Dashboard")
    return (
        <aside style={{width:'300px', height: '100vh' , backgroundColor:'#ffffff', borderRight: '1px solid #f0f0f0', paddingLeft: '0px' , paddingRight: '20px'}}>
            <h1 style={{color: '#0D4D4D', fontSize: '24px', fontWeight:'bold', padding:'24px'}}>Fundly</h1>

            <div style={{ display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', paddingBottom: '10px', paddingRight: '10px' , paddingLeft: '20px', borderRadius:'12px', backgroundColor: '#E8F5F3', cursor:'pointer', marginBottom:'15px'}} 
                onClick={
                    () => setActivePage("Dashboard")
                    } 
                    style={
                        { display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', 
                        paddingBottom: '10px', paddingRight: '10px', paddingLeft: '20px', borderRadius:'12px', 
                        backgroundColor: activePage === "Dashboard" ? '#E8F5F3': 'transparent', 
                        cursor:'pointer', marginBottom:'15px'}}>

                <LayoutGrid size={20} color={activePage === "Dashboard" ? '#0d4d4d': '#9ca3af'} strokeWidth={2.5} />
                <p style={{color: activePage === "Dashboard" ? '#0d4d4d' : '#9ca3af', fontWeight:'600', fontSize:'15px'}}>Dashboard</p>

            </div>

            <div style={
                { display: 'flex', alignItems:'center', gap: '2px', 
                paddingTop: '10px', paddingBottom: '10px', 
                paddingRight: '10px' , paddingLeft: '20px', 
                borderRadius:'12px', cursor:'pointer', marginBottom:'15px'}
                } onClick={
                    () => setActivePage("History")
                    } 
                    style={
                        { display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', 
                        paddingBottom: '10px', paddingRight: '10px', paddingLeft: '20px', borderRadius:'12px', 
                        backgroundColor: activePage === "History" ? '#E8F5F3': 'transparent', 
                        cursor:'pointer', marginBottom:'15px'}}>

                <History size={20} color={activePage === "History" ? '#0d4d4d': '#9ca3af'} strokeWidth={2.5} />
                <p style={{color: activePage === "History" ? '#0d4d4d': '#9ca3af', fontWeight:'600', fontSize:'15px'}}>History</p>
            </div>


            <div style={
                {display: 'flex', alignItems:'center', 
                gap: '2px', paddingTop: '10px', 
                paddingBottom: '10px', paddingRight: '10px', 
                paddingLeft: '20px', borderRadius:'12px',
                cursor:'pointer', marginBottom:'15px'}
                } onClick={
                    () => setActivePage("Insights")
                    } 
                    style={
                        { display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', 
                        paddingBottom: '10px', paddingRight: '10px', paddingLeft: '20px', borderRadius:'12px', 
                        backgroundColor: activePage === "Insights" ? '#E8F5F3': 'transparent', 
                        cursor:'pointer', marginBottom:'15px'}}>
                <ChartBarIncreasing size={20} color={activePage === "Insights" ? '#0d4d4d': '#9ca3af'} strokeWidth={2.5}/>
                <p style={{color: activePage === "Insights" ? '#0d4d4d': '#9ca3af', fontWeight:'600', fontSize:'15px'}}>Insights</p>
            </div>

            
            <div style={
                { display: 'flex', alignItems:'center', 
                gap: '2px', paddingTop: '10px', 
                paddingBottom: '10px', paddingRight: '10px' , 
                paddingLeft: '20px', borderRadius:'12px', 
                cursor:'pointer', marginBottom:'15px'}
                }onClick={
                    () => setActivePage("Transactions")
                    } 
                    style={
                        { display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', 
                        paddingBottom: '10px', paddingRight: '10px', paddingLeft: '20px', borderRadius:'12px', 
                        backgroundColor: activePage === "Transactions" ? '#E8F5F3': 'transparent', 
                        cursor:'pointer', marginBottom:'15px'}}>
                <DollarSign size={20} color={activePage === "Transactions" ? '#0d4d4d': '#9ca3af'} strokeWidth={2.5} />
                <p style={{color: activePage === "Transactions" ? '#0d4d4d': '#9ca3af', fontWeight:'600', fontSize:'15px'}}>Transactions</p>
            </div>

            
            <div style={
                { display: 'flex', alignItems:'center', 
                gap: '2px', paddingTop: '10px', 
                paddingBottom: '10px', paddingRight: '10px' , 
                paddingLeft: '20px', borderRadius:'12px', 
                cursor:'pointer', marginBottom:'15px'}
                }onClick={
                    () => setActivePage("Wallet")
                    } 
                    style={
                        { display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', 
                        paddingBottom: '10px', paddingRight: '10px', paddingLeft: '20px', borderRadius:'12px', 
                        backgroundColor: activePage === "Wallet" ? '#E8F5F3': 'transparent', 
                        cursor:'pointer', marginBottom:'15px'}}>
                <Wallet size={20} color={activePage === "Wallet" ? '#0d4d4d': '#9ca3af'} strokeWidth={2.5} />
                <p style={{color: activePage === "Wallet" ? '#0d4d4d': '#9ca3af', fontWeight:'600', fontSize:'15px'}}>Wallet</p>
            </div>

             <div style={{ display: 'flex', alignItems:'center', 
                gap: '2px', paddingTop: '10px', 
                paddingBottom: '10px', paddingRight: '10px' , 
                paddingLeft: '20px', borderRadius:'12px', 
                cursor:'pointer', marginBottom:'15px'}
                }onClick={
                    () => setActivePage("Settings")
                    } 
                    style={
                        { display: 'flex', alignItems:'center', gap: '2px', paddingTop: '10px', 
                        paddingBottom: '10px', paddingRight: '10px', paddingLeft: '20px', borderRadius:'12px', 
                        backgroundColor: activePage === "Settings" ? '#E8F5F3': 'transparent', 
                        cursor:'pointer', marginBottom:'15px'}}>
                <Cog color={activePage === "Settings" ? '#0d4d4d': '#9ca3af'} strokeWidth={2.5} />
                <p style={{color: activePage === "Settings" ? '#0d4d4d': '#9ca3af', fontWeight:'600', fontSize:'15px'}}>Settings</p>
            </div>
        </aside>
    );
};

export default Sidebar;