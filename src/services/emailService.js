/**
 * EmailJS email service
 * Sender: smisomsimango@gmail.com
 * Recipient: admin@3sixtybranding.co.za
 *
 * Uses the browser SDK loaded via CDN (no npm install needed).
 * EmailJS is initialised once when this module is first imported.
 */

const PUBLIC_KEY    = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID    = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const QUOTE_TPL     = process.env.REACT_APP_EMAILJS_QUOTE_TEMPLATE_ID;
const ORDER_TPL     = process.env.REACT_APP_EMAILJS_ORDER_TEMPLATE_ID;
const ADMIN_EMAIL   = 'admin@3sixtybranding.co.za';

// Lazy-load the EmailJS SDK from CDN so we don't need npm install
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) { resolve(window.emailjs); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init({ publicKey: PUBLIC_KEY });
      resolve(window.emailjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Send a quote request email to admin.
 * @param {object} formData - Quote form fields
 */
export async function sendQuoteEmail(formData) {
  const ejs = await loadEmailJS();

  const params = {
    to_email:     ADMIN_EMAIL,
    from_name:    formData.name,
    from_email:   formData.email,
    phone:        formData.phone,
    company:      formData.company || 'N/A',
    product:      formData.product || 'N/A',
    quantity:     formData.quantity || 'N/A',
    branding:     formData.brandingMethod || 'N/A',
    message:      formData.message || 'No additional notes.',
    reply_to:     formData.email,
  };

  return ejs.send(SERVICE_ID, QUOTE_TPL, params);
}

/**
 * Send a new order notification email to admin.
 * @param {object} order - Order object from Checkout
 */
export async function sendOrderEmail(order) {
  const ejs = await loadEmailJS();

  const itemsList = order.items
    .map((i) => `• ${i.name}${i.variant ? ` (${i.variant})` : ''} × ${i.qty} — R ${(i.price * i.qty).toLocaleString('en-ZA')}`)
    .join('\n');

  const params = {
    to_email:       ADMIN_EMAIL,
    order_id:       order.orderId,
    order_date:     new Date(order.date).toLocaleString('en-ZA'),
    customer_name:  `${order.customer.firstName} ${order.customer.lastName}`,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    company:        order.customer.company || 'N/A',
    address:        `${order.customer.address}, ${order.customer.city}, ${order.customer.province} ${order.customer.postalCode}`,
    items_list:     itemsList,
    shipping:       order.shipping?.name || 'N/A',
    payment:        order.payment?.name || 'N/A',
    subtotal:       `R ${order.subtotal.toLocaleString('en-ZA')}`,
    shipping_cost:  order.shippingCost === 0 ? 'Free' : `R ${order.shippingCost}`,
    total:          `R ${order.total.toLocaleString('en-ZA')}`,
    notes:          order.customer.notes || 'None',
    reply_to:       order.customer.email,
  };

  return ejs.send(SERVICE_ID, ORDER_TPL, params);
}
