import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Anchor, Bell, LogOut, Moon, Sun, User, ShieldAlert, Waves, RefreshCw, KeyRound, Menu, X, Check, HelpCircle } from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { currentUser, theme, notifications, toggleTheme, switchRole, logoutUser, loginUser, users, markNotificationsAsRead } = useApp();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === currentUser?.uid && !n.isRead).length;

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowProfileDropdown(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  const handleQuickLogin = (email: string) => {
    loginUser(email);
    setShowLoginModal(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <Anchor className="h-5 w-5 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xl font-black tracking-tight text-blue-600 dark:text-cyan-400">BoatNow</span>
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-widest dark:bg-slate-800 dark:text-cyan-400">SATIRE</span>
            </div>
            <p className="hidden text-[10px] font-semibold text-slate-400 sm:block dark:text-slate-500">
              India's #1 On-Demand Urban Water Mobility
            </p>
          </div>
        </div>

        {/* Desktop Nav Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Help Info Button */}
          <button 
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            id="btn-help"
          >
            <HelpCircle className="h-4 w-4" />
            About Satire
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle Theme"
            id="btn-toggle-theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Quick Sandbox Role Switcher */}
          {currentUser && (
            <div className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 p-1 dark:border-slate-800 dark:bg-slate-900/30">
              <span className="px-2 text-[10px] font-bold tracking-wider text-blue-600 uppercase dark:text-slate-400">Sandbox Switch:</span>
              {(['customer', 'owner', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-all ${
                    currentUser.role === r
                      ? 'bg-blue-600 text-white shadow-sm dark:bg-cyan-500'
                      : 'text-slate-600 hover:bg-blue-100/50 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  id={`sandbox-role-${r}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Notifications Trigger */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                id="btn-notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="mb-2 flex items-center justify-between border-b pb-2 dark:border-slate-800">
                    <span className="font-sans font-bold text-slate-800 dark:text-white">Waterlogs & Alerts</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-600 hover:underline dark:text-cyan-400"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {notifications.filter(n => n.userId === currentUser.uid).length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">All dry! No pending alarms.</p>
                    ) : (
                      notifications
                        .filter(n => n.userId === currentUser.uid)
                        .map(n => (
                          <div key={n.id} className="rounded-lg bg-slate-50/50 p-2.5 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                id="btn-profile-menu"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-cyan-400">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{currentUser.name}</p>
                  <p className="text-[9px] font-semibold text-slate-400 capitalize">{currentUser.role}</p>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="px-4 py-2 border-b dark:border-slate-800">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => handleRoleChange('customer')}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    id="profile-to-customer"
                  >
                    <User className="h-4 w-4 text-blue-500" /> Customer Mode
                  </button>
                  <button
                    onClick={() => handleRoleChange('owner')}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    id="profile-to-owner"
                  >
                    <Waves className="h-4 w-4 text-emerald-500" /> Boat Owner Mode
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    id="profile-to-admin"
                  >
                    <ShieldAlert className="h-4 w-4 text-amber-500" /> Admin Console
                  </button>
                  <div className="my-1 border-t dark:border-slate-800"></div>
                  <button
                    onClick={logoutUser}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    id="btn-logout"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-blue-700"
              id="btn-login"
            >
              <KeyRound className="h-4 w-4" /> Access Accounts
            </button>
          )}
        </div>

        {/* Mobile Header Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t bg-white px-4 py-4 space-y-4 md:hidden dark:bg-slate-950 dark:border-slate-800">
          {currentUser && (
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-xs text-slate-400">Current User</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 capitalize">{currentUser.role} Mode</p>
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-1">SWITCH SANDBOX ROLE</p>
            <div className="grid grid-cols-3 gap-1">
              {(['customer', 'owner', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleChange(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-lg py-2 text-center text-xs font-bold capitalize transition-all ${
                    currentUser?.role === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t dark:border-slate-800">
            <button 
              onClick={() => {
                setShowHelpModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
            >
              <HelpCircle className="h-4.5 w-4.5" /> Satire & Humor Guidelines
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 text-sm font-bold text-red-500"
              >
                <LogOut className="h-4.5 w-4.5" /> Logout Session
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-sm font-bold text-white shadow-md"
              >
                <KeyRound className="h-4 w-4" /> Access Accounts
              </button>
            )}
          </div>
        </div>
      )}

      {/* Access Accounts / Quick Sandbox login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border-t sm:border dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h3 className="font-sans text-lg font-black text-slate-800 dark:text-white">Sandbox Account Lobby</h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="rounded-full bg-slate-100 p-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="my-3 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              Select one of our designated simulation profiles below to instantly test the platform from different perspectives.
            </p>

            <div className="space-y-3">
              {users.map(u => (
                <button
                  key={u.uid}
                  onClick={() => handleQuickLogin(u.email)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-left hover:border-blue-300 hover:bg-blue-50/20 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-cyan-500"
                >
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">{u.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                  </div>
                  <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                    u.role === 'owner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                    'bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-cyan-400'
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Satire / Help Info Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border-t sm:border dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Anchor className="h-5 w-5 text-blue-500" />
                <h3 className="font-sans text-lg font-black text-slate-800 dark:text-white">BoatNow Slogan & Satire Index</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="rounded-full bg-slate-100 p-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Welcome to BoatNow!</strong> This is India's premier, highly-localized (satirical) urban water mobility platform designed to help you navigate severe monsoons when Indian streets transform into deep aquatic highways.
              </p>
              <p>
                Whether you need to get to work in a fiberglass kayak, charter a romantic luxury Shikara for Connaught Place logs, or trigger our emergency <strong>SOS canoe dispatch</strong>, BoatNow operates with pristine precision.
              </p>
              
              <div className="rounded-2xl bg-blue-50 p-4 dark:bg-slate-800/40">
                <p className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-widest mb-1.5">OUR COMMUTE COVENANTS</p>
                <ul className="space-y-1 text-xs list-disc pl-4 text-slate-600 dark:text-slate-300">
                  <li><strong>Your Uber is now a canoe:</strong> No engine noise, pure arm-rowing majesty.</li>
                  <li><strong>Traffic? What traffic?:</strong> Glide right over traffic lights, stranded cars, and submerged street signs.</li>
                  <li><strong>Now accepting puddles as highways:</strong> Ankle-deep is all we need to get Captain Verma launched.</li>
                </ul>
              </div>

              <p className="text-xs text-slate-400 font-semibold italic text-center">
                Dispatched under Section 12-B of the National Puddle Navigation Guidelines.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
