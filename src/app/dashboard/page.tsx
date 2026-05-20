"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
    const [firstName, setFirstName] = useState<string>("user");

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
                <p style={{color:'white', fontWeight:'bold', fontSize:'16px', margin:'0'}}>L</p>
            </div>
            </div>
        </div>

        {/* 3 Cards Row */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', marginTop:'30px'}}>
                <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                    <p style={{fontSize:'12px', fontWeight:'700', color:'#0d4d4d'}}>BUDGET LIMIT</p>
                        <div>
                            <p style={{fontSize:'11px', color:'#0d4d4d', marginTop:'8px'}}>75% of monthly limit used</p>
                            <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px', marginTop:'3px'}}>
                                <div style={{backgroundColor:'#0d4d4d', borderRadius:'999px', height:'8px', width:'55%'}}></div>
                            </div>
                        </div>

                        <div>
                            <p style={{fontSize:'11px', color:'#0d4d4d', marginTop:'8px'}}>75% of monthly limit used</p>
                            <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px', marginTop:'2px'}}>
                                <div style={{backgroundColor:'#0d4d4d', borderRadius:'999px', height:'8px', width:'55%'}}></div>
                            </div>
                        </div>
                
                        <div>
                            <p style={{fontSize:'11px', color:'#0d4d4d', marginTop:'8px'}}>75% of monthly limit used</p>
                            <div style={{backgroundColor:'#a8cec1', borderRadius:'999px', height:'8px', marginTop:'2px'}}>
                                <div style={{backgroundColor:'#0d4d4d', borderRadius:'999px', height:'8px', width:'55%'}}></div>
                            </div>
                        </div>
                
            </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                <p style={{fontSize:'12px', fontWeight:'700', color:'#0d4d4d'}}>MONTHLY INCOME</p>
                <p style={{fontSize:'28px', fontWeight:'bold', color:'#111827', marginTop:'8px'}}>$8,200.00</p>
                <p style={{fontSize:'12px', color:'#9ca3af', marginTop:'4px'}}>On track</p>
                </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                <p style={{fontSize:'12px', fontWeight:'700', color:'#0d4d4d'}}>MONTHLY EXPENSES</p>
                <p style={{fontSize:'28px', fontWeight:'bold', color:'#111827', marginTop:'8px'}}>$4,120.45</p>
                <p style={{fontSize:'12px', color:'#red', marginTop:'4px'}}>12% higher than usual</p>
            </div>
        </div>

        {/* Spending Trends Card */}
        <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', marginTop:'20px', minHeight:'300px'}}>
            <p style={{fontSize:'15px', fontWeight:'700', color:'#0d4d4d'}}>SPENDING TRENDS</p>
        </div>

    </div>
);
};

export default Dashboard;