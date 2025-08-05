import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  BarChart,
  Settings,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({
  drawerOpen,
  setDrawerOpen
}: {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Analysis', icon: <BarChart />, path: '/analysis' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={drawerOpen}
      sx={{
        width: drawerOpen ? 240 : 72,
        flexShrink: 0,
        top: '64px',
        height: 'calc(100% - 64px)',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerOpen ? 240 : 72,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          backgroundColor:
            theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default,
          color: theme.palette.text.primary,
          top: '64px',
          height: 'calc(100% - 64px)',
          borderRight: '1px solid #ddd',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: drawerOpen ? 'flex-start' : 'center',
          alignItems: 'center',
          px: 1,
          py: 1
        }}
      >
        <Tooltip title={drawerOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List>
        {navItems.map(item => (
          <Tooltip
            key={item.text}
            title={!drawerOpen ? item.text : ''}
            placement="right"
          >
            <ListItem
              button
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                px: drawerOpen ? 2 : 0,
                py: 1.5,
                display: 'flex',
                justifyContent: drawerOpen ? 'flex-start' : 'center',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.text.primary,
                  minWidth: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
