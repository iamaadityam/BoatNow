import React from 'react';
import { useApp } from '../context/AppContext';
import { Boat, Booking, UserProfile, PaymentLog } from '../types';
import { 
  ShieldAlert, Landmark, DollarSign, Users, Anchor, CheckCircle2, 
  XCircle, Waves, AlertTriangle, EyeOff, ShieldCheck, TrendingUp 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    boats, bookings, payments, users, toggleBoatStatus, floodSeverity 
  } = useApp();

  // Stats calculations
  const totalCompletedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const activeBoats = boats.filter(b => b.status === 'active').length;
  const suspendedBoats = boats.filter(b => b.status === 'suspended').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 opacity-10">
          <Landmark className="h-44 w-44 rotate-12" />
        </div>
        <div className="relative max-w-lg space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
            🛡️ NATIONAL PUDDLE INSPECTORS (ADMIN)
          </span>
          <h1 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
            Delhi Maritime Control Center
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Regulatory authority console. Verify Delhi oar certifications, flag fraudulent raft listings, check Stripe transaction ledgers, and manage user licenses.
          </p>
        </div>
      </section>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        
        {/* Stat 1 */}
        <div className="rounded-3xl border border-slate-100 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Puddles Bridged</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-black text-slate-800 dark:text-white">
              {totalCompletedBookings}
            </span>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> 100% rows
            </span>
          </div>
          <p className="text-[9px] text-slate-400 mt-1">Completed charters</p>
        </div>

        {/* Stat 2 */}
        <div className="rounded-3xl border border-slate-100 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Simulated Ledger</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-black text-blue-600 dark:text-cyan-400">
              {totalRevenue}
            </span>
            <span className="text-[9px] font-bold text-slate-400">INR</span>
          </div>
          <p className="text-[9px] text-slate-400 mt-1">Processed via Stripe API</p>
        </div>

        {/* Stat 3 */}
        <div className="rounded-3xl border border-slate-100 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Vessel Fleets</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-black text-slate-800 dark:text-white">
              {activeBoats}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              / {boats.length} registered
            </span>
          </div>
          <p className="text-[9px] text-slate-400 mt-1">{suspendedBoats} flagged or audited</p>
        </div>

        {/* Stat 4 */}
        <div className="rounded-3xl border border-slate-100 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase text-slate-400">Delhi Basin Severity</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-sans text-lg font-black text-slate-800 dark:text-white capitalize">
              {floodSeverity === 'boat_recommended' ? '🔴 Boat Needed' : floodSeverity === 'ankle_deep' ? '🟡 Ankle Deep' : '🟢 Dry'}
            </span>
          </div>
          <p className="text-[9px] text-slate-400 mt-1">Global surcharge modifier active</p>
        </div>

      </div>

      {/* Main Admin Console Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Panel 1: Registered Vessels & Fraud audit */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
            <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Anchor className="h-4.5 w-4.5 text-blue-500" /> Delhi Registered Fleet
            </h3>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-slate-800 dark:text-cyan-400 uppercase">
              Regulatory Audit
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y dark:divide-slate-800 space-y-3">
            {boats.map(b => (
              <div key={b.id} className="flex items-center justify-between pt-3 first:pt-0" id={`admin-boat-audit-${b.id}`}>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">{b.name}</p>
                  <p className="text-[10px] text-slate-400">
                    Captain: <span className="font-semibold text-slate-600 dark:text-slate-300">{b.captainName}</span> • Area: {b.operatingArea}
                  </p>
                  <div className="flex gap-1.5 pt-1">
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[8px] font-bold text-slate-500 dark:bg-slate-800">
                      Type: {b.type.toUpperCase()}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[8px] font-bold text-slate-500 dark:bg-slate-800">
                      Rate: {b.pricePerHour} INR/hr
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase ${
                    b.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40'
                  }`}>
                    {b.status}
                  </span>
                  
                  <button
                    onClick={() => {
                      toggleBoatStatus(b.id);
                      alert(`Listing "${b.name}" status toggled to ${b.status === 'active' ? 'suspended' : 'active'}. Owner has been notified via notification log.`);
                    }}
                    className={`rounded-xl px-2.5 py-1 text-[10px] font-black transition-all ${
                      b.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20'
                    }`}
                    id={`btn-admin-toggle-${b.id}`}
                  >
                    {b.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Users Registry */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
            <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-indigo-500" /> Delhi Maritime User Registry
            </h3>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase">
              Database Sync
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y dark:divide-slate-800 space-y-2">
            {users.map(u => (
              <div key={u.uid} className="flex items-center justify-between pt-2.5 first:pt-0" id={`admin-user-row-${u.uid}`}>
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">{u.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                  <p className="text-[9px] text-slate-400">ID: {u.uid}</p>
                </div>

                <span className={`rounded-xl px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                  u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40' :
                  u.role === 'owner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40' :
                  'bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-cyan-400'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Panel 3: Stripe payment history logs & bookings */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
          <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="h-4.5 w-4.5 text-emerald-500" /> Stripe Audit Trail (Simulated Transactions)
          </h3>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-mono">
            SECURE-API
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <EyeOff className="mx-auto h-6 w-6 text-slate-300 mb-1" />
            No Stripe payment logs verified by network.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5 font-extrabold">Stripe TX ID</th>
                  <th className="pb-2.5 font-extrabold">Passenger</th>
                  <th className="pb-2.5 font-extrabold">Chartered Vessel</th>
                  <th className="pb-2.5 font-extrabold">Settled Fare</th>
                  <th className="pb-2.5 font-extrabold">Status</th>
                  <th className="pb-2.5 font-extrabold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20" id={`admin-payment-log-${p.id}`}>
                    <td className="py-3 font-mono text-[10px] text-blue-600 dark:text-cyan-400">{p.transactionRef}</td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">{p.customerName}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{p.boatName}</td>
                    <td className="py-3 font-sans font-black text-slate-800 dark:text-white">{p.amount} INR</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Stripe Succeeded
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-[10px] text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
