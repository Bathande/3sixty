/**
 * EmailJS email service
 * All emails are sent to admin@3sixtybranding.co.za
 */

const PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID  = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const QUOTE_TPL   = process.env.REACT_APP_EMAILJS_QUOTE_TEMPLATE_ID;
const ORDER_TPL   = process.env.REACT_APP_EMAILJS_ORDER_TEMPLATE_ID;
const EFT_TPL     = process.env.REACT_APP_EMAILJS_EFT_TEMPLATE_ID;
const ADMIN_EMAIL = 'admin@3sixtybranding.co.za';

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
 * Send a quote request email.
 * Template variables: {{to_email}} {{from_name}} {{from_email}} {{phone}}
 *   {{company}} {{product}} {{quantity}} {{branding}} {{message}} {{reply_to}}
 */
export async function sendQuoteEmail(formData) {
  const ejs = await loadEmailJS();

  const params = {
    to_email:   ADMIN_EMAIL,
    from_name:  formData.name           || '',
    from_email: formData.email          || '',
    phone:      formData.phone          || '',
    company:    formData.company        || 'N/A',
    product:    formData.product        || 'N/A',
    quantity:   formData.quantity       || 'N/A',
    branding:   formData.brandingMethod || 'N/A',
    message:    formData.message        || 'No additional notes.',
    reply_to:   formData.email          || '',
  };

  const result = await ejs.send(SERVICE_ID, QUOTE_TPL, params);
  console.log('EmailJS quote result:', result);
  return result;
}

/**
 * Send an order notification email.
 * Template variables: {{to_email}} {{order_id}} {{order_number}} {{order_date}}
 *   {{customer_name}} {{customer_email}} {{customer_phone}} {{company}}
 *   {{address}} {{items_list}} {{shipping}} {{payment}}
 *   {{subtotal}} {{shipping_cost}} {{total}} {{notes}} {{reply_to}}
 */
export async function sendOrderEmail(order) {
  const ejs = await loadEmailJS();
  
  const itemsList = (order.items || [])
    .map((i) => `${i.name}${i.variant ? ` (${i.variant})` : ''} x${i.qty} — R ${(i.price * i.qty).toLocaleString('en-ZA')}`)
    .join('\n');

  const customer = order.customer || {};
  const addressParts = [
    customer.address,
    customer.address2,
    customer.city,
    customer.province,
    customer.postalCode,
  ].filter(Boolean).join(', ');

  const params = {
    to_email:       ADMIN_EMAIL,
    // Use same variable names as the quote template — these match your EmailJS template
    from_name:      `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
    from_email:     customer.email      || '',
    phone:          customer.phone      || '',
    company:        customer.company    || 'N/A',
    // Order-specific fields
    order_id:       order.orderId       || '',
    order_number:   order.orderNumber   || '',
    order_date:     order.date ? new Date(order.date).toLocaleString('en-ZA') : '',
    address:        addressParts        || 'N/A',
    message:        itemsList           || 'N/A',
    shipping:       order.shipping?.name  || 'N/A',
    payment:        order.payment?.name   || 'N/A',
    subtotal:       `R ${(order.subtotal || 0).toLocaleString('en-ZA')}`,
    shipping_cost:  order.shippingCost === 0 ? 'Free' : `R ${(order.shippingCost || 0).toLocaleString('en-ZA')}`,
    total:          `R ${(order.total || 0).toLocaleString('en-ZA')}`,
    notes:          customer.notes      || 'None',
    reply_to:       customer.email      || '',
  };

  const result = await ejs.send(SERVICE_ID, ORDER_TPL, params);
  console.log('EmailJS send result:', result);
  return result;
}

/**
 * Send EFT banking details to the customer after placing an EFT order.
 * Uses a single generic template that renders {{to_email}}, {{subject}}, {{message}}.
 * Template in EmailJS only needs: Subject: {{subject}}  Body: {{message}}
 */
export async function sendEftEmail(order) {
  const ejs = await loadEmailJS();

  const customer = order.customer || {};
  const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();

  const itemsList = (order.items || [])
    .map((i) => `  - ${i.name}${i.variant ? ` (${i.variant})` : ''} x${i.qty} — R ${(i.price * i.qty).toLocaleString('en-ZA')}`)
    .join('\n');

  const message = `Hi ${customerName},

Thank you for your order with 3Sixty Branding!

ORDER SUMMARY
Order Number: #${order.orderNumber}
Date: ${new Date(order.date).toLocaleString('en-ZA')}

Items:
${itemsList}

Subtotal: R ${(order.subtotal || 0).toLocaleString('en-ZA')}
Shipping: ${order.shippingCost === 0 ? 'Free' : `R ${order.shippingCost}`}
TOTAL DUE: R ${(order.total || 0).toLocaleString('en-ZA')}

─────────────────────────────────
BANKING DETAILS
─────────────────────────────────
Bank:           FNB — Gold Business Account (Cheque Account)
Account Name:   Zart Printing Pty Ltd T/a 3Sixty Branding
Account Number: 62863416816
Branch Code:    250655
Reference:      ${order.orderNumber} ${customer.company || customerName}
─────────────────────────────────

Amount to pay: R ${(order.total || 0).toLocaleString('en-ZA')}

📤 Once payment is made, please send proof of payment to:
admin@3sixtybranding.co.za

Your order will be processed as soon as payment is confirmed.

Need help? Call us on 031 001 6467 or WhatsApp us directly.

Thank you for choosing 3Sixty Branding!`;

  const params = {
    to_email: customer.email || '',
    from_name: '3Sixty Branding',
    subject:  `Your Order #${order.orderNumber} — Banking Details`,
    message,
    reply_to: ADMIN_EMAIL,
  };

  return ejs.send(SERVICE_ID, EFT_TPL, params);
}

/**
 * Send a courier dispatch notification to admin when PayFast payment is confirmed.
 * Uses the same generic EFT template ({{subject}} + {{message}}).
 * When The Courier Guy API credentials are available, replace this with a direct API call.
 *
 * Template variables: {{to_email}} {{from_name}} {{subject}} {{message}} {{reply_to}}
 */
export async function sendCourierNotification(orderId, orderData) {
  const ejs = await loadEmailJS();

  const c = orderData?.customer || {};
  const items = (orderData?.items || [])
    .map(i => `  - ${i.name}${i.variant ? ` (${i.variant})` : ''} x${i.qty}`)
    .join('\n');

  const message = `PAYMENT CONFIRMED — READY FOR DISPATCH

Order Number: #${orderData?.orderNumber || orderId}
Order Ref:    ${orderId}
Date:         ${new Date().toLocaleString('en-ZA')}

RECIPIENT
Name:     ${c.firstName || ''} ${c.lastName || ''}
Phone:    ${c.phone || 'N/A'}
Email:    ${c.email || 'N/A'}
Company:  ${c.company || 'N/A'}

DELIVERY ADDRESS
${c.address || ''}${c.address2 ? `, ${c.address2}` : ''}
${c.city || ''}, ${c.province || ''} ${c.postalCode || ''}

ITEMS TO SHIP
${items || 'N/A'}

SHIPPING METHOD
${orderData?.shipping?.name || 'N/A'}

ORDER TOTAL
R ${(orderData?.total || 0).toLocaleString('en-ZA')}

─────────────────────────────────
ACTION REQUIRED: Please arrange collection/dispatch for this order.
─────────────────────────────────

Sender: 3Sixty Branding
127 Victoria Embankment, Durban CBD
031 001 6467 | admin@3sixtybranding.co.za`;

  const params = {
    to_email:  ADMIN_EMAIL,
    from_name: '3Sixty Branding — Order System',
    subject:   `🚚 Dispatch Order #${orderData?.orderNumber || orderId} — Payment Confirmed`,
    message,
    reply_to:  ADMIN_EMAIL,
  };

  return ejs.send(SERVICE_ID, EFT_TPL, params);
}
