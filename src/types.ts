export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spicy: string;
  rating: number;
  reviews: number;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export type OrderStatus = "Placed" | "Chef Preparing" | "Quality Check" | "Out for Delivery" | "Delivered" | "Runner at Platform" | "Delivered to Berth" | "Cancelled";

export interface TrainDeliveryDetails {
  trainNumber: string;
  trainName?: string;
  pnrNumber?: string;
  coachNumber: string;
  berthNumber: string;
  passengerName: string;
  passengerPhone: string;
  deliveryStation: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialNotes?: string;
  createdAt?: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "Card" | "UPI" | "NetBanking" | "Razorpay" | string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  transactionId?: string;
  createdAt: number;
  estimatedDeliveryAt: number;
  eventType?: string;
  guestCount?: number;
  specialInstructions?: string;
  // Food delivery in Train integration fields
  isTrainDelivery?: boolean;
  trainNumber?: string;
  trainName?: string;
  pnrNumber?: string;
  coachNumber?: string;
  berthNumber?: string;
  deliveryStation?: string;
  trainDeliveryTime?: string;
}

export type EnquiryStatus = "Pending" | "Contacted" | "Confirmed" | "Fulfilled" | "Closed";

export interface Enquiry {
  id: string; // e.g. ENQ-109283
  customerName: string;
  phone: string;
  email?: string;
  demandDetails: string;
  dietaryPreference?: string;
  guestCount?: number;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  preferredContactMethod?: "call" | "email" | "whatsapp" | "any";
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}
