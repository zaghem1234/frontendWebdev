import React, { useState, useEffect } from 'react';
import SideNavBar from '../components/SideNavBar';
import AdminInventoryTable from '../components/AdminInventoryTable';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, TrendingUp, Package, Users, ShoppingCart, Info, Check, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Notification Bell State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🟢 System connected to Supabase Cloud", time: "Just now", unread: true },
    { id: 2, text: "📦 Storage bucket 'product-images' initialized", time: "5m ago", unread: true },
    { id: 3, text: "🌿 Brand rebranded to Plant Beauty", time: "10m ago", unread: false }
  ]);
  const hasUnread = notifications.some(n => n.unread);

  // Stats / Dashboard state
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPlants: 0,
    activeOrders: 0,
    totalCustomers: 0
  });

  // DB Data States
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Settings state loaded from localStorage
  const [promoText, setPromoText] = useState(localStorage.getItem('plant_beauty_promo') || '🚚 Free delivery on all orders above $150!');
  const [whatsappNum, setWhatsappNum] = useState(localStorage.getItem('plant_beauty_whatsapp') || '+1234567890');
  const [easypaisaAccount, setEasypaisaAccount] = useState(localStorage.getItem('plant_beauty_easypaisa') || '0300-1234567');
  const [jazzcashAccount, setJazzcashAccount] = useState(localStorage.getItem('plant_beauty_jazzcash') || '0300-1234567');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(localStorage.getItem('plant_beauty_google_maps') || 'https://maps.google.com/?q=Islamabad,+Pakistan');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
    if (currentPath === '/admin/orders') {
      fetchOrders();
    } else if (currentPath === '/admin/customers') {
      fetchCustomers();
    }

    // Set up Supabase Realtime Postgres Changes Channel
    const realtimeChannel = supabase
      .channel('orders_realtime_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new;
          
          // Prepend beautiful notification alert
          setNotifications(prev => [
            {
              id: Date.now(),
              text: `🔔 New Order Placed! Amount Billed: $${Number(newOrder.total_amount || newOrder.subtotal).toFixed(2)} (${newOrder.payment_method || 'COD'})`,
              time: "Just now",
              unread: true
            },
            ...prev
          ]);

          // Refresh database states and statistics automatically!
          fetchDashboardMetrics();
          if (currentPath === '/admin/orders') {
            fetchOrders();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [currentPath]);

  const fetchDashboardMetrics = async () => {
    try {
      // 1. Fetch plants count
      const { count: plantsCount } = await supabase
        .from('plants_inventory')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch customers count
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      // 3. Fetch active orders count
      const { count: activeCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'Shipped');

      // 4. Fetch total sales
      const { data: salesData } = await supabase
        .from('orders')
        .select('subtotal');

      const totalRevenue = salesData?.reduce((acc, curr) => acc + Number(curr.subtotal), 0) || 0;

      setStats({
        totalSales: totalRevenue,
        totalPlants: plantsCount || 0,
        activeOrders: activeCount || 0,
        totalCustomers: customersCount || 0
      });
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  const fetchOrders = async () => {
    setLoadingDb(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          subtotal,
          status,
          created_at,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingDb(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state instantly
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      // Add a live notification
      setNotifications(prev => [
        { id: Date.now(), text: `📦 Order status updated to "${newStatus}"`, time: "Just now", unread: true },
        ...prev
      ]);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleClearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('plant_beauty_promo', promoText);
    localStorage.setItem('plant_beauty_whatsapp', whatsappNum);
    localStorage.setItem('plant_beauty_easypaisa', easypaisaAccount);
    localStorage.setItem('plant_beauty_jazzcash', jazzcashAccount);
    localStorage.setItem('plant_beauty_google_maps', googleMapsUrl);
    setSaveSuccess(true);
    // Add custom notification
    setNotifications(prev => [
      { id: Date.now(), text: "⚙️ System configurations saved successfully", time: "Just now", unread: true },
      ...prev
    ]);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper to determine active section name
  const getSectionTitle = () => {
    switch (currentPath) {
      case '/admin/dashboard':
        return 'System Performance Dashboard';
      case '/admin/orders':
        return 'Live Customer Orders';
      case '/admin/customers':
        return 'Registered Customer Accounts';
      case '/admin/settings':
        return 'Portal Configurations';
      case '/admin':
      default:
        return 'Nursery Inventory Table';
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden flex min-h-screen">
      <SideNavBar />
      
      {/* Main Workspace */}
      <main className="ml-20 flex-1 transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 glass-panel sticky top-0 z-30 flex items-center justify-between px-gutter border-b border-outline-variant/30">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Plant Beauty Admin</h2>
            <p className="text-on-surface-variant text-sm">{getSectionTitle()}</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Interactive Bell Icon Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full transition-colors relative ${isNotificationsOpen ? 'bg-primary/10 text-primary' : 'hover:bg-secondary-container text-primary'}`}
              >
                <Bell className="w-6 h-6" />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown Box */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-card bg-surface shadow-2xl rounded-2xl border border-outline-variant/20 p-4 z-50 animate-fade-in text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10 mb-2">
                    <h4 className="font-headline-sm text-sm text-primary font-bold">System Alerts</h4>
                    {hasUnread && (
                      <button 
                        onClick={handleClearNotifications} 
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-lg text-xs leading-relaxed transition-all ${n.unread ? 'bg-primary/5 font-semibold text-primary' : 'text-on-surface-variant'}`}>
                        <p>{n.text}</p>
                        <span className="text-[10px] text-on-surface-variant/60 block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsNotificationsOpen(false)}
                    className="w-full text-center text-xs text-primary mt-3 pt-2 border-t border-outline-variant/10 font-bold hover:underline"
                  >
                    Close panel
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface">{profile?.full_name || 'Admin User'}</p>
                <button onClick={handleLogout} className="text-xs text-error hover:underline block w-full text-right font-medium">Log Out</button>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl8wTpQtDt8ZpffPoarlUIjjFg68vShta8YWS0DgyduUcta2C_8TUKjwTBGLOMsA2J8y3iznsf7resF4SU_xvDU9kd2lZnQGGqUsO8bOmxj3euSs-jpxE0kOwpHvxnz2Xl0frRMNl05I9zDWASjmxswMngiC-rpp0czDJ6ELe0uCk_r5o8aLRgNQ5FyW3-G96uCl_5ohnTHHDxy7GlLzdq-IWuEI9w_5LqUWvyByOyGOIougbB4-_ZeNpzjQqYZ2gWP8C8Vtd4Px8" 
                alt="Admin User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed" 
              />
            </div>
          </div>
        </header>

        {/* Content Area - Path-based Conditional Views */}
        <div className="p-gutter">
          
          {/* ======================================= */}
          {/* 1. DASHBOARD VIEW                       */}
          {/* ======================================= */}
          {currentPath === '/admin/dashboard' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                <div className="glass-card p-6 bg-white rounded-2xl border border-outline-variant/10 long-shadow flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider">Total Sales</p>
                    <h3 className="text-2xl font-headline-lg text-primary mt-1">${stats.totalSales.toFixed(2)}</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="glass-card p-6 bg-white rounded-2xl border border-outline-variant/10 long-shadow flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider">Plant Inventory</p>
                    <h3 className="text-2xl font-headline-lg text-primary mt-1">{stats.totalPlants} Listings</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="glass-card p-6 bg-white rounded-2xl border border-outline-variant/10 long-shadow flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider">Active Orders</p>
                    <h3 className="text-2xl font-headline-lg text-primary mt-1">{stats.activeOrders} Pending</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>

                <div className="glass-card p-6 bg-white rounded-2xl border border-outline-variant/10 long-shadow flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-label-md text-on-surface-variant tracking-wider">Total Buyers</p>
                    <h3 className="text-2xl font-headline-lg text-primary mt-1">{stats.totalCustomers} Accounts</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Dynamic Insights Panel */}
              <div className="glass-card p-8 bg-white rounded-3xl border border-outline-variant/10 long-shadow">
                <div className="flex gap-3 items-center mb-4">
                  <Info className="w-6 h-6 text-primary" />
                  <h3 className="font-headline-md text-headline-md text-primary">Greenhouse Systems Healthy</h3>
                </div>
                <p className="text-on-surface-variant font-body-md leading-relaxed">
                  Welcome to your new unified **Plant Beauty Control Center**. You have successfully synced the inventory schema, cloud image uploads, order logs, and registered users from your live Supabase cloud database. Use the navigation sidebar on the left to seamlessly manage stock, update order delivery status, or view user lists.
                </p>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 2. ORDERS VIEW                          */}
          {/* ======================================= */}
          {currentPath === '/admin/orders' && (
            <div className="glass-card bg-white rounded-3xl border border-outline-variant/10 long-shadow overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">Customer Orders</h3>
                <button onClick={fetchOrders} className="p-2 hover:bg-secondary-container rounded-full text-primary transition-colors flex items-center gap-2 text-xs font-semibold">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {loadingDb ? (
                <div className="py-12 flex justify-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl mb-4 text-primary">shopping_bag</span>
                  <p className="font-headline-sm text-sm">No live orders logged yet.</p>
                  <p className="text-xs mt-1">Orders created by customers in checkout will instantly display here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/20 text-on-surface-variant uppercase text-[11px] tracking-wider">
                        <th className="py-4 px-4">Order ID</th>
                        <th className="py-4 px-4">Customer</th>
                        <th className="py-4 px-4">Subtotal</th>
                        <th className="py-4 px-4">Date Added</th>
                        <th className="py-4 px-4">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-outline-variant/10 hover:bg-black/[0.02] transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-primary">{order.id.slice(0, 8)}...</td>
                          <td className="py-4 px-4">{order.profiles?.full_name || 'Anonymous customer'}</td>
                          <td className="py-4 px-4 font-bold text-primary">${Number(order.subtotal).toFixed(2)}</td>
                          <td className="py-4 px-4 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-primary/5 text-primary border border-primary/20 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* 3. CUSTOMERS VIEW                       */}
          {/* ======================================= */}
          {currentPath === '/admin/customers' && (
            <div className="glass-card bg-white rounded-3xl border border-outline-variant/10 long-shadow overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-primary">Registered Accounts</h3>
                <button onClick={fetchCustomers} className="p-2 hover:bg-secondary-container rounded-full text-primary transition-colors flex items-center gap-2 text-xs font-semibold">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {loadingDb ? (
                <div className="py-12 flex justify-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : customers.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl mb-4 text-primary">group</span>
                  <p className="font-headline-sm text-sm">No registered buyer accounts.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/20 text-on-surface-variant uppercase text-[11px] tracking-wider">
                        <th className="py-4 px-4">User ID</th>
                        <th className="py-4 px-4">Full Name</th>
                        <th className="py-4 px-4">Role System</th>
                        <th className="py-4 px-4">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => (
                        <tr key={c.id} className="border-b border-outline-variant/10 hover:bg-black/[0.02] transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-on-surface-variant">{c.id.slice(0, 8)}...</td>
                          <td className="py-4 px-4 font-semibold text-primary">{c.full_name || 'Standard User'}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary-container text-on-surface-variant'}`}>
                              {c.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-on-surface-variant">{new Date(c.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* 4. SETTINGS VIEW                        */}
          {/* ======================================= */}
          {currentPath === '/admin/settings' && (
            <div className="glass-card bg-white rounded-3xl border border-outline-variant/10 long-shadow p-8 max-w-2xl mx-auto">
              <h3 className="font-headline-md text-headline-md text-primary mb-6">Portal Configuration</h3>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-2">Storefront Promotion Banner</label>
                  <input 
                    type="text" 
                    value={promoText}
                    onChange={(e) => setPromoText(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl font-body-md focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-2">Botanist Support WhatsApp</label>
                  <input 
                    type="text" 
                    value={whatsappNum}
                    onChange={(e) => setWhatsappNum(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl font-body-md focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-2">EasyPaisa Account Number</label>
                  <input 
                    type="text" 
                    value={easypaisaAccount}
                    onChange={(e) => setEasypaisaAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl font-body-md focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-2">JazzCash Account Number</label>
                  <input 
                    type="text" 
                    value={jazzcashAccount}
                    onChange={(e) => setJazzcashAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl font-body-md focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-label-md text-on-surface-variant tracking-wider mb-2">Google Maps Location Link</label>
                  <input 
                    type="url" 
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=Islamabad,+Pakistan"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl font-body-md focus:outline-none focus:border-primary"
                    required
                  />
                  <span className="text-[11px] text-on-surface-variant/70 block mt-1">
                    Enter the URL from Google Maps for your custom nursery location (e.g. share links, place URLs or coordinates).
                  </span>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-full hover:shadow-lg transition-all flex items-center gap-2 active:scale-95">
                    Save settings
                  </button>
                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Check className="w-5 h-5" /> Saved!
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ======================================= */}
          {/* 5. INVENTORY VIEW (DEFAULT)             */}
          {/* ======================================= */}
          {(currentPath === '/admin' || currentPath === '') && (
            <AdminInventoryTable />
          )}

        </div>
        
      </main>
    </div>
  );
}
