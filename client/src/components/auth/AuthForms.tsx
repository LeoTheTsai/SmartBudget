import { useState } from 'react'
import { TextField, Button, Box, Typography, Stack } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface AuthFormProps {
  type: 'login' | 'register'
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Auth failed')

      login(data.token) // stores in context and localStorage
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3, borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h5" mb={2}>
        {type === 'login' ? 'Login' : 'Register'}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained">
          {type === 'login' ? 'Login' : 'Register'}
        </Button>
        <Button
          onClick={() => navigate(type === 'login' ? '/register' : '/login')}
          size="small"
        >
          {type === 'login' ? 'No account? Register' : 'Already have an account? Login'}
        </Button>
      </Stack>
    </Box>
  )
}

export const LoginForm = () => <AuthForm type="login" />
export const RegisterForm = () => <AuthForm type="register" />