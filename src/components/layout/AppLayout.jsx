import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomTabBar from './BottomTabBar';
import ToastContainer from '../common/ToastContainer';

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans">
      {/* Top navigation (desktop bar + drop-down menu on phones/tablets) */}
      <Header />

      {/* Bottom padding clears the mobile tab bar */}
      <main className="flex-1 px-4 pt-3 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-4 lg:pb-12 max-w-[1600px] w-full mx-auto">
        {/* Keyed by route so each screen transitions in like an app screen */}
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>

      {/* Phones/tablets: app-style bottom tabs */}
      <BottomTabBar />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
