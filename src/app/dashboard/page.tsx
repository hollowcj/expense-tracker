"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Pointer, View, ArrowUpCircleIcon, TrendingUp, TrendingDown, PencilIcon, Bell} from 'lucide-react';


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
           
        
    <div style={{paddingTop:'84px',paddingBottom:'20px', paddingLeft:'15px', paddingRight:'30px',position:'relative'}}>
         <div style={{backgroundColor:'#E8F5F3',
                        width:'100%',
                        height:'60px',
                        borderRadius:'100px',
                        display:'flex',
                        gap:'4px',
                        alignItems:'center', 
                        paddingRight:'12px', 
                        justifyContent:'flex-end',
                        position: 'absolute',
                        top: '0px',               /* Matches the exact 1.5rem (24px) top padding of Fundly */
                        left: '15px',              /* Matches the dashboard's left boundary */
                        right: '30px',
                        
                        }}>

                <div style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                    <p style={{color:'#E8F5F3', fontWeight:'bold', fontSize:'16px', margin:'0'}}><Bell size={17} color='#0d4d4d'/></p>
                </div>

                <div style={{width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                    <p style={{color:'#E8F5F3', fontWeight:'bold', fontSize:'16px', margin:'0'}}><PencilIcon size={17} color='#0d4d4d'/> </p>
                </div>

                <div style={{width:'44px', height:'44px', borderRadius:'50%', backgroundColor:'#0d4d4d', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
                    <p style={{color:'#E8F5F3', fontWeight:'bold', fontSize:'16px', margin:'0'}}>L</p>
                </div>
            
            </div>
        
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
        </div>

        {/* 3 Cards Row */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'20px', marginTop:'30px'}}>

                <div style={{padding:'24px', backgroundColor:'#0d4d4d', borderRadius:'15px'}}>
                <p style={{fontSize:'18px', fontWeight:'500', color:'#E8F5F3'}}>Balance</p>
                <p style={{fontSize:'33px', fontWeight:'bolder', color:'#E8F5F3', marginTop:'50px'}}>₦148,200.00</p>
                    <div style={{display:'flex',gap:'5px', alignItems:'center'}}>
                        <div style={{display:'flex', alignItems:'center',gap:'5px',border:'2px solid #E8F5F3', borderRadius:'800px', paddingRight:'10px',paddingLeft:'10px',paddingTop:'3px', paddingBottom:'3px', marginTop:'5px'}}>
                            <p style={{fontSize:'12px', color:'#E8F5F3', marginTop:'0px'}}>On track</p>
                            <TrendingUp size={20} color='#E8F5F3'/> 
                        </div>
                    </div>
                </div>
                
                <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                    <p style={{fontSize:'18px', fontWeight:'500', color:'#0d4d4d'}}>Budget Usage</p>

                        <div style={{marginTop:'24px'}}>
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
                <p style={{fontSize:'18px', fontWeight:'500', color:'#0d4d4d'}}>Monthly Income</p>
                <p style={{fontSize:'35px', fontWeight:'bolder', color:'#0d4d4d', marginTop:'50px'}}>₦148,200.00</p>

                <div style={{display:'flex',gap:'5px', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center',gap:'5px',border:'2px solid #0d4d4d', borderRadius:'800px', paddingRight:'10px',paddingLeft:'10px',paddingTop:'3px', paddingBottom:'3px', marginTop:'5px'}}>
                        <p style={{fontSize:'12px', color:'#0d4d4d', marginTop:'0px'}}>On track</p>
                        <TrendingUp size={20} color='#0d4d4d'/> 
                    </div>
                </div>
            </div>

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px'}}>
                <p style={{fontSize:'18px', fontWeight:'500', color:'#0d4d4d'}}>Monthly Expenses</p>
                <p style={{fontSize:'35px', fontWeight:'bolder', color:'#0d4d4d', marginTop:'50px'}}>₦134,120.45</p>
                <div style={{display:'flex',gap:'5px', alignItems:'center', border:'2px solid #0d4d4d', borderRadius:'800px', paddingLeft:'7px',paddingTop:'3px', paddingBottom:'3px', marginTop:'5px'}}>
                <p style={{fontSize:'12px', color:'#0d4d4d', marginTop:'0px'}}>12% Percent higher than usual</p>
                <TrendingDown size={20} color='#0d4d4d'/> 
                </div>
            </div>
        </div>

        {/* Spending Trends Card */}
        <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', marginTop:'30px', minHeight:'300px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                <p style={{fontSize:'17px', fontWeight:'700', color:'#0d4d4d'}}>Spending Trends</p>
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

            <div style={{padding:'24px', backgroundColor:'#E8F5F3', borderRadius:'15px', marginTop:'30px', minHeight:'250px'}}>
                <p style={{fontSize:'17px', fontWeight:'700', color:'#0d4d4d'}}>Recent transactions</p>
                
                <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'10px', paddingBottom:'10px',marginTop:'20px'}}>
                    <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af'}}>TRANSACTION</p>
                    <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af'}}>CATEGORY</p>
                    <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af'}}>DATE</p>
                    <p style={{fontSize:'12px', fontWeight:'700', color:'#9ca3af'}}>AMOUNT</p>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'10px', paddingTop:'12px', paddingBottom:'12px'}}>
                    <p style={{fontSize:'13px', color:'#111827'}}>Blue Bottle Coffee</p>
                    <p style={{fontSize:'13px', color:'#111827'}}><mark style={{backgroundColor:'#cd69ff', color:'#ffffff',borderRadius:'4px', padding:'4px'}}>Food</mark></p>
                    <p style={{fontSize:'13px', color:'#111827'}}>May 1, 2025</p>
                    <p style={{fontSize:'13px', color:'#e53e3e'}}>-₦12.50</p>
                </div>

                 <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'10px', paddingTop:'12px', paddingBottom:'12px'}}>
                    <p style={{fontSize:'13px', color:'#111827'}}>Groceries</p>
                    <p style={{fontSize:'13px', color:'#111827'}}><mark style={{backgroundColor:'#cd69ff', color:'#ffffff',borderRadius:'4px', padding:'4px'}}>Food</mark></p>
                    <p style={{fontSize:'13px', color:'#111827'}}>May 1, 2025</p>
                    <p style={{fontSize:'13px', color:'#e53e3e'}}>-₦10002.50</p>
                </div>

                 <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'10px', paddingTop:'12px', paddingBottom:'12px'}}>
                    <p style={{fontSize:'13px', color:'#111827'}}>Allowance deposit</p>
                    <p style={{fontSize:'13px', color:'#111827'}}><mark style={{backgroundColor:'#1dcc43', color:'#ffffff',borderRadius:'4px', padding:'4px'}}>Income</mark></p>
                    <p style={{fontSize:'13px', color:'#111827'}}>June 1, 2025</p>
                    <p style={{fontSize:'13px', color:'#1dcc43'}}>+₦140000</p>
                </div>
            </div>    
        </div>

        
);
};

export default Dashboard;