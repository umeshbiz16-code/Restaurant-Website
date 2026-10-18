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

export type OrderStatus = "Placed" | "Chef Preparing" | "Quality Check" | "Out for Delivery" | "Delivered";

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
  paymentMethod: "Card" | "UPI" | "NetBanking";
  paymentStatus: "Pending" | "Paid" | "Failed";
  transactionId?: string;
  createdAt: number;
  estimatedDeliveryAt: number;
  eventType?: string;
  guestCount?: number;
  specialInstructions?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}
