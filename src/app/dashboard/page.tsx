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
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', paddingTop:'30px', paddingLeft:'32px', paddingRight:'50px'}}>
            <div>
                <h1 style={{fontSize:'28px', fontWeight: 'bold', color: '#111827'}}>
                    Welcome back, {firstName}
                </h1>
                <p style={{fontSize: '13px', color: '#9ca3af', marginTop: '3px'}}>
                    Here is your overview for {currentMonth}
                </p>

                 <div style={{ padding: '36px', backgroundColor: '#E8F5F3', borderRadius: '15px', width: '100%', boxSizing: 'border-box', marginTop: '30px'}}>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#0d4d4d', margin: 0 }}>BUDGET LIMIT</p>
                    <div style={{ backgroundColor: '#a8cec1', borderRadius: '999px', height: '6px', marginTop: '8px', marginRight:'30px'}}>
                        <div style={{ backgroundColor: '#0d4d4d', borderRadius: '999px', height: '6px', width: '75%' }}></div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#0d4d4d', marginTop: '8px', margin:'2px'}}>75% of monthly limit used</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;