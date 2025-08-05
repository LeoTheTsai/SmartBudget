import { useEffect, useState } from 'react'
import {
  Badge, IconButton, Menu, MenuItem, ListItemText, ListItemIcon, Typography, Divider
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import CheckIcon from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'
import { format } from 'date-fns'

const iconMap = {
  info: <InfoIcon color="info" />,
  warning: <WarningIcon color="warning" />,
  error: <ErrorIcon color="error" />
}

interface Notification {
  _id: string
  message: string
  type: 'info' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = async () => {
    const res = await fetch('http://localhost:5000/api/notifications')
    const data = await res.json()
    setNotifications(data)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleOpen = async (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)

    // Mark all as read on open (optional, or skip this line to allow per-item control)
    await fetch('http://localhost:5000/api/notifications/mark-read', { method: 'PATCH' })
    fetchNotifications()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleRead = async (id: string, read: boolean) => {
    await fetch(`http://localhost:5000/api/notifications/toggle/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !read })
    })
    fetchNotifications()
  }

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map(n => (
            <MenuItem key={n._id} divider>
              <ListItemIcon>{iconMap[n.type]}</ListItemIcon>
              <ListItemText
                primary={n.message}
                secondary={format(new Date(n.createdAt), 'MMM d, h:mm a')}
              />
              <IconButton size="small" onClick={() => toggleRead(n._id, n.read)}>
                {n.read ? <UndoIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  )
}

export default NotificationCenter
