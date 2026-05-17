"use client";
import React from 'react';
// 1. Import the special Next.js hooks
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, History, ChartBarIncreasing, Wallet, DollarSign, Cog } from 'lucide-react';

const Sidebar = () => {
    // 2. Initialize the hooks
    const pathname = usePathname();
    const router = useRouter();

    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingRight: '10px',
        paddingLeft: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
        marginBottom: '15px'
    };

    // 3. Instead of checking a state string, we check if the current browser URL matches the path!
    const getStyle = (path: string) => ({
        ...baseStyle,
        backgroundColor: pathname === path ? '#E8F5F3' : 'transparent'
    });

    const getTextColor = (path: string) =>
        pathname === path ? '#0d4d4d' : '#9ca3af';

    // 4. A tiny helper function to change the URL when a button is clicked
    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <aside style={{ width: '300px', height: '100vh', backgroundColor: '#ffffff', borderRight: '1px solid #f0f0f0', paddingRight: '20px' }}>
            <h1 style={{ color: '#0D4D4D', fontSize: '24px', fontWeight: 'bold', padding: '24px' }}>
                Fundly
            </h1>

            {/* Main Dashboard Link */}
            <div onClick={() => navigateTo("/")} style={getStyle("/")}>
                <LayoutGrid size={20} color={getTextColor("/")} strokeWidth={2.5} />
                <p style={{ color: getTextColor("/"), fontWeight: '600', fontSize: '15px' }}>Dashboard</p>
            </div>

            {/* History Link */}
            <div onClick={() => navigateTo("/history")} style={getStyle("/history")}>
                <History size={20} color={getTextColor("/history")} strokeWidth={2.5} />
                <p style={{ color: getTextColor("/history"), fontWeight: '600', fontSize: '15px' }}>History</p>
            </div>

            {/* Placeholder Links for future pages */}
            <div onClick={() => navigateTo("/insights")} style={getStyle("/insights")}>
                <ChartBarIncreasing size={20} color={getTextColor("/insights")} strokeWidth={2.5} />
                <p style={{ color: getTextColor("/insights"), fontWeight: '600', fontSize: '15px' }}>Insights</p>
            </div>

            <div onClick={() => navigateTo("/transactions")} style={getStyle("/transactions")}>
                <DollarSign size={20} color={getTextColor("/transactions")} strokeWidth={2.5} />
                <p style={{ color: getTextColor("/transactions"), fontWeight: '600', fontSize: '15px' }}>Transactions</p>
            </div>

            <div onClick={() => navigateTo("/wallet")} style={getStyle("/wallet")}>
                <Wallet size={20} color={getTextColor("/wallet")} strokeWidth={2.5} />
                <p style={{ color: getTextColor("/wallet"), fontWeight: '600', fontSize: '15px' }}>Wallet</p>
            </div>

            <div onClick={() => navigateTo("/settings")} style={getStyle("/settings")}>
                <Cog size={20} color={getTextColor("/settings")} strokeWidth={2.5} />
                <p style={{ color: getTextColor("/settings"), fontWeight: '600', fontSize: '15px' }}>Settings</p>
            </div>
        </aside>
    );
};

export default Sidebar;