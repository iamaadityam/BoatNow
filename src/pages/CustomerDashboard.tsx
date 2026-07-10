import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Boat, Booking } from '../types';
import { MapContainer } from '../components/MapContainer';
import { Filters } from '../components/Filters';
import { StripeCheckout } from '../components/StripeCheckout';
import { 
  Compass, ShieldCheck, Heart, AlertTriangle, HelpCircle, 
  ChevronRight, Calendar, Star, Users, MapPin, Anchor, Info,
  Sparkles, CheckCircle2, Clock, Volume2, ThumbsUp, AlertCircle, EyeOff,
  Trophy, CloudRain, Sun, Waves
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    boats, bookings, createBooking, cancelBooking, addReview,
    floodSeverity, setFloodSeverity, sosActive, triggerSOS, clearSOS,
    activeTrackingBooking, trackingBoatCoords, theme
  } = useApp();

  // Selected Pickup / Map Coordinates (default central)
  const [pickupCoords, setPickupCoords] = useState({ x: 50, y: 50 });

  // Dynamic custom state for Puddle Severity simulator
  const [puddleDepth, setPuddleDepth] = useState<number>(
    floodSeverity === 'dry' ? 0.4 : floodSeverity === 'ankle_deep' ? 2.5 : 8.2
  );
  const [selectedRouteId, setSelectedRouteId] = useState<string>('cp_underpass');
  const [isLightning, setIsLightning] = useState<boolean>(false);

  // Dynamic audio cue simulator
  const playMonsoonBeep = (type: 'thunder' | 'drizzle' | 'surge') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'thunder') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1.2);
        
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);
      } else if (type === 'surge') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
        
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // AudioContext failed
    }
  };

  const DELHI_ROUTES = [
    { id: 'cp_underpass', name: 'CP Pillar 124 to Super-Market Basin', baseDist: 1.2, basePrice: 200 },
    { id: 'lajpat_lake', name: 'Lajpat Flyover to Central Market Pool', baseDist: 3.4, basePrice: 450 },
    { id: 'noida_logway', name: 'Noida Sector 62 Balcony to Harbor', baseDist: 5.8, basePrice: 700 },
    { id: 'iit_puddle', name: 'IIT Flyover Rapids to Hauz Khas Water-Park', baseDist: 2.5, basePrice: 350 },
  ];

  const handleDepthChange = (depth: number) => {
    setPuddleDepth(depth);
    if (depth <= 1.5) {
      if (floodSeverity !== 'dry') setFloodSeverity('dry');
    } else if (depth <= 5.0) {
      if (floodSeverity !== 'ankle_deep') setFloodSeverity('ankle_deep');
    } else {
      if (floodSeverity !== 'boat_recommended') setFloodSeverity('boat_recommended');
    }
  };

  const getPuddleAdvisory = (depth: number) => {
    if (depth <= 0.5) return '☀️ Dry. Captains playing Ludo & drinking paan on the boardwalk.';
    if (depth <= 1.5) return '💧 Light drizzle. Shallow water logs. Cycle-rickshaws still functional.';
    if (depth <= 3.5) return '🟡 Exhaust pipe alert! Sedan owners are sweating. Active puddle bypass advised.';
    if (depth <= 5.5) return '🌧️ Bumper deep water. Scooters stalled near Lajpat. Rowing is highly lucrative.';
    if (depth <= 8.5) return '🚨 Submarine mode! SUVs are floating. Connaught Place arches function as piers.';
    return '⛈️ Atlantis of Delhi. Class IV white-water rapids active. Rowers are supreme rulers.';
  };

  const triggerCloudburst = () => {
    setIsLightning(true);
    playMonsoonBeep('thunder');
    setTimeout(() => setIsLightning(false), 150);
    setTimeout(() => {
      setIsLightning(true);
      setTimeout(() => setIsLightning(false), 100);
    }, 250);
    
    // Set depth to maximum!
    handleDepthChange(11.8);
  };

  // Filter States
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [minCapacity, setMinCapacity] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [onlyCovered, setOnlyCovered] = useState<boolean>(false);
  const [onlyPetFriendly, setOnlyPetFriendly] = useState<boolean>(false);
  const [onlyWheelchair, setOnlyWheelchair] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Boat for detail modal
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);

  // Booking detail inputs
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-10');
  const [selectedHour, setSelectedHour] = useState<string>('10:00');
  const [bookingDuration, setBookingDuration] = useState<number>(2);
  const [needLifeJackets, setNeedLifeJackets] = useState<boolean>(true);

  // Stripe Modal
  const [pendingPaymentBooking, setPendingPaymentBooking] = useState<Booking | null>(null);

  // Review Modal State
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [revClean, setRevClean] = useState(5);
  const [revPunct, setRevPunct] = useState(5);
  const [revSafe, setRevSafe] = useState(5);
  const [revOver, setRevOver] = useState(5);
  const [revComment, setRevComment] = useState('');

  // Slogan rotation
  const [sloganIndex, setSloganIndex] = useState(0);

  // Dynamic Achievements Evaluation
  const achievements = [
    {
      id: 'ach-pioneer',
      title: 'Puddle Pioneer',
      description: 'Chartered an emergency rowboat ride.',
      badge: '🛟',
      howTo: 'Book 1 boat to unlock.',
      unlocked: bookings.length > 0
    },
    {
      id: 'ach-monsoon-vet',
      title: 'Monsoon Veteran',
      description: 'Navigated the streets during critical deep flooding.',
      badge: '⛈️',
      howTo: 'Book with deep severity active.',
      unlocked: bookings.some(b => b.status === 'confirmed' || b.status === 'completed') && floodSeverity === 'boat_recommended'
    },
    {
      id: 'ach-frequent-floater',
      title: 'Frequent Floater',
      description: 'Logged 3 or more total entries on your water ledger.',
      badge: '🚣',
      howTo: 'Log 3 rides on BoatNow.',
      unlocked: bookings.length >= 3
    },
    {
      id: 'ach-duck',
      title: 'Duck Approved',
      description: 'Gave a captain feedback and supported samosa funds.',
      badge: '🦆',
      howTo: 'Leave a professional star review.',
      unlocked: bookings.some(b => b.status === 'completed') || bookings.length > 1
    },
    {
      id: 'ach-survivalist',
      title: 'Puddle Survivor',
      description: 'Successfully deployed nearest canoe via critical SOS mode.',
      badge: '🆘',
      howTo: 'Trigger the SOS alarm.',
      unlocked: sosActive
    }
  ];

  // Filter logic
  const filteredBoats = boats.filter(b => {
    if (b.status !== 'active') return false;
    if (b.pricePerHour > maxPrice) return false;
    if (b.capacity < minCapacity) return false;
    if (onlyCovered && !b.isCovered) return false;
    if (onlyPetFriendly && !b.isPetFriendly) return false;
    if (onlyWheelchair && !b.isWheelchairAccessible) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = b.name.toLowerCase().includes(q);
      const matchesCaptain = b.captainName.toLowerCase().includes(q);
      const matchesArea = b.operatingArea.toLowerCase().includes(q);
      if (!matchesName && !matchesCaptain && !matchesArea) return false;
    }
    return true;
  });

  // Calculate instant quote
  const getInstantQuote = (boat: Boat) => {
    const base = boat.pricePerHour * bookingDuration;
    const modifier = floodSeverity === 'boat_recommended' ? 1.2 : floodSeverity === 'ankle_deep' ? 1.0 : 0.8;
    return Math.round(base * modifier);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoat) return;
    try {
      const bObj = createBooking(
        selectedBoat.id,
        selectedDate,
        selectedHour,
        bookingDuration,
        needLifeJackets
      );
      setPendingPaymentBooking(bObj);
      setSelectedBoat(null); // close detail modal
    } catch (err: any) {
      alert(err.message || 'Slot occupied. Please choose another duration!');
    }
  };

  const handleStripeSuccess = () => {
    setPendingPaymentBooking(null);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingBooking) return;
    addReview(
      ratingBooking.boatId,
      revClean,
      revPunct,
      revSafe,
      revOver,
      revComment
    );
    // Mark booking status as completed so it doesn't prompt again
    setRatingBooking(null);
    setRevComment('');
    alert('Captain thank you for your review! Samosa funds updated.');
  };

  // Weather Customizations (Premium Vibe changes based on flood level)
  const getWeatherTheme = () => {
    switch (floodSeverity) {
      case 'dry':
        return {
          bg: 'from-amber-400 via-orange-500 to-yellow-500 shadow-amber-500/10',
          title: 'Sunny Day? Sail the Connaught Canal!',
          sub: 'Roads are dry and Uber fares are normal. Book a premium leisure cruise anyway just to gloat at SUV owners.',
          badge: '☀️ Calm & Leisurely',
          animation: null
        };
      case 'ankle_deep':
        return {
          bg: 'from-blue-600 via-blue-500 to-cyan-500 shadow-blue-500/10',
          title: 'Flooded? We\'ll Float You There.',
          sub: 'Standard taxis are already stuck near Lajpat Nagar. Skip the corporate traffic and row directly to your destination.',
          badge: '🌧️ Active Monsoons',
          animation: 'rain-light'
        };
      case 'boat_recommended':
      default:
        return {
          bg: 'from-slate-900 via-indigo-950 to-blue-900 shadow-indigo-950/25 border border-blue-900/30',
          title: 'Deep Monsoon Alert: CP Basin Activated!',
          sub: 'Warning: Water level has breached bumper levels. Roads have transitioned into Class III rapids. Standard oarsmen are on double speed.',
          badge: '🚨 Critical Deluge Mode (+20% Surge)',
          animation: 'rain-heavy'
        };
    }
  };

  const weatherTheme = getWeatherTheme();

  return (
    <div className="space-y-6 relative">
      {isLightning && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none opacity-90 transition-opacity" />
      )}
      
      {/* Humorous Banner / Dynamic Environment Weather Hero */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${weatherTheme.bg} p-6 text-white shadow-lg transition-all duration-700`}>
        
        {/* Particle/Rain Overlay container */}
        {weatherTheme.animation === 'rain-heavy' && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:10px_40px] animate-[heavyrain_0.8s_linear_infinite]"></div>
          </div>
        )}
        {weatherTheme.animation === 'rain-light' && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:15px_60px] animate-[heavyrain_1.5s_linear_infinite]"></div>
          </div>
        )}

        <div className="absolute right-0 top-0 opacity-10">
          <Anchor className="h-44 w-44 rotate-12 animate-[slowspin_20s_linear_infinite]" />
        </div>
        <div className="relative max-w-lg space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
            {weatherTheme.badge}
          </span>
          <h1 className="font-sans text-3xl font-black tracking-tight sm:text-4xl">
            "{weatherTheme.title}"
          </h1>
          <p className="text-xs font-semibold text-blue-50/90 leading-relaxed max-w-sm">
            {weatherTheme.sub}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-xl bg-white/10 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
              🚣 100% Certified Paddles
            </span>
            <span className="rounded-xl bg-white/10 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
              🍛 Free Samosas & Chai
            </span>
          </div>
        </div>
      </section>

      {/* Emergency SOS & Flood Severity Controls Dashboard (Bento layout) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        
        {/* Card 1: SOS Panic Button */}
        <div className="rounded-3xl border border-red-100 bg-red-50/50 p-5 dark:border-red-950/40 dark:bg-red-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">🚨 ONE-CLICK MARITIME RESCUE</span>
            <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[8px] font-bold text-red-700 uppercase tracking-widest dark:bg-red-900/40 dark:text-red-300">CRITICAL</span>
          </div>
          <h3 className="mt-2 font-sans text-base font-black text-slate-800 dark:text-white">Stranded / Heavy Deluges</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Instantly dispatch the absolute closest vessel directly to your exact coordinates with lifejackets deployed.
          </p>
          <div className="mt-4 flex gap-2">
            {sosActive ? (
              <button
                onClick={clearSOS}
                className="w-full rounded-2xl bg-slate-800 py-3 text-center text-xs font-black text-white hover:bg-slate-900 dark:bg-slate-700 shadow-md transition-all"
                id="btn-clear-sos"
              >
                De-escalate SOS Mode
              </button>
            ) : (
              <button
                onClick={() => {
                  const b = triggerSOS();
                  if (!b) {
                    alert('No active captains are near the CP basin. Try swimming!');
                  } else {
                    alert('🛟 EMERGENCY SOS SENT! Captain Rajesh is finishing his ginger tea and will steer your way instantly!');
                  }
                }}
                className="w-full rounded-2xl bg-red-600 py-3 text-center text-xs font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all animate-pulse"
                id="btn-trigger-sos"
              >
                Deploy Nearest Canoe Now!
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Interactive Flood Level Simulator */}
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/20 p-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950/40 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest">🌦️ PUDDLE SEVERITY SIMULATOR</span>
              <button 
                onClick={triggerCloudburst}
                className="inline-flex items-center gap-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 transition-all shadow shadow-amber-500/30"
                title="Simulate sudden thunderstorm & lightning strike"
              >
                ⛈️ Cloudburst!
              </button>
            </div>
            
            {/* Quick Severity Buttons */}
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                { id: 'dry', label: '🟢 Dry', targetDepth: 0.4 },
                { id: 'ankle_deep', label: '🟡 Ankle', targetDepth: 2.5 },
                { id: 'boat_recommended', label: '🔴 Deep', targetDepth: 8.2 }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    handleDepthChange(lvl.targetDepth);
                    playMonsoonBeep('drizzle');
                  }}
                  className={`rounded-xl py-1 text-center text-[11px] font-bold transition-all border ${
                    floodSeverity === lvl.id
                      ? 'border-blue-600 bg-blue-100 text-blue-700 dark:border-cyan-500 dark:bg-slate-800 dark:text-cyan-400 scale-105 shadow-sm'
                      : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                  id={`btn-severity-${lvl.id}`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Depth Slider */}
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Puddle Depth Gauge:</span>
                <span className="font-black font-mono text-blue-600 dark:text-cyan-400">{puddleDepth.toFixed(1)} feet</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="12.0"
                step="0.1"
                value={puddleDepth}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  handleDepthChange(val);
                }}
                className="w-full h-1.5 bg-blue-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
              />
            </div>

            {/* Dynamic Advisory Box */}
            <div className="mt-3 rounded-2xl bg-blue-50/50 p-2.5 dark:bg-slate-800/30 border border-blue-100/30">
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                {getPuddleAdvisory(puddleDepth)}
              </p>
            </div>
          </div>

          {/* Mini-Route Fare surge estimator */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">
              📍 Live Route Price Estimator
            </label>
            <div className="flex gap-1.5">
              <select
                value={selectedRouteId}
                onChange={(e) => {
                  setSelectedRouteId(e.target.value);
                  playMonsoonBeep('surge');
                }}
                className="flex-1 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                {DELHI_ROUTES.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
            
            {(() => {
              const route = DELHI_ROUTES.find(r => r.id === selectedRouteId) || DELHI_ROUTES[0];
              const multiplier = floodSeverity === 'boat_recommended' ? 1.2 : floodSeverity === 'dry' ? 0.8 : 1.0;
              const estPrice = Math.round(route.basePrice * multiplier);
              return (
                <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/20 px-2 py-1 rounded-xl">
                  <span className="text-slate-400">
                    Oar Fare ({route.baseDist}km):
                  </span>
                  <span className="font-black text-blue-600 dark:text-cyan-400">
                    ₹{estPrice} <span className="text-[9px] font-normal text-slate-400">({multiplier.toFixed(1)}x)</span>
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Card 3: Live GPS Tracking & Active Dispatch Stats */}
        <div className="rounded-3xl border border-blue-50 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">🛶 LIVE DISPATCH STATS</span>
          {activeTrackingBooking ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <p className="text-xs font-black text-slate-800 dark:text-white">Vessel en-route!</p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Captain is currently rowing. Dynamic GPS tracking coordinates set at user coordinate (50, 50).
              </p>
              <div className="rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-bold flex justify-between animate-pulse">
                <span>ETA Splash:</span>
                <span>{activeTrackingBooking.etaMinutes || 1} min(s)</span>
              </div>
            </div>
          ) : (
            <div className="mt-2 py-4 text-center">
              <EyeOff className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-600 mb-1" />
              <p className="text-xs text-slate-400">No active dispatch or paddle tracking in progress.</p>
            </div>
          )}
        </div>

      </div>

      {/* Main Interactive Map Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-lg font-black text-slate-800 dark:text-white">Active Flooded Basin Grid</h2>
          <span className="text-xs text-slate-400">Interactive custom GPS coordinates</span>
        </div>
        <MapContainer 
          selectedBoatId={selectedBoat?.id}
          onSelectBoat={(id) => {
            const b = boats.find(boat => boat.id === id);
            if (b) setSelectedBoat(b);
          }}
          pickupCoords={pickupCoords}
          setPickupCoords={setPickupCoords}
        />
      </div>

      {/* Navigation Filter Panel */}
      <Filters 
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minCapacity={minCapacity}
        setMinCapacity={setMinCapacity}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onlyCovered={onlyCovered}
        setOnlyCovered={setOnlyCovered}
        onlyPetFriendly={onlyPetFriendly}
        setOnlyPetFriendly={setOnlyPetFriendly}
        onlyWheelchair={onlyWheelchair}
        setOnlyWheelchair={setOnlyWheelchair}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Vessel Grid Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-lg font-black text-slate-800 dark:text-white">
            Captains Ready to Row ({filteredBoats.length})
          </h3>
          <span className="text-xs text-slate-400">Tap card to inspect boat layout</span>
        </div>

        {filteredBoats.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-sm dark:border-slate-800">
            <Info className="mx-auto h-6 w-6 text-slate-400 mb-2" />
            <p className="font-bold text-slate-700 dark:text-slate-300">All oars dried out!</p>
            <p className="text-xs text-slate-400 mt-1">No custom boats match your specified flood filtration filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBoats.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBoat(b)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 cursor-pointer hover:border-blue-300 dark:hover:border-cyan-800"
                style={{ 
                  animation: 'harbor-drift 6s ease-in-out infinite', 
                  animationDelay: b.id === 'boat-1' ? '0s' : b.id === 'boat-2' ? '1.2s' : b.id === 'boat-3' ? '2.5s' : b.id === 'boat-4' ? '3.8s' : '4.9s'
                }}
                id={`boat-card-${b.id}`}
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={b.imageUrl} 
                    alt={b.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  
                  {/* Distance bubble */}
                  <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    📍 {b.distanceKm} km away
                  </span>

                  {/* Hourly Rate bubble */}
                  <span className="absolute right-3 top-3 rounded-xl bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-md">
                    {b.pricePerHour} INR / hr
                  </span>
                </div>

                {/* Body Details */}
                <div className="flex flex-1 flex-col p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-sans text-sm font-black text-slate-800 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                      {b.name}
                    </h4>
                  </div>

                  {/* Captain profile preview */}
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-800/40">
                    <img 
                      src={b.captainAvatarUrl} 
                      alt={b.captainName} 
                      className="h-6 w-6 rounded-full object-cover border" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        const fallbackAvatars = [
                          '/images/captains/verma.jpg',
                          '/images/captains/singh.jpg',
                          '/images/captains/mukherjee.jpg',
                          '/images/captains/rajesh.jpg',
                          '/images/captains/default.jpg'
                        ];
                        const hash = (b.captainName || 'captain').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        target.src = fallbackAvatars[hash % fallbackAvatars.length];
                      }}
                    />
                    <div className="text-left flex-1">
                      <p className="text-[11px] font-black text-slate-800 dark:text-slate-200">{b.captainName}</p>
                      <p className="text-[9px] text-slate-400">Delhi-CP licensed oarsman</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {b.rating}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  {/* Badges footer */}
                  <div className="mt-auto pt-2 flex flex-wrap gap-1">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider dark:bg-slate-800 dark:text-cyan-400 capitalize">
                      {b.type}
                    </span>
                    <span className="rounded bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800 dark:text-slate-400">
                      👥 Max {b.capacity}
                    </span>
                    {b.isCovered && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase tracking-wider dark:bg-slate-800 dark:text-emerald-400">
                        🌂 Covered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🏆 Achievements & Puddle Milestones Room */}
      <section className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-black text-slate-800 dark:text-white">Your Puddle Navigation Badges</h3>
            <p className="text-[10px] text-slate-400">Earned Series-A traveler milestones & satirical awards</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`relative overflow-hidden rounded-2xl border p-4 text-center transition-all ${
                ach.unlocked
                  ? 'bg-white border-amber-200 dark:bg-slate-900 dark:border-amber-900/40 shadow-sm scale-100'
                  : 'bg-slate-100/40 border-slate-200/50 dark:bg-slate-950/40 dark:border-slate-900/50 opacity-60'
              }`}
            >
              {/* Badge Visual */}
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-xl shadow-inner dark:bg-slate-800 mb-2">
                {ach.badge}
              </div>

              {/* Title */}
              <h4 className={`text-xs font-black ${ach.unlocked ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {ach.title}
              </h4>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                {ach.unlocked ? ach.description : ach.howTo}
              </p>

              {/* Status indicator */}
              <div className="mt-2.5">
                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                  ach.unlocked
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                }`}>
                  {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User Booking History Tracker */}
      <section className="space-y-4">
        <h3 className="font-sans text-lg font-black text-slate-800 dark:text-white">Your Puddle Booking Ledger ({bookings.length})</h3>
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-100 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
            No active water logs recorded. Launch a charter using the catalog above!
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(book => (
              <div 
                key={book.id} 
                className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
                id={`booking-ledger-${book.id}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-black text-slate-800 dark:text-white">{book.boatName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      book.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' :
                      book.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-cyan-400' :
                      book.status === 'cancelled' ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500' :
                      book.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                    <span>📅 {book.date}</span>
                    <span>⏰ {book.startTime}</span>
                    <span>⏳ {book.hours} hrs</span>
                    <span>📍 CP Basin Grid</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3 sm:border-none sm:pt-0 gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Total Charged</p>
                    <p className="font-sans text-sm font-black text-blue-600 dark:text-cyan-400">{book.totalPrice} INR</p>
                  </div>

                  <div className="flex gap-2">
                    {/* Pay Button if pending payment */}
                    {book.status === 'pending' && !book.paymentId && (
                      <button
                        onClick={() => setPendingPaymentBooking(book)}
                        className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white hover:bg-blue-700"
                        id={`btn-pay-booking-${book.id}`}
                      >
                        Complete Payment 💳
                      </button>
                    )}

                    {/* Rate Captain Button if completed */}
                    {book.status === 'completed' && (
                      <button
                        onClick={() => setRatingBooking(book)}
                        className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-50 dark:border-slate-800 dark:text-cyan-400"
                        id={`btn-rate-captain-${book.id}`}
                      >
                        Rate Captain ⭐
                      </button>
                    )}

                    {/* Cancel Button */}
                    {(book.status === 'pending' || book.status === 'confirmed') && (
                      <button
                        onClick={() => cancelBooking(book.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                        id={`btn-cancel-booking-${book.id}`}
                      >
                        Cancel Row
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODALS --- */}

      {/* 1. Detailed Boat page / Booking Calendar overlay */}
      {selectedBoat && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white overflow-y-auto max-h-[92vh] sm:max-h-[90vh] shadow-2xl dark:bg-slate-900 border-t sm:border dark:border-slate-800">
            
            {/* Header Image Gallery mockup */}
            <div className="relative h-56 bg-slate-100">
              <img 
                src={selectedBoat.imageUrl} 
                alt={selectedBoat.name} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  let fallback = '/images/boats/canoe.jpg';
                  if (selectedBoat.type === 'motorboat') fallback = '/images/boats/motorboat.jpg';
                  else if (selectedBoat.type === 'shikara') fallback = '/images/boats/shikara.jpg';
                  else if (selectedBoat.type === 'kayak') fallback = '/images/boats/kayak.jpg';
                  else if (selectedBoat.type === 'raft') fallback = '/images/boats/raft.jpg';
                  target.src = fallback;
                }}
              />
              <button 
                onClick={() => setSelectedBoat(null)}
                className="absolute right-4 top-4 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 backdrop-blur-md"
                id="btn-close-boat-details"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 rounded-xl bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                ⭐ {selectedBoat.rating} ({selectedBoat.reviewsCount} CP reviews)
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-sans text-xl font-black text-slate-800 dark:text-white">{selectedBoat.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Operating Area: {selectedBoat.operatingArea}</p>
              </div>

              {/* Captain Profile details */}
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50/50 p-3 dark:bg-slate-800/40">
                <img 
                  src={selectedBoat.captainAvatarUrl} 
                  alt={selectedBoat.captainName} 
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-400" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    const fallbackAvatars = [
                      '/images/captains/verma.jpg',
                      '/images/captains/singh.jpg',
                      '/images/captains/mukherjee.jpg',
                      '/images/captains/rajesh.jpg',
                      '/images/captains/default.jpg'
                    ];
                    const hash = (selectedBoat.captainName || 'captain').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    target.src = fallbackAvatars[hash % fallbackAvatars.length];
                  }}
                />
                <div className="text-left flex-1">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white">{selectedBoat.captainName}</h4>
                  <p className="text-[10px] text-slate-500">Delhi Oarsman Guild • Over 140 floods salvaged</p>
                </div>
                <div className="rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                  Rating: {selectedBoat.captainRating} ★
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Vessel Logistics</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/20">
                    <p className="text-slate-400 text-[10px]">Max Seating</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{selectedBoat.capacity} passengers</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/20">
                    <p className="text-slate-400 text-[10px]">Vessel Canopy</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{selectedBoat.isCovered ? 'Heavy rainproof canopy' : 'Open-sky canoe style'}</p>
                  </div>
                </div>
              </div>

              {/* Safety Checklist */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Safety Equipment Checklist</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBoat.safetyEquipment.map((eq, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                      ✔ {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                {selectedBoat.description}
              </p>

              {/* Real-Time Availability Calendar inputs */}
              <form onSubmit={handleBookSubmit} className="border-t pt-4 space-y-4">
                <h4 className="font-sans text-xs font-black uppercase text-slate-400 tracking-wider">Real-Time Charter Chartering</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Select Date</label>
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Start Time (Hour)</label>
                    <select
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(hr => (
                        <option key={hr} value={hr}>{hr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Charter Duration</label>
                    <select
                      value={bookingDuration}
                      onChange={(e) => setBookingDuration(+e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {[1, 2, 3, 4, 6, 8].map(d => (
                        <option key={d} value={d}>{d} hour{d > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Life jackets toggle */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Emergency Vests</label>
                    <div className="flex items-center h-[34px]">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={needLifeJackets}
                          onChange={(e) => setNeedLifeJackets(e.target.checked)}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Life Vests (Free)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pricing summary */}
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Bill</p>
                    <p className="font-sans text-lg font-black text-slate-800 dark:text-white">{getInstantQuote(selectedBoat)} INR</p>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-extrabold text-blue-700 uppercase dark:bg-slate-800 dark:text-cyan-400">
                    {floodSeverity === 'boat_recommended' ? 'Monsoon Surge Factor (+20%)' : 'Standard Rate'}
                  </span>
                </div>

                {/* Submit row */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBoat(null)}
                    className="flex-1 rounded-2xl bg-slate-100 py-3 text-center text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                  >
                    Back to Basin Catalog
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 py-3 text-center text-xs font-black text-white hover:from-blue-700 hover:to-cyan-600"
                    id="btn-charter-submit"
                  >
                    Charter Vessel 🛶
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Stripe Checkout Integration Modal */}
      {pendingPaymentBooking && (
        <StripeCheckout 
          booking={pendingPaymentBooking}
          onSuccess={handleStripeSuccess}
          onClose={() => setPendingPaymentBooking(null)}
        />
      )}

      {/* 3. Rate Captain Review Modal */}
      {ratingBooking && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm">
          <form onSubmit={handleReviewSubmit} className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border-t sm:border dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <h3 className="font-sans text-base font-black text-slate-800 dark:text-white">Submit Captain Review</h3>
              <button 
                type="button"
                onClick={() => setRatingBooking(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <p className="my-3 text-xs text-slate-500 leading-normal">
              Rate your splash trip with <strong>{ratingBooking.boatName}</strong>. All feedback helps Captain Verma afford better sunscreen!
            </p>

            <div className="space-y-4">
              
              {/* Star controls */}
              {[
                { label: 'Overall Splash Quality', val: revOver, set: setRevOver },
                { label: 'Canoe Cleanliness & Odor', val: revClean, set: setRevClean },
                { label: 'Captain Punctuality', val: revPunct, set: setRevPunct },
                { label: 'Water Safety & Life Jacket fit', val: revSafe, set: setRevSafe }
              ].map((rate, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600 dark:text-slate-300">{rate.label}</span>
                    <span className="font-bold text-amber-500">{rate.val} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => rate.set(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`h-5 w-5 ${star <= rate.val ? 'fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Comment text */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Share your satirical story
                </label>
                <textarea
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="e.g. Captain Verma served hot pakoras and paddled like a machine through CP!"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 h-20"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 py-3 text-center text-xs font-black text-white"
                id="btn-submit-review"
              >
                Submit Row Log ⭐
              </button>

            </div>
          </form>
        </div>
      )}

      {/* Custom Styles for Weather & Harbor physics animations */}
      <style>{`
        @keyframes slowspin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes heavyrain {
          0% { background-position: 0px 0px; }
          100% { background-position: 20px 400px; }
        }
        @keyframes harbor-drift {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-0.5deg); }
          50% { transform: translateY(1px) rotate(0.2deg); }
          75% { transform: translateY(-3px) rotate(-0.3deg); }
        }
      `}</style>

    </div>
  );
};
