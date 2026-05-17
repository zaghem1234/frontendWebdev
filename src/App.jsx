import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Storefront from './pages/Storefront';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import CareGuide from './pages/CareGuide';
import OurStory from './pages/OurStory';
import ProtectedRoute from './components/ProtectedRoute';
import AccountModal from './components/AccountModal';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <AccountModal />
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/orders" element={<Admin />} />
          <Route path="/admin/customers" element={<Admin />} />
          <Route path="/admin/settings" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
