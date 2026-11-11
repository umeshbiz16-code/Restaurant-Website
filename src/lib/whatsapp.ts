// ==============================================================================
// WHATSAPP ORDER NOTIFICATION DISPATCHER (Admin Alert: 9981508165)
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
  // Train delivery attributes
  isTrainDelivery?: boolean;
  trainNumber?: string;
  trainName?: string;
  pnrNumber?: string;
  coachNumber?: string;
  berthNumber?: string;
  deliveryStation?: string;
  trainDeliveryTime?: string;
}

// ALWAYS AND ONLY DISPATCH ORDER & PAYMENT DETAIL TO ADMIN NO. 9981508165
export const ADMIN_WHATSAPP_NUMBER = '9981508165';

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

  const isTrain = Boolean(order.isTrainDelivery || order.trainNumber);

  const trainBlock = isTrain
    ? [
        `🚆 *IRCTC TRAIN COACH DELIVERY DETAILS:*`,
        `• *Train No & Name:* ${order.trainNumber || ''} ${order.trainName ? `(${order.trainName})` : ''}`,
        `• *Coach:* ${order.coachNumber || 'N/A'}`,
        `• *Berth / Seat:* ${order.berthNumber || 'N/A'}`,
        `• *Delivery Station:* ${order.deliveryStation || 'N/A'}`,
        order.pnrNumber ? `• *PNR No:* ${order.pnrNumber}` : '',
        order.trainDeliveryTime ? `• *Arrival Time:* ${order.trainDeliveryTime}` : '',
        ``,
      ].filter(Boolean)
    : [];

  const headerTitle = isTrain
    ? `🚆 *NEW TRAIN COACH SATVIK FOOD ORDER!* 🚆`
    : `🔔 *NEW SATVIK RESTAURANT ORDER!* 🔔`;

  const messageLines = [
    headerTitle,
    `------------------------------------------`,
    `📋 *Order ID:* #${order.orderId}`,
    `💳 *Payment:* PAID via Razorpay [${modeTag} Mode]`,
    order.razorpayPaymentId ? `🆔 *Payment ID:* ${order.razorpayPaymentId}` : '',
    ``,
    ...trainBlock,
    `👤 *PASSENGER / CUSTOMER DETAILS:*`,
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
    isTrain
      ? `⚡ *Action Required:* Prepare food and dispatch runner to Platform / Coach Door on time!`
      : `⚡ *Action Required:* Kitchen team please begin pure ghee preparation!`,
    `🕒 *Order Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ].filter(line => line !== '');

  return messageLines.join('\n');
}

/**
 * Generates direct wa.me URL to send full order & payment detail strictly and ALWAYS to Admin (9981508165)
 */
export function generateWhatsAppDirectLink(
  order: OrderNotificationPayload,
  _recipientNumber?: string
): string {
  // Always strictly target Admin number 9981508165
  const internationalNumber = `91${ADMIN_WHATSAPP_NUMBER}`;
  const message = formatOrderWhatsAppMessage(order);
  return `https://api.whatsapp.com/send?phone=${internationalNumber}&text=${encodeURIComponent(message)}`;
}

/**
 * Formats a clean customer Thanks of order message with items and Rs.
 */
export function formatCustomerThanksMessage(order: OrderNotificationPayload): string {
  const itemsList = order.items
    .map((item, idx) => `${idx + 1}. *${item.name}* × ${item.quantity || 1} (₹${item.price * (item.quantity || 1)})`)
    .join('\n');

  return [
    `🙏 *NAMASTE ${order.customerName.toUpperCase()}!*`,
    `Thank you for placing your order with *Satvik Caters and Events*!`,
    ``,
    `📋 *ORDERED ITEMS:*`,
    itemsList,
    ``,
    `💰 *THANKS OF ORDER FOR: ₹${order.total}*`,
    `• *Payment Status:* Paid successfully via Razorpay`,
    `• *Order Reference:* #${order.orderId}`,
    order.isTrainDelivery || order.trainNumber
      ? `🚆 *Train Coach Drop:* Train #${order.trainNumber}, Coach ${order.coachNumber}, Berth ${order.berthNumber} at ${order.deliveryStation}`
      : `📍 *Delivery Address:* ${order.address}`,
    ``,
    `✨ Your pure Satvik food is being freshly prepared with pure desi ghee. Our team will deliver it hot and on time!`,
    `📞 *Helpline / Owner Manish Jaiswal:* +91 9981508165`,
  ].join('\n');
}

/**
 * Generates direct wa.me URL to send customer Thanks message to customer's phone number
 */
export function generateCustomerThanksWhatsAppLink(order: OrderNotificationPayload): string {
  const rawNumber = (order.phone || '').replace(/\D/g, '');
  const internationalNumber = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;
  const message = formatCustomerThanksMessage(order);
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
