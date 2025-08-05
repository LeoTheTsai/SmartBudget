import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useMediaQuery
} from '@mui/material';
import { Brightness4 } from '@mui/icons-material';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const Header = ({ toggleDarkMode }: { toggleDarkMode: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* App Title */}
        <Typography variant="h6">SmartBudget</Typography>

        {/* Right Section: Notification + Name + Theme Toggle + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && <NotificationCenter />}

          {!isMobile && user?.name && (
            <Typography sx={{ mx: 1 }}>
              Hi, {user.name}
            </Typography>
          )}

          <IconButton color="inherit" onClick={toggleDarkMode}>
            <Brightness4 />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleAvatarClick}
            sx={{ p: 0 }}
          >
            <Avatar alt={user?.name} src="https://i.pravatar.cc/300" />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {isMobile && user?.name && (
          <MenuItem disabled>Hi, {user.name}</MenuItem>
        )}
        <MenuItem onClick={toggleDarkMode}>Toggle Dark Mode</MenuItem>
        <MenuItem disabled>Profile (coming soon)</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
