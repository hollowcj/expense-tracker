"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Pointer, View } from 'lucide-react';

const Dashboard = () => {
    const [firstName, setFirstName] = useState<string>("user");
    const [view, setView] = useState<string>("monthly");

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error) throw error;

                if (user?.user_metadata?.first_name) {
                    setFirstName(user.user_metadata.first_name);
                }
            } catch (err: any) {
                console.error("Error fetching user metadata:", err.message);
            }
        };

        fetchUserData();
    }, []);


    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const spendingData = [
    { month: 'Jan', amount: 130200 },
    { month: 'Feb', amount: 141000 },
    { month: 'Mar', amount: 128000 },
    { month: 'Apr', amount: 152000 },
    { month: 'May', amount: 130800 },
    { month: 'Jun', amount: 143000 },
];

const weeklyData = [
    { day: 'Mon', amount: 2220 },
    { day: 'Tue', amount: 4050 },
    { day: 'Wed', amount: 5800 },
    { day: 'Thu', amount: 8000 },
    { day: 'Fri', amount: 6000 },
    { day: 'Sat', amount: 3450},
    { day: 'Sun', amount: 2500},
];

    return (
    <div style={{paddingTop:'30px', paddingLeft:'32px', paddingRight:'50px'}}>
        
        {/* Welcome Row */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
                <h1 style={{fontSize:'28px', fontWeight:'bold', color:'#111827'}}>
                    Welcome back, {firstName}
                </h1>
                <p style={{fontSize:'13px', color:'#9ca3af', marginTop:'3px'}}>
                    Here is your overview for {currentMonth}
                </p>
            </div>
            <div style={{marginBottom:'30px'}}>
            <div style={{width:'44px', height:'44px', borderRadius:'50%', backgroundColor:'#0d4d4d', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                <p style={{color:'#E8F5F3', fontWeight:'bold', fontSize:'16px', margin:'0'}}>L</p>
            </div>
            </div>
        </div>

        {/* 3 Cards Row */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginTop:'30px'}}>
                <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                    <p style={{fontSize:'13px', fontWeight:'700', color:'#0d4d4d'}}>BUDGET USAGE</p>

                        <div>
                            <p style={{fontSize:'11px', color:'#0d4d4d', marginTop:'8px'}}>Food</p>
                            <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px', marginTop:'3px'}}>
                                <div style={{backgroundColor:'#0d4d4d', borderRadius:'999px', height:'8px', width:'50%'}}></div>
                            </div>
                        </div>

                        <div>
                            <p style={{fontSize:'11px', color:'#0d4d4d', marginTop:'8px'}}>Personal Shopping</p>
                            <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px', marginTop:'2px'}}>
                                <div style={{backgroundColor:'#0d4d4d', borderRadius:'999px', height:'8px', width:'20%'}}></div>
                            </div>
                        </div>
                
                        <div>
                            <p style={{fontSize:'11px', color:'#0d4d4d', marginTop:'8px'}}>Provisions</p>
                            <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px', marginTop:'2px'}}>
                                <div style={{backgroundColor:'#0d4d4d', borderRadius:'999px', height:'8px', width:'30%'}}></div>
                            </div>
                        </div>
                
            </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                <p style={{fontSize:'13px', fontWeight:'700', color:'#0d4d4d'}}>MONTHLY INCOME</p>
                <p style={{fontSize:'28px', fontWeight:'bold', color:'#111827', marginTop:'8px'}}>₦148,200.00</p>
                <p style={{fontSize:'12px', color:'#9ca3af', marginTop:'4px'}}>On track</p>
                </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                <p style={{fontSize:'13px', fontWeight:'700', color:'#0d4d4d'}}>MONTHLY EXPENSES</p>
                <p style={{fontSize:'28px', fontWeight:'bold', color:'#111827', marginTop:'8px'}}>₦134,120.45</p>
                <p style={{fontSize:'12px', color:'#9ca3af', marginTop:'4px'}}>12% higher than usual</p>
            </div>
        </div>

        {/* Spending Trends Card */}
        <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', marginTop:'30px', minHeight:'300px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                <p style={{fontSize:'13px', fontWeight:'700', color:'#0d4d4d'}}>SPENDING TRENDS</p>
                    <div style={{display:'flex', gap:'8px', marginRight:'30px'}}>
                        <button onClick={() => setView("weekly")} style={{padding:'6px 12px', borderRadius:'8px', fontSize:'12px', border:'1px solid #0d4d4d', cursor:'pointer', backgroundColor: view === "weekly" ? '#0d4d4d' : 'transparent', color: view === "weekly" ? 'white' : '#0d4d4d'}}>
                            Weekly
                        </button>

                        <button onClick={() => setView("monthly")} style={{padding:'6px 12px', borderRadius:'8px', fontSize:'12px', border:'1px solid #0d4d4d', cursor:'pointer', backgroundColor: view === "monthly" ? '#0d4d4d' : 'transparent', color: view === "monthly" ? 'white' : '#0d4d4d'}}>
                            Monthly
                        </button>
                    </div>
                </div>
                <div style={{marginTop:'30px', marginRight:'30px'}}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data ={view === "monthly" ? spendingData : weeklyData}>
                                <XAxis dataKey={view === "monthly" ? "month" : "day"} />
                                <YAxis />
                                <Bar dataKey="amount" fill="#0d4d4d" radius={[6,6,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                </div>     
            </div>    
        </div>
);
};

export default Dashboard;