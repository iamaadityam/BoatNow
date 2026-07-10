import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Boat, Booking } from '../types';
import { 
  PlusCircle, Anchor, Calendar, DollarSign, Users, Check, X, 
  MapPin, Clock, Waves, ClipboardList, ShieldAlert, AlertCircle 
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { 
    currentUser, boats, bookings, registerBoat, respondToBooking, 
    updateBoatAvailability, toggleBoatStatus 
  } = useApp();

  // Filter boats owned by current logged in owner
  const myBoats = boats.filter(b => b.ownerId === currentUser?.uid);
  
  // Filter bookings for boats owned by current owner
  const myBookings = bookings.filter(book => {
    const boat = boats.find(b => b.id === book.boatId);
    return boat?.ownerId === currentUser?.uid;
  });

  const [showAddBoat, setShowAddBoat] = useState(false);

  // New Boat form state
  const [boatName, setBoatName] = useState('');
  const [boatType, setBoatType] = useState<'canoe' | 'motorboat' | 'kayak' | 'shikara' | 'raft'>('canoe');
  const [capacity, setCapacity] = useState(4);
  const [price, setPrice] = useState(400);
  const [area, setArea] = useState('Connaught Place Basin');
  const [desc, setDesc] = useState('');
  const [isCovered, setIsCovered] = useState(false);
  const [isPetFriendly, setIsPetFriendly] = useState(true);
  const [isWheelchair, setIsWheelchair] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  // Maintenance blocker state
  const [selectedBoatForMaint, setSelectedBoatForMaint] = useState<string>('');
  const [maintDate, setMaintDate] = useState('');

  const handleCreateBoatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Choose nice presets based on boat type if none provided
    let finalImg = imgUrl;
    if (!finalImg) {
      if (boatType === 'motorboat') finalImg = '/images/boats/motorboat.jpg';
      else if (boatType === 'shikara') finalImg = '/images/boats/shikara.jpg';
      else if (boatType === 'kayak') finalImg = '/images/boats/kayak.jpg';
      else if (boatType === 'raft') finalImg = '/images/boats/raft.jpg';
      else finalImg = '/images/boats/canoe.jpg';
    }

    registerBoat({
      name: boatName,
      type: boatType,
      capacity,
      pricePerHour: price,
      imageUrl: finalImg,
      description: desc,
      isCovered,
      isPetFriendly,
      isWheelchairAccessible: isWheelchair,
      operatingArea: area,
      safetyEquipment: ['Oars', 'Life Jackets', 'Samosa Heater', 'Manual pump'],
      blockedDates: []
    });

    // Reset Form
    setBoatName('');
    setDesc('');
    setPrice(400);
    setCapacity(4);
    setIsCovered(false);
    setShowAddBoat(false);
  };

  const handleBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoatForMaint || !maintDate) return;

    const boat = boats.find(b => b.id === selectedBoatForMaint);
    if (!boat) return;

    const alreadyBlocked = boat.blockedDates.includes(maintDate);
    let updated: string[];
    if (alreadyBlocked) {
      updated = boat.blockedDates.filter(d => d !== maintDate);
      alert(`Date ${maintDate} unblocked for charters.`);
    } else {
      updated = [...boat.blockedDates, maintDate];
      alert(`Vessel maintenance scheduled on ${maintDate}. Calendar blocked.`);
    }

    updateBoatAvailability(selectedBoatForMaint, updated);
    setMaintDate('');
  };

  return (
    <div className="space-y-6">
      
      {/* Slogan Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl dark:bg-slate-950 border dark:border-slate-800">
        <div className="absolute right-0 top-0 opacity-10">
          <Waves className="h-44 w-44 rotate-12 text-blue-400" />
        </div>
        <div className="relative max-w-lg space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            ⚓ CAPTAIN LEDGER PORTAL
          </span>
          <h1 className="font-sans text-2xl font-black tracking-tight sm:text-3xl">
            Oar-Management Console
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Welcome, Captain. Monitor your charter receipts, manage incoming paddle requests, and list brand new flood-crossing vessels!
          </p>
        </div>
      </section>

      {/* Main Grid: Pending actions, block maintenance, active vessels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Register & Maintenance */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-blue-500" /> Crew Operations
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowAddBoat(true)}
                className="w-full rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 py-3 text-center text-xs font-black text-white hover:from-blue-700 hover:to-cyan-600 shadow-md shadow-blue-500/10"
                id="btn-trigger-register-boat"
              >
                Register a New Vessel ⛵
              </button>
            </div>
          </div>

          {/* Maintenance Period Blocker */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" /> Maintenance Calendars
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Toggle specific calendar dates as blocked/undergoing repairs so they can't be reserved during severe rainfalls.
            </p>

            {myBoats.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">No vessels listed yet.</p>
            ) : (
              <form onSubmit={handleBlockDate} className="space-y-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Select Vessel</label>
                  <select
                    value={selectedBoatForMaint}
                    onChange={(e) => setSelectedBoatForMaint(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    required
                  >
                    <option value="">-- Choose Boat --</option>
                    {myBoats.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Block Target Date</label>
                  <input
                    type="date"
                    value={maintDate}
                    onChange={(e) => setMaintDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  id="btn-toggle-maint"
                >
                  Block / Unblock Selected Date
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Right Columns: Bookings list & Boat Listings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Incoming Booking Requests */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-emerald-500" /> Passenger Request Board
            </h3>

            {myBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No charter bookings have been filed yet for your Connaught Place basins.
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map(book => (
                  <div 
                    key={book.id} 
                    className="rounded-2xl border border-slate-100 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-800/20"
                    id={`owner-book-row-${book.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans text-sm font-black text-slate-800 dark:text-white">{book.customerName}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            book.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            book.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-cyan-400' :
                            book.status === 'cancelled' ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' :
                            book.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950/40'
                          }`}>
                            {book.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Vessel Requested: {book.boatName}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Charter Fee</p>
                        <p className="font-sans text-sm font-black text-emerald-600">{book.totalPrice} INR</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono sm:grid-cols-4">
                      <div>📅 {book.date}</div>
                      <div>⏰ {book.startTime}</div>
                      <div>⏳ {book.hours} Hr(s)</div>
                      <div>🏷️ {book.paymentId ? 'Stripe Verified' : 'Awaiting Stripe'}</div>
                    </div>

                    {book.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t border-dashed dark:border-slate-800">
                        <button
                          onClick={() => respondToBooking(book.id, false)}
                          className="flex-1 rounded-xl bg-red-50 py-2 text-center text-xs font-black text-red-600 hover:bg-red-100 dark:bg-red-950/20"
                          id={`btn-reject-${book.id}`}
                        >
                          Reject Charter ✕
                        </button>
                        <button
                          onClick={() => respondToBooking(book.id, true)}
                          className="flex-1 rounded-xl bg-emerald-600 py-2 text-center text-xs font-black text-white hover:bg-emerald-700"
                          id={`btn-accept-${book.id}`}
                        >
                          Accept Charter ✓
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boat Listings List */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <h3 className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Waves className="h-4.5 w-4.5 text-blue-500" /> Your Active Vessels ({myBoats.length})
            </h3>

            {myBoats.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">You do not currently have any rowboats registered. Tap "Register a New Vessel" to start rowing!</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {myBoats.map(b => (
                  <div key={b.id} className="rounded-2xl border border-slate-100 p-3.5 space-y-2 dark:border-slate-800 dark:bg-slate-800/10">
                    <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={b.imageUrl} 
                        alt={b.name} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          let fallback = '/images/boats/canoe.jpg';
                          if (b.type === 'motorboat') fallback = '/images/boats/motorboat.jpg';
                          else if (b.type === 'shikara') fallback = '/images/boats/shikara.jpg';
                          else if (b.type === 'kayak') fallback = '/images/boats/kayak.jpg';
                          else if (b.type === 'raft') fallback = '/images/boats/raft.jpg';
                          target.src = fallback;
                        }}
                      />
                      <span className={`absolute right-2 top-2 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        b.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-sans text-sm font-black text-slate-800 dark:text-white">{b.name}</h4>
                      <p className="text-[10px] text-slate-400">Pricing: {b.pricePerHour} INR/hr • Area: {b.operatingArea}</p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t dark:border-slate-800">
                      <button
                        onClick={() => toggleBoatStatus(b.id)}
                        className={`w-full rounded-xl py-1.5 text-center text-xs font-bold transition-all ${
                          b.status === 'active'
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/20'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20'
                        }`}
                        id={`btn-toggle-owner-boat-${b.id}`}
                      >
                        {b.status === 'active' ? 'Suspend Vessel' : 'Activate Vessel'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Register a Boat Modal */}
      {showAddBoat && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border-t sm:border dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h3 className="font-sans text-base font-black text-slate-800 dark:text-white">Register Satirical Vessel</h3>
              <button 
                type="button"
                onClick={() => setShowAddBoat(false)}
                className="rounded-full bg-slate-100 p-1 hover:bg-slate-200 dark:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBoatSubmit} className="mt-4 space-y-4 text-xs">
              
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Vessel Name</label>
                <input
                  type="text"
                  required
                  value={boatName}
                  onChange={(e) => setBoatName(e.target.value)}
                  placeholder="e.g. Ganga Cruise DeLuxe, Water Pothole Master"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  id="input-new-boat-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Vessel Type</label>
                  <select
                    value={boatType}
                    onChange={(e) => setBoatType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="canoe">Canoe (Standard Paddle)</option>
                    <option value="motorboat">Motorboat (Rapid Speed)</option>
                    <option value="shikara">Shikara (Scenic Comfort)</option>
                    <option value="kayak">Kayak (Lone Wolf Solo)</option>
                    <option value="raft">Raft (Heavy Duty SOS)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Hourly Pricing (INR)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    max="2000"
                    value={price}
                    onChange={(e) => setPrice(+e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Max Passenger Capacity</label>
                  <select
                    value={capacity}
                    onChange={(e) => setCapacity(+e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    {[1, 2, 3, 4, 6, 8, 10].map(c => (
                      <option key={c} value={c}>{c} Pax</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Operating Basins</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Connaught Place Circle"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Vessel Photo URL (Optional)</label>
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-mono dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Vessel Bio / Slogan</label>
                <textarea
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe your vessel's pothole dodging capability and oar durability..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 h-16"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={isCovered}
                    onChange={(e) => setIsCovered(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Rain Canopy</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={isPetFriendly}
                    onChange={(e) => setIsPetFriendly(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Pet Friendly</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={isWheelchair}
                    onChange={(e) => setIsWheelchair(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Wheelchair Accessible</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBoat(false)}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 text-center font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel Listing
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 py-3 text-center font-black text-white hover:from-blue-700 hover:to-cyan-600"
                  id="btn-confirm-register-boat"
                >
                  List Rowboat ⛵
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
