/**
 * PayFast Payment Service
 * Live URL: https://www.payfast.co.za/eng/process
 */

const IS_LIVE = process.env.REACT_APP_PAYFAST_LIVE === 'true';

const PAYFAST_URL  = IS_LIVE
  ? 'https://www.payfast.co.za/eng/process'
  : 'https://sandbox.payfast.co.za/eng/process';

const MERCHANT_ID  = IS_LIVE
  ? process.env.REACT_APP_PAYFAST_MERCHANT_ID
  : '10000100';

const MERCHANT_KEY = IS_LIVE
  ? process.env.REACT_APP_PAYFAST_MERCHANT_KEY
  : '46f0cd694581a';

function clean(val, maxLen = 255) {
  return String(val || '').replace(/<[^>]*>/g, '').trim().substring(0, maxLen);
}

export function redirectToPayfast(order) {
  const siteUrl = window.location.origin;

  const itemDesc = (order.items || [])
    .map(i => `${clean(i.name)} x${i.qty}`)
    .join(', ')
    .substring(0, 255);

  const fields = {
    merchant_id:      MERCHANT_ID,
    merchant_key:     MERCHANT_KEY,
    return_url:       `${siteUrl}/order-confirmation?status=success&order=${encodeURIComponent(order.orderId)}`,
    cancel_url:       `${siteUrl}/checkout`,
    name_first:       clean(order.customer.firstName),
    name_last:        clean(order.customer.lastName),
    email_address:    clean(order.customer.email),
    cell_number:      (order.customer.phone || '').replace(/[^\d]/g, '').substring(0, 20),
    m_payment_id:     clean(order.orderId),
    amount:           Number(order.total).toFixed(2),
    item_name:        clean(`3Sixty Order #${order.orderNumber || order.orderId}`),
    item_description: itemDesc,
    custom_str1:      clean(order.orderId),
  };

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYFAST_URL;

  Object.entries(fields).forEach(([key, value]) => {
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
