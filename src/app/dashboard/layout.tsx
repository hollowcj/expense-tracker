// app/dashboard/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/app/components/Sidebar';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      // 1. Ask Supabase if there is a live user token in the browser
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // 2. No user found? Boot them straight back to the login screen!
        router.refresh();
        router.push('/');
      } else {
        // 3. User exists? Turn off the loading screen and let them pass
        setLoading(false);
      }
    };

    checkUserSession();
  }, [router]);

  // While checking the token, show a clean loading spinner so they don't see a flash of the dashboard
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#F8FAFC' }}>
        <CircularProgress sx={{ color: '#0D4D4D' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', bgcolor: '#F8FAFC' }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          height: '100vh', 
          overflowY: 'auto',
          p: { xs: 3, md: 5 } 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}