import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Boat, Booking, Review, PaymentLog, SystemNotification, UserProfile, UserRole, FloodSeverity, BoatType } from '../types';
import { INITIAL_BOATS, INITIAL_REVIEWS } from '../data';

interface AppContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  boats: Boat[];
  bookings: Booking[];
  payments: PaymentLog[];
  notifications: SystemNotification[];
  reviews: Review[];
  floodSeverity: FloodSeverity;
  theme: 'light' | 'dark';
  sosActive: boolean;
  activeTrackingBooking: Booking | null;
  trackingBoatCoords: { x: number; y: number } | null;
  
  // Auth Actions
  setCurrentUser: (user: UserProfile | null) => void;
  registerUser: (name: string, email: string, role: UserRole, phone?: string) => UserProfile;
  loginUser: (email: string) => boolean;
  logoutUser: () => void;
  switchRole: (role: UserRole) => void;
  
  // Boat Actions
  registerBoat: (boatData: Omit<Boat, 'id' | 'ownerId' | 'ownerName' | 'rating' | 'reviewsCount' | 'distanceKm' | 'coordinates' | 'captainRating' | 'captainAvatarUrl' | 'status'>) => void;
  updateBoatAvailability: (boatId: string, blockedDates: string[]) => void;
  toggleBoatStatus: (boatId: string) => void; // Admin/Owner: Toggle active/suspended
  
  // Booking Actions
  createBooking: (boatId: string, date: string, startTime: string, hours: number, needLifeJackets: boolean) => Booking;
  cancelBooking: (bookingId: string) => void;
  respondToBooking: (bookingId: string, accept: boolean) => void;
  triggerSOS: () => Booking | null;
  clearSOS: () => void;
  
  // Payment Actions
  processStripePayment: (bookingId: string, paymentMethod: string, cardNumber: string) => Promise<PaymentLog>;
  
  // Review Actions
  addReview: (boatId: string, cleanliness: number, punctuality: number, safety: number, overall: number, comment: string) => void;
  
  // Settings Actions
  setFloodSeverity: (severity: FloodSeverity) => void;
  toggleTheme: () => void;
  markNotificationsAsRead: () => void;
  addNotification: (userId: string, title: string, message: string, type: SystemNotification['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [currentUser, setCurrentUserInternal] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentLog[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [floodSeverity, setFloodSeverityState] = useState<FloodSeverity>('ankle_deep');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(null);
  const [trackingBoatCoords, setTrackingBoatCoords] = useState<{ x: number; y: number } | null>(null);

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    // 1. Theme
    const storedTheme = localStorage.getItem('bn_theme');
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // 2. Flood Severity
    const storedSeverity = localStorage.getItem('bn_flood_severity') as FloodSeverity;
    if (storedSeverity) setFloodSeverityState(storedSeverity);

    // 3. Load or Initialize Users
    const storedUsers = localStorage.getItem('bn_users');
    let loadedUsers: UserProfile[] = [];
    if (storedUsers) {
      loadedUsers = JSON.parse(storedUsers);
    } else {
      loadedUsers = [
        { uid: 'cust-1', name: 'Aaditya Malhotra', email: 'malhotraaaditya1.m@gmail.com', role: 'customer', createdAt: new Date().toISOString(), phone: '+91 98765 43210' },
        { uid: 'owner-verma', name: 'Captain Verma', email: 'verma@boatnow.com', role: 'owner', createdAt: new Date().toISOString(), phone: '+91 99999 88888' },
        { uid: 'owner-singh', name: 'Captain Singh', email: 'singh@boatnow.com', role: 'owner', createdAt: new Date().toISOString(), phone: '+91 98888 77777' },
        { uid: 'admin-1', name: 'Super Admin', email: 'admin@boatnow.com', role: 'admin', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('bn_users', JSON.stringify(loadedUsers));
    }
    setUsers(loadedUsers);

    // 4. Current User
    const storedCurrentUser = localStorage.getItem('bn_current_user');
    if (storedCurrentUser) {
      setCurrentUserInternal(JSON.parse(storedCurrentUser));
    } else {
      // Default to Aaditya Malhotra customer for zero-config immediate access
      const defaultUser = loadedUsers.find(u => u.uid === 'cust-1') || loadedUsers[0];
      setCurrentUserInternal(defaultUser);
      localStorage.setItem('bn_current_user', JSON.stringify(defaultUser));
    }

    // 5. Boats
    const storedBoats = localStorage.getItem('bn_boats');
    if (storedBoats) {
      try {
        const parsedBoats = JSON.parse(storedBoats) as Boat[];
        const upgraded = parsedBoats.map(b => {
          let url = b.imageUrl;
          let capUrl = b.captainAvatarUrl;
          if (url.includes('photo-1540959733332-eab4deceeaf7') || url.includes('photo-1505244208262-191301f22ced') || url.includes('amazon') || url.includes('I/81HVM5DoAQL')) {
            url = '/images/boats/canoe.jpg';
          } else if (url.includes('photo-1567899378494-47b22a2ae96a') || url.includes('photo-1569263979104-865ab7cd8d13')) {
            url = '/images/boats/motorboat.jpg';
          } else if (url.includes('photo-1590490360182-c33d57733427') || url.includes('photo-1621252179027-94459d278660')) {
            url = '/images/boats/shikara.jpg';
          } else if (url.includes('photo-1517176118179-c554e7686550') || url.includes('photo-1500375592092-40eb2168fd21') || url.includes('photo-1544551763-46a013bb70d5')) {
            url = '/images/boats/kayak.jpg';
          } else if (url.includes('PCU_Indiana') || url.includes('wikimedia.org') || url.includes('photo-1559136555-9303baea8ebd')) {
            url = '/images/boats/raft.jpg';
          }

          if (capUrl && (capUrl.includes('photo-1507003211169-0a1dd7228f2d') || capUrl.includes('verma'))) {
            capUrl = '/images/captains/verma.jpg';
          } else if (capUrl && (capUrl.includes('photo-1500648767791-00dcc994a43e') || capUrl.includes('singh'))) {
            capUrl = '/images/captains/singh.jpg';
          } else if (capUrl && (capUrl.includes('photo-1472099645785-5658abf4ff4e') || capUrl.includes('mukherjee'))) {
            capUrl = '/images/captains/mukherjee.jpg';
          } else if (capUrl && (capUrl.includes('photo-1519085360753-af0119f7cbe7') || capUrl.includes('rajesh'))) {
            capUrl = '/images/captains/rajesh.jpg';
          } else if (capUrl && (capUrl.includes('photo-1534528741775-53994a69daeb') || capUrl.includes('default'))) {
            capUrl = '/images/captains/default.jpg';
          }
          return { ...b, imageUrl: url, captainAvatarUrl: capUrl };
        });
        setBoats(upgraded);
        localStorage.setItem('bn_boats', JSON.stringify(upgraded));
      } catch (err) {
        setBoats(INITIAL_BOATS);
        localStorage.setItem('bn_boats', JSON.stringify(INITIAL_BOATS));
      }
    } else {
      setBoats(INITIAL_BOATS);
      localStorage.setItem('bn_boats', JSON.stringify(INITIAL_BOATS));
    }

    // 6. Reviews
    const storedReviews = localStorage.getItem('bn_reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('bn_reviews', JSON.stringify(INITIAL_REVIEWS));
    }

    // 7. Bookings
    const storedBookings = localStorage.getItem('bn_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }

    // 8. Payments
    const storedPayments = localStorage.getItem('bn_payments');
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }

    // 9. Notifications
    const storedNotifs = localStorage.getItem('bn_notifications');
    if (storedNotifs) {
      setNotifications(JSON.parse(storedNotifs));
    } else {
      const initialNotifs: SystemNotification[] = [
        {
          id: 'notif-welcome',
          userId: 'cust-1',
          title: 'Welcome to BoatNow 🌊',
          message: 'India\'s first elite water-puddle ride-hailing system is live! Safe rows ahead.',
          type: 'alert',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ];
      setNotifications(initialNotifs);
      localStorage.setItem('bn_notifications', JSON.stringify(initialNotifs));
    }
  }, []);

  // Helper to persist current user
  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserInternal(user);
    if (user) {
      localStorage.setItem('bn_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bn_current_user');
    }
  };

  // --- ACTIONS ---

  // Auth: Register User
  const registerUser = (name: string, email: string, role: UserRole, phone?: string): UserProfile => {
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      phone
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('bn_users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);

    // Welcome Notification
    addNotification(
      newUser.uid,
      'Account Created Successfully!',
      `Welcome to BoatNow, ${name}! Your designated navigation role is: ${role.toUpperCase()}.`,
      'alert'
    );

    return newUser;
  };

  // Auth: Login User
  const loginUser = (email: string): boolean => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return true;
    }
    return false;
  };

  // Auth: Logout User
  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Auth: Easy Role Switching for testing
  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    
    // Update in users array
    const updatedUsers = users.map(u => u.uid === currentUser.uid ? updated : u);
    setUsers(updatedUsers);
    localStorage.setItem('bn_users', JSON.stringify(updatedUsers));

    // Force refresh or trigger info toast
    addNotification(
      currentUser.uid,
      'Role Switched 🔄',
      `You are now acting as a ${role.toUpperCase()}. Explore your dashboard!`,
      'alert'
    );
  };

  // Boat: Register a new Boat
  const registerBoat = (boatData: Omit<Boat, 'id' | 'ownerId' | 'ownerName' | 'rating' | 'reviewsCount' | 'distanceKm' | 'coordinates' | 'captainRating' | 'captainAvatarUrl' | 'status'>) => {
    if (!currentUser) return;

    const newBoat: Boat = {
      ...boatData,
      id: `boat-${Date.now()}`,
      ownerId: currentUser.uid,
      ownerName: currentUser.name,
      rating: 5.0,
      reviewsCount: 0,
      distanceKm: +(Math.random() * 4 + 0.2).toFixed(1),
      coordinates: {
        x: Math.floor(Math.random() * 60 + 20),
        y: Math.floor(Math.random() * 60 + 20)
      },
      captainName: currentUser.name,
      captainRating: 5.0,
      captainAvatarUrl: '/images/captains/default.jpg',
      status: 'active'
    };

    const updatedBoats = [newBoat, ...boats];
    setBoats(updatedBoats);
    localStorage.setItem('bn_boats', JSON.stringify(updatedBoats));

    addNotification(
      currentUser.uid,
      'Boat Registered 🚢',
      `Your vessel "${newBoat.name}" has been registered and is ready to float in ${newBoat.operatingArea}!`,
      'booking_status'
    );
  };

  // Boat: Update Availability Dates
  const updateBoatAvailability = (boatId: string, blockedDates: string[]) => {
    const updatedBoats = boats.map(b => b.id === boatId ? { ...b, blockedDates } : b);
    setBoats(updatedBoats);
    localStorage.setItem('bn_boats', JSON.stringify(updatedBoats));
  };

  // Admin/Owner: Toggle active status
  const toggleBoatStatus = (boatId: string) => {
    const updatedBoats = boats.map(b => {
      if (b.id === boatId) {
        const newStatus = b.status === 'active' ? 'suspended' : 'active';
        // Notify owner if suspended by admin
        if (newStatus === 'suspended') {
          addNotification(
            b.ownerId,
            'Listing Suspended ⚠️',
            `Your boat "${b.name}" has been disabled due to administrative audit / puddle safety inspection.`,
            'alert'
          );
        }
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBoats(updatedBoats);
    localStorage.setItem('bn_boats', JSON.stringify(updatedBoats));
  };

  // Booking: Create Booking (Pre-payment)
  const createBooking = (boatId: string, date: string, startTime: string, hours: number, needLifeJackets: boolean): Booking => {
    if (!currentUser) throw new Error('User must be logged in to book');
    
    // Check double booking
    const isDoubleBooked = bookings.some(b => 
      b.boatId === boatId && 
      b.date === date && 
      b.startTime === startTime && 
      b.status !== 'cancelled' && 
      b.status !== 'rejected'
    );
    if (isDoubleBooked) {
      throw new Error('This slot is already chartered. Double booking is strictly prohibited to avoid mid-puddle collisions.');
    }

    const targetBoat = boats.find(b => b.id === boatId);
    if (!targetBoat) throw new Error('Boat not found');

    const rawPrice = targetBoat.pricePerHour * hours;
    // Severity price modifier: High water levels increases pricing by 20% (surge)
    const severityModifier = floodSeverity === 'boat_recommended' ? 1.2 : floodSeverity === 'ankle_deep' ? 1.0 : 0.8;
    const totalPrice = Math.round(rawPrice * severityModifier);

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      boatId,
      boatName: targetBoat.name,
      customerId: currentUser.uid,
      customerName: currentUser.name,
      date,
      startTime,
      hours,
      totalPrice,
      status: 'pending', // awaits payment or owner approval depending on Stripe
      needLifeJackets,
      createdAt: new Date().toISOString(),
      etaMinutes: Math.floor(Math.random() * 8 + 3)
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('bn_bookings', JSON.stringify(updatedBookings));

    // Notify boat owner of pending booking request
    addNotification(
      targetBoat.ownerId,
      'New Charter Request! ⚓',
      `${currentUser.name} wants to book "${targetBoat.name}" on ${date} at ${startTime} for ${hours} hour(s).`,
      'booking_request'
    );

    return newBooking;
  };

  // Booking: Cancel Booking
  const cancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (!bookingToCancel) return;

    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as 'cancelled' } : b);
    setBookings(updatedBookings);
    localStorage.setItem('bn_bookings', JSON.stringify(updatedBookings));

    const targetBoat = boats.find(boat => boat.id === bookingToCancel.boatId);
    if (targetBoat) {
      // Notify owner
      addNotification(
        targetBoat.ownerId,
        'Booking Cancelled 🚫',
        `${bookingToCancel.customerName} cancelled their trip for "${targetBoat.name}" on ${bookingToCancel.date}.`,
        'booking_status'
      );
    }

    // Notify customer
    addNotification(
      bookingToCancel.customerId,
      'Charter Cancelled 🛑',
      `Your booking for "${bookingToCancel.boatName}" has been successfully cancelled and refunded to your puddle account.`,
      'booking_status'
    );

    if (activeTrackingBooking?.id === bookingId) {
      setActiveTrackingBooking(null);
      setTrackingBoatCoords(null);
    }
  };

  // Booking: Owner responds (Accept/Reject)
  const respondToBooking = (bookingId: string, accept: boolean) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newStatus = accept ? ('confirmed' as 'confirmed') : ('rejected' as 'rejected');
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
    setBookings(updatedBookings);
    localStorage.setItem('bn_bookings', JSON.stringify(updatedBookings));

    // Notify customer
    const title = accept ? 'Captain Accepted Your Booking! 🛶' : 'Charter Request Rejected ❌';
    const message = accept 
      ? `Captain is preparing the oars! Your booking for "${booking.boatName}" is confirmed for ${booking.date} at ${booking.startTime}.`
      : `Unfortunately, the Captain rejected your booking. The water levels might be too hostile or tea break is active.`;
    
    addNotification(booking.customerId, title, message, 'booking_status');

    // Trigger map tracking if accepted
    if (accept) {
      const targetBoat = boats.find(b => b.id === booking.boatId);
      setActiveTrackingBooking(booking);
      if (targetBoat) {
        setTrackingBoatCoords(targetBoat.coordinates);
      }
    }
  };

  // Booking: ONE-TAP SOS Emergency Mode!
  const triggerSOS = (): Booking | null => {
    if (!currentUser) return null;
    
    // Find closest available active boat
    const availableBoats = boats.filter(b => b.status === 'active');
    if (availableBoats.length === 0) return null;
    
    // Sort by distance
    const closestBoat = [...availableBoats].sort((a, b) => a.distanceKm - b.distanceKm)[0];
    
    setSosActive(true);

    // Auto-create a confirmed, paid booking immediately for immediate deployment!
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const startTime = `${currentHour}:00`;

    const sosBooking = createBooking(closestBoat.id, today, startTime, 1, true);
    
    // Auto-update to confirmed and paid
    const updatedBookings = bookings.map(b => b.id === sosBooking.id ? { 
      ...b, 
      status: 'confirmed' as 'confirmed', 
      needLifeJackets: true,
      paymentId: `pay_sos_${Date.now()}`
    } : b);
    
    // Append the newly created SOS booking as confirmed
    const finalSosBooking: Booking = {
      ...sosBooking,
      status: 'confirmed',
      paymentId: `pay_sos_${Date.now()}`
    };

    setBookings([finalSosBooking, ...bookings.filter(b => b.id !== sosBooking.id)]);
    localStorage.setItem('bn_bookings', JSON.stringify([finalSosBooking, ...bookings.filter(b => b.id !== sosBooking.id)]));

    // Create a mock payment log for Stripe audit
    const newPayment: PaymentLog = {
      id: `pay_sos_${Date.now()}`,
      bookingId: finalSosBooking.id,
      boatName: closestBoat.name,
      customerName: currentUser.name,
      amount: finalSosBooking.totalPrice,
      paymentMethod: 'card',
      status: 'succeeded',
      createdAt: new Date().toISOString(),
      transactionRef: `ch_sos_${Math.random().toString(36).substring(2, 10)}`
    };
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    localStorage.setItem('bn_payments', JSON.stringify(updatedPayments));

    // Notify Captain
    addNotification(
      closestBoat.ownerId,
      '🚨 EMERGENCY SOS DISPATCH 🚨',
      `IMMEDIATE DEPLOYMENT REQUESTED! ${currentUser.name} is stranded nearby in high water! Coordinates transmitted.`,
      'booking_request'
    );

    // Notify Customer
    addNotification(
      currentUser.uid,
      '🚨 SOS Active: Help is coming!',
      `Captain ${closestBoat.captainName} has been forcibly dispatched. ETA: 3 minutes! Put on your life vest immediately.`,
      'booking_status'
    );

    // Initialize Map tracking
    setActiveTrackingBooking(finalSosBooking);
    setTrackingBoatCoords(closestBoat.coordinates);

    return finalSosBooking;
  };

  const clearSOS = () => {
    setSosActive(false);
    setActiveTrackingBooking(null);
    setTrackingBoatCoords(null);
  };

  // Payment: Process simulated Stripe payment
  const processStripePayment = async (bookingId: string, paymentMethod: string, cardNumber: string): Promise<PaymentLog> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');

        const txId = `pay_${Date.now()}`;
        
        // 1. Update Booking state to confirmed/paid
        const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' as 'confirmed', paymentId: txId } : b);
        setBookings(updatedBookings);
        localStorage.setItem('bn_bookings', JSON.stringify(updatedBookings));

        // 2. Log Payment
        const newPayment: PaymentLog = {
          id: txId,
          bookingId,
          boatName: booking.boatName,
          customerName: booking.customerName,
          amount: booking.totalPrice,
          paymentMethod,
          status: 'succeeded',
          createdAt: new Date().toISOString(),
          transactionRef: `ch_stripe_${Math.random().toString(36).substring(2, 11).toUpperCase()}`
        };

        const updatedPayments = [newPayment, ...payments];
        setPayments(updatedPayments);
        localStorage.setItem('bn_payments', JSON.stringify(updatedPayments));

        // 3. Notify owner & customer
        const targetBoat = boats.find(b => b.id === booking.boatId);
        if (targetBoat) {
          addNotification(
            targetBoat.ownerId,
            'Charter Paid! 💳',
            `Simulated Stripe checkout succeeded. ${booking.totalPrice} INR has been credited to your paddle ledger. Prep your boat!`,
            'payment_success'
          );
        }

        addNotification(
          booking.customerId,
          'Payment Successful! 🛶',
          `Stripe verified your credentials. Reciept reference: ${newPayment.transactionRef}. Captain is notified!`,
          'payment_success'
        );

        // Start tracking boat immediately
        setActiveTrackingBooking(booking);
        if (targetBoat) {
          setTrackingBoatCoords(targetBoat.coordinates);
        }

        resolve(newPayment);
      }, 1500); // realistic payment latency
    });
  };

  // Review: Add Review to a boat
  const addReview = (boatId: string, cleanliness: number, punctuality: number, safety: number, overall: number, comment: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      boatId,
      reviewerName: currentUser.name,
      cleanliness,
      punctuality,
      safety,
      overall,
      comment,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('bn_reviews', JSON.stringify(updatedReviews));

    // Recalculate Boat average rating
    const boatReviews = updatedReviews.filter(r => r.boatId === boatId);
    const avgRating = +(boatReviews.reduce((sum, r) => sum + r.overall, 0) / boatReviews.length).toFixed(1);

    const updatedBoats = boats.map(b => b.id === boatId ? {
      ...b,
      rating: avgRating,
      reviewsCount: boatReviews.length
    } : b);
    setBoats(updatedBoats);
    localStorage.setItem('bn_boats', JSON.stringify(updatedBoats));

    const targetBoat = boats.find(b => b.id === boatId);
    if (targetBoat) {
      addNotification(
        targetBoat.ownerId,
        'New Captain Review ⭐',
        `${currentUser.name} rated you ${overall}/5 stars: "${comment.substring(0, 40)}..."`,
        'booking_status'
      );
    }
  };

  // Settings & Helpers
  const setFloodSeverity = (severity: FloodSeverity) => {
    setFloodSeverityState(severity);
    localStorage.setItem('bn_flood_severity', severity);

    // Global system alert
    const severityTitles = {
      dry: '☀️ Roads are Dry!',
      ankle_deep: '🌧️ Ankle-Deep Puddles Looming',
      boat_recommended: '🚨 EMERGENCY FLOOD ACTIVE 🚨'
    };
    const severityMessages = {
      dry: 'Puddles are shrinking. Standard pricing discount (20%) is active for low waters.',
      ankle_deep: 'Delhi streets are water-logged. Standard boat fares are in effect.',
      boat_recommended: 'High Surge Alert (20% increase). High water levels. Captains fully deployed!'
    };

    users.forEach(u => {
      addNotification(
        u.uid,
        severityTitles[severity],
        severityMessages[severity],
        'alert'
      );
    });
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('bn_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    const updated = notifications.map(n => n.userId === currentUser.uid ? { ...n, isRead: true } : n);
    setNotifications(updated);
    localStorage.setItem('bn_notifications', JSON.stringify(updated));
  };

  const addNotification = (userId: string, title: string, message: string, type: SystemNotification['type']) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => {
      const next = [newNotif, ...prev];
      localStorage.setItem('bn_notifications', JSON.stringify(next));
      return next;
    });
  };

  // --- LIVE MAP BOAT POSITION TRACKING INTERACTION ---
  // When a charter is "confirmed" and active tracking is set, simulate the captain moving towards the user (which is fixed at x=50, y=50)
  useEffect(() => {
    if (!activeTrackingBooking || !trackingBoatCoords) return;

    const interval = setInterval(() => {
      setTrackingBoatCoords(current => {
        if (!current) return null;
        // User is at 50, 50
        const dx = 50 - current.x;
        const dy = 50 - current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
          // Arrived!
          clearInterval(interval);
          
          // Complete booking and send notification
          setBookings(prevBookings => {
            const updated = prevBookings.map(b => b.id === activeTrackingBooking.id ? { ...b, status: 'completed' as 'completed', etaMinutes: 0 } : b);
            localStorage.setItem('bn_bookings', JSON.stringify(updated));
            return updated;
          });

          addNotification(
            activeTrackingBooking.customerId,
            '🚨 Your Captain has Arrived!',
            `Captain has anchored outside your front door. Mind the splash while boarding!`,
            'booking_status'
          );

          setActiveTrackingBooking(null);
          return null;
        }

        // Move 5% closer
        const speed = 0.08;
        return {
          x: +(current.x + dx * speed).toFixed(2),
          y: +(current.y + dy * speed).toFixed(2)
        };
      });

      // Update booking ETA
      setBookings(prevBookings => {
        const updated = prevBookings.map(b => {
          if (b.id === activeTrackingBooking.id && b.etaMinutes > 1) {
            return { ...b, etaMinutes: b.etaMinutes - 1 };
          }
          return b;
        });
        localStorage.setItem('bn_bookings', JSON.stringify(updated));
        return updated;
      });

    }, 3000); // tick every 3 seconds

    return () => clearInterval(interval);
  }, [activeTrackingBooking]);

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      boats,
      bookings,
      payments,
      notifications,
      reviews,
      floodSeverity,
      theme,
      sosActive,
      activeTrackingBooking,
      trackingBoatCoords,
      setCurrentUser,
      registerUser,
      loginUser,
      logoutUser,
      switchRole,
      registerBoat,
      updateBoatAvailability,
      toggleBoatStatus,
      createBooking,
      cancelBooking,
      respondToBooking,
      triggerSOS,
      clearSOS,
      processStripePayment,
      addReview,
      setFloodSeverity,
      toggleTheme,
      markNotificationsAsRead,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
