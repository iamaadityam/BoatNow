export type UserRole = 'customer' | 'owner' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  phone?: string;
}

export type BoatType = 'canoe' | 'motorboat' | 'kayak' | 'shikara' | 'raft';

export interface Review {
  id: string;
  boatId: string;
  reviewerName: string;
  cleanliness: number;
  punctuality: number;
  safety: number;
  overall: number;
  comment: string;
  createdAt: string;
}

export interface Boat {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  type: BoatType;
  capacity: number;
  pricePerHour: number;
  rating: number; // calculated from reviews
  reviewsCount: number;
  distanceKm: number; // mock distance
  nextAvailableTime: string;
  imageUrl: string;
  description: string;
  isCovered: boolean;
  isPetFriendly: boolean;
  isWheelchairAccessible: boolean;
  operatingArea: string;
  safetyEquipment: string[];
  blockedDates: string[]; // ['YYYY-MM-DD']
  coordinates: { x: number; y: number }; // simulated grid coordinates (0 to 100)
  captainName: string;
  captainRating: number;
  captainAvatarUrl: string;
  status: 'active' | 'suspended';
}

export interface Booking {
  id: string;
  boatId: string;
  boatName: string;
  customerId: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:00
  hours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  needLifeJackets: boolean;
  paymentId?: string;
  createdAt: string;
  etaMinutes: number; // simulated captain ETA
}

export interface PaymentLog {
  id: string;
  bookingId: string;
  boatName: string;
  customerName: string;
  amount: number;
  paymentMethod: string; // 'card' | 'applepay' | 'googlepay'
  status: 'succeeded' | 'refunded';
  createdAt: string;
  transactionRef: string; // mock stripe ref ch_...
}

export interface SystemNotification {
  id: string;
  userId: string; // target user
  title: string;
  message: string;
  type: 'booking_request' | 'booking_status' | 'payment_success' | 'alert';
  isRead: boolean;
  createdAt: string;
}

export type FloodSeverity = 'dry' | 'ankle_deep' | 'boat_recommended';
