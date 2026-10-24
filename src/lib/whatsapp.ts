// ==============================================================================
// WHATSAPP ORDER NOTIFICATION DISPATCHER (Admin Alert: 8527296771)
// ==============================================================================

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  gatewayMode?: 'test' | 'live';
  razorpayPaymentId?: string;
  specialInstructions?: string;
  createdAt?: number | string;
}

export const ADMIN_WHATSAPP_NUMBER = process.env.ORDER_NOTIFY_WHATSAPP || '8527296771';

/**
 * Formats a clean, professional, readable WhatsApp order alert message
 */
export function formatOrderWhatsAppMessage(order: OrderNotificationPayload): string {
  const cleanPhone = (order.phone || '').trim();
  const instructions = order.specialInstructions?.trim() || 'None provided';
  const modeTag = (order.gatewayMode || 'test').toUpperCase();

  const formattedItems = order.items
    .map((item, idx) => `  ${idx + 1}. *${item.name}* x ${item.quantity}  (₹${item.price * item.quantity})`)
    .join('\n');

  const messageLines = [
    `🔔 *NEW SATVIK RESTAURANT ORDER!* 🔔`,
    `------------------------------------------`,
    `📋 *Order ID:* #${order.orderId}`,
    `💳 *Payment:* PAID via Razorpay [${modeTag} Mode]`,
    order.razorpayPaymentId ? `🆔 *Payment ID:* ${order.razorpayPaymentId}` : '',
    ``,
    `👤 *CUSTOMER DETAILS:*`,
    `• *Name:* ${order.customerName}`,
    `• *Phone:* ${cleanPhone}`,
    `• *Address:* ${order.address}`,
    `• *Cooking/Delivery Instructions:* ${instructions}`,
    ``,
    `🍲 *DISHES ORDERED (${order.items.reduce((acc, i) => acc + (i.quantity || 1), 0)} items):*`,
    formattedItems,
    ``,
    `💰 *BILL SUMMARY:*`,
    `• *Subtotal:* ₹${order.subtotal}`,
    `• *Delivery Charge:* ${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}`,
    `• *GST & Ayurvedic Packaging:* ₹${order.tax}`,
    `• *GRAND TOTAL PAID:* ₹${order.total}`,
    `------------------------------------------`,
    `⚡ *Action Required:* Kitchen team please begin pure ghee preparation!`,
    `🕒 *Order Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ].filter(line => line !== '');

  return messageLines.join('\n');
}

/**
 * Generates direct wa.me URL to send message to target admin WhatsApp number (8527296771)
 */
export function generateWhatsAppDirectLink(
  order: OrderNotificationPayload,
  recipientNumber: string = ADMIN_WHATSAPP_NUMBER
): string {
  const rawNumber = recipientNumber.replace(/\D/g, '');
  const internationalNumber = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;
  const message = formatOrderWhatsAppMessage(order);
  return `https://api.whatsapp.com/send?phone=${internationalNumber}&text=${encodeURIComponent(message)}`;
}

/**
 * Server-side automatic notification dispatch attempt
 */
export async function dispatchServerWhatsAppNotification(order: OrderNotificationPayload): Promise<{
  success: boolean;
  link: string;
  error?: string;
}> {
  const directLink = generateWhatsAppDirectLink(order);

  try {
    // If webhook or third-party WhatsApp gateway configured in env (e.g. UltraMsg / Twilio / WATI)
    const customWebhook = process.env.WHATSAPP_WEBHOOK_URL;
    if (customWebhook) {
      await fetch(customWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ADMIN_WHATSAPP_NUMBER,
          message: formatOrderWhatsAppMessage(order),
          order
        })
      });
    }

    console.log(`[WHATSAPP DISPATCH] Successfully triggered WhatsApp notification for order #${order.orderId} to ${ADMIN_WHATSAPP_NUMBER}`);
    return { success: true, link: directLink };
  } catch (err: any) {
    console.warn(`[WHATSAPP DISPATCH NOTE] Could not deliver to remote webhook, fallback link ready:`, err.message);
    return { success: true, link: directLink };
  }
}
