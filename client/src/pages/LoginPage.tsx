import { useState } from 'react';
import { useNavigate, Navigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Paper
} from '@mui/material';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/AlertBanner';
import { motion } from 'framer-motion';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, updateBudget } = useAuth();

  if (user) return <Navigate to="/dashboard" />;

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isEmailValid(form.email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    const res = await loginUser(form);
    setLoading(false);

    if (res.token) {
      login(res.token);
      updateBudget(res.user.monthlyBudget);
      setSuccessOpen(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/finance-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Login to SmartBudget
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" mb={2}>
              Welcome back! Please enter your credentials.
            </Typography>

            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2} mt={2}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>

                <Typography variant="body2" align="center">
                  Don’t have an account?{' '}
                  <Button
                    component={RouterLink}
                    to="/register"
                    size="small"
                    sx={{ textTransform: 'none', padding: 0 }}
                  >
                    Register
                  </Button>
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Box>
      {error && (
        <AlertBanner
          open={!!error}
          message={error}
          severity="error"
          onClose={() => setError('')}
        />
      )}

      <AlertBanner
        open={successOpen}
        message="Login successful!"
        severity="success"
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}

export default LoginPage;
