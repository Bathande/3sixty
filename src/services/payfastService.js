/**
 * PayFast Payment Service
 * Docs: https://developers.payfast.co.za/docs
 *
 * PayFast works by submitting an HTML form POST to their payment page.
 * The user is redirected to PayFast, completes payment, then redirected back.
 *
 * Sandbox URL: https://sandbox.payfast.co.za/eng/process
 * Live URL:    https://www.payfast.co.za/eng/process
 *
 * IMPORTANT: PayFast requires a valid notify_url (ITN) on a public HTTPS server
 * to confirm payments server-side. For now we use return/cancel URLs only.
 * For production, set up a Firebase Function or backend endpoint for ITN.
 */

const IS_LIVE = process.env.REACT_APP_PAYFAST_LIVE === 'true';

export const PAYFAST_URL = IS_LIVE
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

export const MERCHANT_ID  = process.env.REACT_APP_PAYFAST_MERCHANT_ID  || '10000100'; // sandbox default
export const MERCHANT_KEY = process.env.REACT_APP_PAYFAST_MERCHANT_KEY || '46f0cd694581a'; // sandbox default

/**
 * Build the PayFast payment data object from an order.
 * @param {object} order  - Order object from Checkout
 * @param {string} siteUrl - Base URL of the site e.g. https://3sixtybranding.co.za
 * @returns {object} key-value pairs to POST to PayFast
 */
export function buildPayfastData(order, siteUrl = window.location.origin) {
  const name = `${order.customer.firstName} ${order.customer.lastName}`.trim();

  // Build item description (max 255 chars)
  const itemDesc = order.items
    .map((i) => `${i.name} x${i.qty}`)
    .join(', ')
    .substring(0, 255);

  return {
    // Merchant
    merchant_id:   MERCHANT_ID,
    merchant_key:  MERCHANT_KEY,

    // Redirect URLs
    return_url:    `${siteUrl}/order-confirmation?status=success&order=${order.orderId}`,
    cancel_url:    `${siteUrl}/checkout?status=cancelled`,
    notify_url:    `${siteUrl}/api/payfast-notify`, // ITN endpoint — set up backend for production

    // Buyer
    name_first:    order.customer.firstName,
    name_last:     order.customer.lastName,
    email_address: order.customer.email,
    cell_number:   order.customer.phone?.replace(/\s/g, '') || '',

    // Transaction
    m_payment_id:  order.orderId,
    amount:        order.total.toFixed(2),
    item_name:     `3Sixty Branding Order ${order.orderId}`,
    item_description: itemDesc,

    // Custom data (passed back in ITN)
    custom_str1:   order.orderId,
    custom_str2:   order.customer.email,
  };
}

/**
 * Redirect the user to PayFast by programmatically submitting a form.
 * @param {object} order
 */
export function redirectToPayfast(order) {
  const data = buildPayfastData(order);

  // Create a hidden form and submit it
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYFAST_URL;
  form.style.display = 'none';

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = key;
      input.value = String(value);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
}
