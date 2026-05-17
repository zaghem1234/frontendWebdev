import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function SideNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { name: 'Inventory', icon: 'potted_plant', path: '/admin' },
    { name: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
    { name: 'Customers', icon: 'group', path: '/admin/customers' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="h-screen w-20 hover:w-64 transition-all duration-300 fixed left-0 top-0 z-40 bg-inverse-surface flex flex-col py-4 shadow-xl overflow-hidden group">
      <div className="px-6 mb-10 flex items-center gap-4">
        <span className="material-symbols-outlined text-secondary-fixed text-headline-md">eco</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <h1 className="font-headline-md text-headline-md text-secondary-fixed">Plant Beauty</h1>
          <p className="font-label-md text-[10px] text-on-surface-variant leading-tight">Admin Portal</p>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex items-center gap-4 p-4 transition-all duration-200 ease-in-out group/item ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container rounded-lg mx-2' 
                  : 'text-on-surface-variant hover:text-white mx-2 hover:bg-white/10 rounded-lg'
              }`}
            >
              <span className="material-symbols-outlined shrink-0">{item.icon}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-md text-label-md">
                {item.name}
              </span>
            </Link>
          );
        })}
        
        <div className="mt-auto flex flex-col gap-2">
          <Link to="/admin/settings" className="flex items-center gap-4 text-on-surface-variant hover:text-white p-4 transition-all duration-200 ease-in-out group/item mx-2 hover:bg-white/10 rounded-lg">
            <span className="material-symbols-outlined shrink-0">settings</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-md text-label-md">Settings</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-4 text-error hover:text-error-container p-4 transition-all duration-200 ease-in-out group/item mx-2 hover:bg-white/5 rounded-lg text-left">
            <span className="material-symbols-outlined shrink-0">logout</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-md text-label-md">Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
