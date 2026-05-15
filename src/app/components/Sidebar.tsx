"use client";
import React from 'react';
import { LayoutGrid, History, ChartBarIncreasing, DollarSign, Wallet, Cog } from 'lucide-react';

const Sidebar = () => {
    const [activePage, setActivePage] = React.useState("Dashboard");

    const navItems = [
        { name: "Dashboard", icon: LayoutGrid },
        { name: "History", icon: History },
        { name: "Insights", icon: ChartBarIncreasing },
        { name: "Wallet", icon: Wallet },
        { name: "Settings", icon: Cog },
    ];

    return (
        <aside className="flex flex-col justify-between w-50 h-screen bg-white border-r border-gray-100 pr-7" style={{paddingRight: '60px', alignItems:'center'}}>
            <div>
                <h1 style={{color: '#0D4D4D', fontSize: '24px', fontWeight: 'bold', paddingRight: '30px', paddingTop: '28px', marginBottom: '24px', textAlign: 'center'}}>Fundly</h1>

                <nav className="flex flex-col gap-0.3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.name;

                        return (
                            <div
                                key={item.name}
                                onClick={() => setActivePage(item.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    paddingLeft: '20px',
                                    paddingRight: '10px',
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? '#E8F5F3' : 'transparent',
                                    cursor: 'pointer',
                                    marginBottom: '4px'
                                }}
                            >
                                <Icon 
                                    size={20} 
                                    strokeWidth={2.5} 
                                    color={isActive ? '#0d4d4d' : '#9ca3af'}
                                />
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: isActive ? '#0d4d4d' : '#9ca3af'
                                }}>
                                    {item.name}
                                </span>
                            </div>
                        );
                    })}
                </nav>
            </div>

            <div style={{padding: '16px',margin: '4px', backgroundColor: '#E8F5F3', borderRadius: '15px', width:'100%'}}>
                <p style={{fontSize: '12px', fontWeight: '700', color: '#0d4d4d'}}>BUDGET LIMIT</p>
                <div style={{backgroundColor: '#a8cec1', borderRadius: '999px', height: '6px', marginTop: '8px'}}>
                    <div style={{backgroundColor: '#0d4d4d', borderRadius: '999px', height: '6px', width: '75%'}}></div>
                </div>
                <p style={{fontSize: '11px', color: '#0d4d4d', marginTop: '8px'}}>75% of monthly limit used</p>
            </div>
        </aside>
    );
};

export default Sidebar;