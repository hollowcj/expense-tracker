'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Alert, 
  InputAdornment,
  Link
} from '@mui/material';
import { Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (data?.session) {
      const { access_token, refresh_token, expires_in } = data.session;

      document.cookie = `sb-access-token=${access_token}; path=/; max-age=${expires_in}; SameSite=Lax; Secure`;
      
      document.cookie = `sb-refresh-token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;

      router.push('/dashboard');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#E2F1ED',
        padding: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ color: '#0D3E3A', fontWeight: 700, mb: 4, trackingTight: -1 }}
          >
            Fundly
          </Typography>

          <Box 
            sx={{ 
              backgroundColor: 'white', 
              borderRadius: 4, 
              padding: { xs: 3, sm: 5 }, 
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <Box sx={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#0D3E3A', fontWeight: 700 }}>
                  Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, pr: 2, lineHeight: 1.4 }}>
                  Welcome to Fundly, your simplified expense tracker.
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#9BB0AC', width: 52, height: 52 }}>
                <User size={24} />
              </Avatar>
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: '#0D3E3A', marginRight: 1 }}>
                        <Mail size={20} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3,
                    '&.Mui-focused fieldset': {
                      borderColor: '#0D3E3A',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0D3E3A',
                  }
                }}
              />

              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: '#0D3E3A', marginRight: 1 }}>
                        <Lock size={20} />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3,
                    '&.Mui-focused fieldset': {
                      borderColor: '#0D3E3A',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0D3E3A',
                  }
                }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  disableElevation
                  sx={{
                    backgroundColor: '#B8DBD3',
                    color: '#0D3E3A',
                    fontWeight: 600,
                    borderRadius: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': { backgroundColor: '#a6ccc3' }
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Link 
                  href="#" 
                  underline="hover" 
                  align="center" 
                  sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                >
                  Forgot Password?
                </Link>

                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => router.push('./signup')}
                  sx={{
                    backgroundColor: '#9BB0AC',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': { backgroundColor: '#8ba09c' }
                  }}
                >
                  Create an account
                </Button>

              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}