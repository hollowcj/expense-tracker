"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutGrid, History, ChartBarIncreasing, Wallet, Cog, LogOut, Menu, X } from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
        { name: "History", icon: History, path: "/dashboard/history" },
        { name: "Insights", icon: ChartBarIncreasing, path: "/dashboard/insight" },
        { name: "Wallet", icon: Wallet, path: "/dashboard/wallet" },
        { name: "Settings", icon: Cog, path: "/dashboard/settings" },
    ];

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            router.refresh();
            router.push('/');
        } catch (error: any) {
            console.error("Error signing out:", error.message);
        }
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="md:hidden flex items-center justify-between w-full bg-white border-b border-gray-100 px-6 py-4 fixed top-0 left-0 z-50 h-16">
                <h1 style={{ color: '#0D4D4D', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    Fundly
                </h1>
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 text-gray-500 hover:text-[#0d4d4d] focus:outline-none"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div 
                    onClick={toggleSidebar}
                    className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                />
            )}

            <aside 
                className={`
                    flex flex-col justify-between w-64 h-screen bg-white border-r border-gray-100 px-4 py-6 shrink-0 z-50
                    fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
                    md:relative md:transform-none md:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
                style={{
                    paddingTop: typeof window !== 'undefined' && window.innerWidth < 768 ? '5rem' : '1.5rem'
                }}
            >
                <div className="flex flex-col h-full justify-between pb-4">
                    <div>

                        <h1 className="hidden md:block" style={{ color: '#0D4D4D', fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
                            Fundly
                        </h1>

                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;

                                return (
                                    <Link
                                        href={item.path}
                                        key={item.name}
                                        onClick={() => setIsOpen(false)}
                                        className={`group transition-all duration-200 ${
                                            isActive ? '' : 'hover:bg-[#E8F5F3] hover:scale-[1.02]'
                                        }`}
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
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Icon 
                                            size={20} 
                                            strokeWidth={2.5} 
                                            className={`transition-colors duration-200 ${
                                                isActive ? 'text-[#0d4d4d]' : 'text-gray-400 group-hover:text-[#0d4d4d]'
                                            }`}
                                        />
                                        <span 
                                            className={`transition-colors duration-200 ${
                                                isActive ? 'text-[#0d4d4d]' : 'text-gray-400 group-hover:text-[#0d4d4d]'
                                            }`}
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div
                        onClick={handleSignOut}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            paddingLeft: '20px',
                            paddingRight: '10px',
                            borderRadius: '12px',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                        }}
                        className="group transition-all duration-200 hover:bg-red-50 hover:scale-[1.02] cursor-pointer"
                    >
                        <LogOut 
                            size={20} 
                            strokeWidth={2.5} 
                            className="text-gray-400 transition-colors duration-200 group-hover:text-red-600"
                        />
                        <span 
                            className="text-gray-400 transition-colors duration-200 group-hover:text-red-600"
                            style={{ fontSize: '15px', fontWeight: '500' }}
                        >
                            Log Out
                        </span>
                    </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#E8F5F3', borderRadius: '15px', width: '100%', boxSizing: 'border-box' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#0d4d4d', margin: 0 }}>BUDGET LIMIT</p>
                    <div style={{ backgroundColor: '#a8cec1', borderRadius: '999px', height: '6px', marginTop: '8px' }}>
                        <div style={{ backgroundColor: '#0d4d4d', borderRadius: '999px', height: '6px', width: '75%' }}></div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#0d4d4d', marginTop: '8px', margin: 0 }}>75% of monthly limit used</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;