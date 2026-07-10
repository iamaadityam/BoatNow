import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RainAlertBanner } from './components/RainAlertBanner';
import { ScrollWaterLevel } from './components/ScrollWaterLevel';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Anchor, KeyRound } from 'lucide-react';

function DashboardRenderer() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20 mb-4 animate-bounce">
          <Anchor className="h-8 w-8" />
        </div>
        <h2 className="font-sans text-xl font-black text-slate-800 dark:text-white">Welcome to BoatNow</h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
          The emergency urban water-mobility portal. To begin chartering rowboats or listing captain fleets, access one of our sandboxed profiles.
        </p>
      </div>
    );
  }

  switch (currentUser.role) {
    case 'owner':
      return <OwnerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50/50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-200">
        
        {/* Real-Time Rain Alert Banner */}
        <RainAlertBanner />

        {/* Navigation Header */}
        <Header />

        {/* Core Screen stage wrapper */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-16">
          <DashboardRenderer />
        </main>

        {/* Animated scrolling puddle gauge */}
        <ScrollWaterLevel />
      </div>
    </AppProvider>
  );
}
