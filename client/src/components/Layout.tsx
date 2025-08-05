import { Box, Toolbar, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ toggleDarkMode }: { toggleDarkMode: () => void }) => {
  const theme = useTheme();

  // Load drawer state from localStorage
  const [drawerOpen, setDrawerOpenState] = useState(() => {
    const saved = localStorage.getItem('drawerOpen');
    return saved === null ? true : saved === 'true';
  });

  // Wrapped setter that also updates localStorage
  const setDrawerOpen = useCallback((newValue: boolean) => {
    localStorage.setItem('drawerOpen', String(newValue));
    setDrawerOpenState(newValue);
  }, []);

  const drawerWidth = drawerOpen ? 240 : 72;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          transition: 'width 0.3s ease',
        }}
      >
        <Header toggleDarkMode={toggleDarkMode} />
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
