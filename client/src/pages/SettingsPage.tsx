import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Grid
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import AlertBanner  from '../components/AlertBanner';

const SettingsPage = (): JSX.Element => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user, updateBudget } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/${user?.id}`)
        const data = await res.json()
        if (!data) {
          console.error('User not found')
          return
        }
        setName(data.name)
        setEmail(data.email)
        setMonthlyBudget(data.monthlyBudget?.toString() || '')
      } catch (err) {
        console.error('Failed to fetch user info', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`http://localhost:5000/api/user/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, monthlyBudget: parseFloat(monthlyBudget) })
      })
      //update context of monthly budget
      updateBudget(parseFloat(monthlyBudget))
    } catch (err) {
      console.error('Failed to update profile', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Typography>Loading...</Typography>

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Account Settings</Typography>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            /> 
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Monthly Budget"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              fullWidth
              margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              sx={{ mt: 2 }}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Security Settings</Typography>
            <Typography variant="body2" color="textSecondary">
              For security reasons, you cannot change your email or password here. Please contact support if you need to update these.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
        <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Data Management</Typography>
            <Typography variant="body2" color="textSecondary">
              You can export your data or delete your account from here. Please proceed with caution.
            </Typography>
            {/* Placeholder for future data management features */}
          </CardContent>
        </Card>
        </Grid>
        </Grid>
    )}

export default SettingsPage
