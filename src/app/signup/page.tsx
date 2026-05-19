"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Snackbar, Alert } from '@mui/material';

const SignUpPage = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                },
            });

            if (error) throw error;

            // FIX: If the user is automatically logged in right after account creation,
            // we immediately parse their tokens into cookies to feed the Next.js middleware.
            if (data?.session) {
                const { access_token, refresh_token, expires_in } = data.session;
                
                document.cookie = `sb-access-token=${access_token}; path=/; max-age=${expires_in}; SameSite=Lax; Secure`;
                document.cookie = `sb-refresh-token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
            }

            setToast({
                open: true,
                message: data?.session 
                    ? 'Account created successfully! Preparing your workspace...' 
                    : 'Account created successfully! Check your email for a verification link.',
                severity: 'success'
            });

            // Redirect smoothly once states are safely bound
            setTimeout(() => {
                router.push(data?.session ? '/dashboard' : '/');
            }, 3500);

        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F8FAFC' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '400px', border: '1px solid #f1f5f9' }}>
                
                <h2 style={{ color: '#0D4D4D', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>Join Fundly to track your expenses</p>

                {errorMsg && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>First Name</label>
                            <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} placeholder="John" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Last Name</label>
                            <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} placeholder="Doe" />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>School Email Address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} placeholder="yourname@pau.edu.ng" />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={loading} style={{ backgroundColor: '#0D4D4D', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s' }}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginTop: '24px', margin: '24px 0 0 0' }}>
                    Already have an account?{' '}
                    <Link href="/" style={{ color: '#0D4D4D', fontWeight: '600', textDecoration: 'none' }}>
                        Log In
                    </Link>
                </p>
            </div>

            <Snackbar 
                open={toast.open} 
                autoHideDuration={3000} 
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseToast} 
                    severity={toast.severity} 
                    variant="filled"
                    sx={{ width: '100%', bgcolor: '#0D4D4D', color: 'white', fontWeight: '500' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SignUpPage;