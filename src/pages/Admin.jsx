import React from 'react';
import SideNavBar from '../components/SideNavBar';
import AdminInventoryTable from '../components/AdminInventoryTable';
import { useAuthStore } from '../store/useAuthStore';
import { Bell } from 'lucide-react';

export default function Admin() {
  const { profile } = useAuthStore();

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden flex min-h-screen">
      <SideNavBar />
      
      {/* Main Workspace */}
      <main className="ml-20 flex-1 transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 glass-panel sticky top-0 z-30 flex items-center justify-between px-gutter border-b border-outline-variant/30">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Admin Center Workspace</h2>
            <p className="text-on-surface-variant text-sm">Inventory Management</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button className="p-2 hover:bg-secondary-container rounded-full transition-colors text-primary">
                <Bell className="w-6 h-6" />
              </button>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface">{profile?.full_name || 'Admin User'}</p>
                <p className="text-xs text-on-surface-variant">System Administrator</p>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl8wTpQtDt8ZpffPoarlUIjjFg68vShta8YWS0DgyduUcta2C_8TUKjwTBGLOMsA2J8y3iznsf7resF4SU_xvDU9kd2lZnQGGqUsO8bOmxj3euSs-jpxE0kOwpHvxnz2Xl0frRMNl05I9zDWASjmxswMngiC-rpp0czDJ6ELe0uCk_r5o8aLRgNQ5FyW3-G96uCl_5ohnTHHDxy7GlLzdq-IWuEI9w_5LqUWvyByOyGOIougbB4-_ZeNpzjQqYZ2gWP8C8Vtd4Px8" 
                alt="Admin User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed" 
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <AdminInventoryTable />
        
      </main>
    </div>
  );
}
