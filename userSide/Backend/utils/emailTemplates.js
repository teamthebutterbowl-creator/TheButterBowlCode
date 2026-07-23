// const formatAddress = (address) => {
//   if (!address) return '';

//   // Address already provided as a plain string
//   if (typeof address === 'string') return address;

//   // Address provided as a structured object: { houseNo, locality, landmark, pincode, city }
//   const { houseNo, locality, landmark, city, pincode } = address;
//   const parts = [houseNo, locality, landmark, city].filter(Boolean);
//   let formatted = parts.join(', ');
//   if (pincode) formatted += ` - ${pincode}`;
//   return formatted;
// };
// export const orderPlacedAdminTemplate = (order) => {
//   const deliveryAddress = formatAddress(order.customerDetails.address);
 
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8"/>
//   <style>
//     body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
//     .card { background: white; border-radius: 12px; max-width: 520px; margin: auto; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
//     .header { background: #1F3D2E; color: white; padding: 20px 24px; }
//     .header h2 { margin: 0; font-size: 20px; }
//     .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
//     .section { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; }
//     .section h3 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
//     .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
//     .label { color: #666; }
//     .value { font-weight: 600; color: #1a1a1a; }
//     .items-table { width: 100%; border-collapse: collapse; font-size: 14px; }
//     .items-table th { text-align: left; color: #888; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #eee; }
//     .items-table td { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
//     .items-table td:last-child { text-align: right; font-weight: 600; }
//     .total-row { background: #f9fafb; padding: 16px 24px; }
//     .total-row .row { font-size: 15px; }
//     .total-row .value { color: #1F3D2E; font-size: 18px; }
//     .actions { padding: 16px 24px; display: flex; gap: 10px; flex-wrap: wrap; }
//     .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; }
//     .btn-primary { background: #1F3D2E; color: white; }
//     .btn-outline { background: white; color: #1F3D2E; border: 1px solid #1F3D2E; }
//     .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
//     .badge-cod { background: #fef3c7; color: #92400e; }
//     .badge-online { background: #d1fae5; color: #065f46; }
//     .footer { padding: 14px 24px; background: #f9fafb; text-align: center; font-size: 12px; color: #aaa; }
//   </style>
// </head>
// <body>
//   <div class="card">
    
//     <!-- Header -->
//     <div class="header">
//       <h2>🛒 New Order Received</h2>
//       <p>${order.orderNumber} • ${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
//     </div>
 
//     <!-- Customer Details -->
//     <div class="section">
//       <h3>👤 Customer</h3>
//       <div class="row"><span class="label">Name</span><span class="value">${order.customerDetails.name}</span></div>
//       <div class="row"><span class="label">📞 Phone</span><span class="value">${order.customerDetails.phone}</span></div>
//       <div class="row"><span class="label">📍 Address</span><span class="value" style="max-width:280px;text-align:right;">${deliveryAddress}</span></div>
//     </div>
 
//     <!-- Items -->
//     <div class="section">
//       <h3>🍲 Items</h3>
//       <table class="items-table">
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th>Qty</th>
//             <th>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${order.orderedItems.map(item => `
//             <tr>
//               <td>${item.name}</td>
//               <td style="color:#888;">×${item.quantity}</td>
//               <td>₹${item.price * item.quantity}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>
 
//     <!-- Payment & Total -->
//     <div class="total-row">
//       <div class="row">
//         <span class="label">Payment</span>
//         <span class="badge ${order.paymentMethod === 'COD' ? 'badge-cod' : 'badge-online'}">
//           ${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Paid Online'}
//         </span>
//       </div>
//       ${order.offerDiscount > 0 ? `
//       <div class="row" style="margin-top:8px;">
//         <span class="label">Offer Discount</span>
//         <span class="value" style="color:#16a34a;">− ₹${order.offerDiscount}</span>
//       </div>` : ''}
//       ${order.couponDiscount > 0 ? `
//       <div class="row">
//         <span class="label">Coupon Discount</span>
//         <span class="value" style="color:#16a34a;">− ₹${order.couponDiscount}</span>
//       </div>` : ''}
//       <div class="row" style="margin-top:8px;">
//         <span class="label" style="font-weight:700;font-size:15px;">💰 Final Amount</span>
//         <span class="value" style="font-size:20px;color:#1F3D2E;">₹${order.finalAmount || order.totalAmount}</span>
//       </div>
//     </div>
 
//     <!-- Actions -->
//     <div class="actions">
//       <a href="tel:${order.customerDetails.phone}" class="btn btn-outline">📞 Call</a>
//       <a href="https://wa.me/91${order.customerDetails.phone}" class="btn btn-outline">💬 WhatsApp</a>
//       <a href="https://maps.google.com/?q=${encodeURIComponent(deliveryAddress)}" class="btn btn-outline">🗺️ Maps</a>
//       <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5175/orders'}" class="btn btn-primary">📦 Dashboard</a>
//     </div>
 
//     <div class="footer">The Butter Bowl Admin Panel • Auto-generated notification</div>
//   </div>
// </body>
// </html>
// `;
// };




// export const orderConfirmationUserTemplate = (order) => {
//   const itemTotal = order.orderedItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const deliveryAddress = formatAddress(order.customerDetails.address);

//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8"/>
//   <style>
//     body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
//     .card { background: white; border-radius: 14px; max-width: 560px; margin: auto; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }

//     .header { background: #1F3D2E; color: white; padding: 32px 24px; text-align: center; }
//     .header .brand-sub { font-size: 20px; font-style: italic; color: #e7c98a; font-family: Georgia, serif; }
//     .header .brand-main { font-size: 30px; font-weight: bold; color: #ffffff; font-family: Georgia, serif; margin-top: 2px; }
//     .header .brand-tag { font-size: 11px; letter-spacing: 2px; color: #e7c98a; margin-top: 6px; }

//     .confirm { padding: 28px 24px 6px; text-align: center; }
//     .confirm .check { width: 52px; height: 52px; background: #2fa84f; border-radius: 50%; line-height: 52px; margin: 0 auto 14px; color: #fff; font-size: 26px; }
//     .confirm h2 { margin: 0 0 12px; font-size: 22px; color: #1F3D2E; font-family: Georgia, serif; }

//     .greeting { padding: 0 24px 4px; font-size: 15px; color: #333; text-align: center; line-height: 1.5; }

//     .order-meta { margin: 20px 24px 0; background: #1F3D2E; border-radius: 10px; display: flex; }
//     .order-meta > div { flex: 1; padding: 16px 20px; }
//     .order-meta > div:first-child { border-right: 1px solid #2c5541; }
//     .order-meta .meta-label { font-size: 11px; letter-spacing: 1px; color: #c9d6cc; }
//     .order-meta .meta-value { font-size: 16px; font-weight: bold; color: #fff; margin-top: 4px; }

//     .track-box { margin: 20px 24px 0; background: #f0fdf4; border: 1px dashed #86efac; border-radius: 10px; padding: 16px 18px; text-align: center; }
//     .track-box p { margin: 0 0 10px; font-size: 13px; color: #166534; }
//     .track-btn { display: inline-block; background: #2fa84f; color: white; padding: 10px 22px; border-radius: 24px; font-size: 13px; font-weight: 600; text-decoration: none; }

//     .section { padding: 20px 24px; border-bottom: 1px solid #f0f0f0; }
//     .section h3 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
//     .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
//     .label { color: #666; }
//     .value { font-weight: 600; color: #1a1a1a; }

//     .items-table { width: 100%; border-collapse: collapse; font-size: 14px; }
//     .items-table th { text-align: left; color: #888; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #eee; }
//     .items-table td { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
//     .items-table td:last-child { text-align: right; font-weight: 600; }

//     .total-row { background: #f9fafb; padding: 18px 24px; }
//     .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
//     .badge-cod { background: #fef3c7; color: #92400e; }
//     .badge-online { background: #d1fae5; color: #065f46; }

//     .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #aaa; background: #f9fafb; }
//     .footer a { color: #1F3D2E; text-decoration: none; font-weight: 600; }
//     .thanks { padding: 20px 24px 28px; text-align: center; }
//     .thanks .line1 { font-size: 14px; font-weight: bold; color: #1F3D2E; }
//     .thanks .line2 { font-size: 13px; color: #666; margin-top: 4px; }
//   </style>
// </head>
// <body>
//   <div class="card">

//     <!-- Header -->
//     <div class="header">
//       <div class="brand-sub">The</div>
//       <div class="brand-main">Butter Bowl</div>
//       <div class="brand-tag">THE BOWL THAT MELTS HEARTS</div>
//     </div>

//     <!-- Confirmation -->
//     <div class="confirm">
//       <div class="check">&#10003;</div>
//       <h2>Your Order is Confirmed!</h2>
//     </div>

//     <!-- Greeting -->
//     <p class="greeting">
//       Hi <b>${order.customerDetails.name}</b>,<br/>
//       Thank you for ordering from The Butter Bowl.<br/>
//       We've received your order and our chefs have already started preparing your delicious meal.
//     </p>

//     <!-- Order ID / Date -->
//     <div class="order-meta">
//       <div>
//         <div class="meta-label">ORDER ID</div>
//         <div class="meta-value">${order.orderNumber}</div>
//       </div>
//       <div>
//         <div class="meta-label">DATE &amp; TIME</div>
//         <div class="meta-value">${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
//       </div>
//     </div>

//     ${
//       order.trackingUrl
//         ? `
//     <!-- Track order -->
//     <div class="track-box">
//       <p>You can track your order anytime. Real-time updates from our kitchen to your doorstep.</p>
//       <a class="track-btn" href="${order.trackingUrl}">Track My Order &rsaquo;</a>
//     </div>`
//         : ''
//     }

//     <!-- Delivery -->
//     <div class="section">
//       <h3>📍 Delivery Details</h3>
//       <div class="row"><span class="label">Name</span><span class="value">${order.customerDetails.name}</span></div>
//       <div class="row"><span class="label">Phone</span><span class="value">${order.customerDetails.phone}</span></div>
//       <div class="row"><span class="label">Address</span><span class="value" style="max-width:280px;text-align:right;">${deliveryAddress}</span></div>
//     </div>

//     <!-- Items -->
//     <div class="section">
//       <h3>🍲 Your Ordered Items</h3>
//       <table class="items-table">
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th>Qty</th>
//             <th>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${order.orderedItems.map(item => `
//             <tr>
//               <td>${item.name}</td>
//               <td style="color:#888;">×${item.quantity}</td>
//               <td>₹${item.price * item.quantity}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>

//     <!-- Payment & Total -->
//     <div class="total-row">
//       <div class="row">
//         <span class="label">Payment</span>
//         <span class="badge ${order.paymentMethod === 'COD' ? 'badge-cod' : 'badge-online'}">
//           ${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Paid Online'}
//         </span>
//       </div>
//       <div class="row" style="margin-top:10px;">
//         <span class="label">Item Total</span>
//         <span class="value">₹${itemTotal}</span>
//       </div>
//       ${order.offerDiscount > 0 ? `
//       <div class="row">
//         <span class="label">Offer Discount</span>
//         <span class="value" style="color:#16a34a;">− ₹${order.offerDiscount}</span>
//       </div>` : ''}
//       ${order.couponDiscount > 0 ? `
//       <div class="row">
//         <span class="label">Coupon Discount</span>
//         <span class="value" style="color:#16a34a;">− ₹${order.couponDiscount}</span>
//       </div>` : ''}
//       <div class="row" style="margin-top:8px;">
//         <span class="label" style="font-weight:700;font-size:15px;">💰 Total Paid</span>
//         <span class="value" style="font-size:20px;color:#1F3D2E;">₹${order.finalAmount || order.totalAmount}</span>
//       </div>
//     </div>

//     <!-- Thank you -->
//     <div class="thanks">
//       <div class="line1">Thank you for choosing The Butter Bowl ❤️</div>
//       <div class="line2">We truly appreciate your order and can't wait to serve you again!</div>
//     </div>

//     <div class="footer">
//       Questions about your order? Visit <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">The Butter Bowl</a> or reply to this email.
//     </div>

//   </div>
// </body>
// </html>
// `;
// };




const formatAddress = (address) => {
  if (!address) return '';

  // Address already provided as a plain string
  if (typeof address === 'string') return address;

  // Address provided as a structured object: { houseNo, locality, landmark, pincode, city }
  const { houseNo, locality, landmark, city, pincode } = address;
  const parts = [houseNo, locality, landmark, city].filter(Boolean);
  let formatted = parts.join(', ');
  if (pincode) formatted += ` - ${pincode}`;
  return formatted;
};

// Shared design tokens/classes used by BOTH email templates.
// Keeping this in one place means .card, .section, .row, .items-table,
// .badge, .total-row and .footer will always look identical across
// every email we send — change it here once, both templates update.
const baseStyles = `
  body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
  .card { background: white; border-radius: 14px; max-width: 560px; margin: auto; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }

  .section { padding: 20px 24px; border-bottom: 1px solid #f0f0f0; }
  .section h3 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
  .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
  .label { color: #666; }
  .value { font-weight: 600; color: #1a1a1a; }

  .items-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .items-table th { text-align: left; color: #888; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #eee; }
  .items-table td { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .items-table td:last-child { text-align: right; font-weight: 600; }

  .total-row { background: #f9fafb; padding: 18px 24px; }
  .total-row .row:last-child { margin-bottom: 0; }

  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-cod { background: #fef3c7; color: #92400e; }
  .badge-online { background: #d1fae5; color: #065f46; }

  .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #aaa; background: #f9fafb; }
  .footer a { color: #1F3D2E; text-decoration: none; font-weight: 600; }
`;

export const orderPlacedAdminTemplate = (order) => {
  const deliveryAddress = formatAddress(order.customerDetails.address);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    ${baseStyles}

    /* --- Admin-only styles --- */
    .header { background: #1F3D2E; color: white; padding: 20px 24px; }
    .header h2 { margin: 0; font-size: 20px; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }

    .total-row .row { font-size: 15px; }
    .total-row .value { color: #1F3D2E; font-size: 18px; }

    .actions { padding: 16px 24px; display: flex; gap: 10px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; }
    .btn-primary { background: #1F3D2E; color: white; }
    .btn-outline { background: white; color: #1F3D2E; border: 1px solid #1F3D2E; }
  </style>
</head>
<body>
  <div class="card">

    <!-- Header -->
    <div class="header">
      <h2>🛒 New Order Received</h2>
      <p>${order.orderNumber} • ${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
    </div>

    <!-- Customer Details -->
    <div class="section">
      <h3>👤 Customer</h3>
      <div class="row"><span class="label">Name</span><span class="value">${order.customerDetails.name}</span></div>
      <div class="row"><span class="label">📞 Phone</span><span class="value">${order.customerDetails.phone}</span></div>
      <div class="row"><span class="label">📍 Address</span><span class="value" style="max-width:280px;text-align:right;">${deliveryAddress}</span></div>
    </div>

    <!-- Items -->
    <div class="section">
      <h3>🍲 Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderedItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="color:#888;">×${item.quantity}</td>
              <td>₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Payment & Total -->
    <div class="total-row">
      <div class="row">
        <span class="label">Payment</span>
        <span class="badge ${order.paymentMethod === 'COD' ? 'badge-cod' : 'badge-online'}">
          ${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Paid Online'}
        </span>
      </div>
      ${order.offerDiscount > 0 ? `
      <div class="row" style="margin-top:8px;">
        <span class="label">Offer Discount</span>
        <span class="value" style="color:#16a34a;">− ₹${order.offerDiscount}</span>
      </div>` : ''}
      ${order.couponDiscount > 0 ? `
      <div class="row">
        <span class="label">Coupon Discount</span>
        <span class="value" style="color:#16a34a;">− ₹${order.couponDiscount}</span>
      </div>` : ''}
      <div class="row" style="margin-top:8px;">
        <span class="label" style="font-weight:700;font-size:15px;">💰 Final Amount</span>
        <span class="value" style="font-size:20px;color:#1F3D2E;">₹${order.finalAmount || order.totalAmount}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <a href="tel:${order.customerDetails.phone}" class="btn btn-outline">📞 Call</a>
      <a href="https://wa.me/91${order.customerDetails.phone}" class="btn btn-outline">💬 WhatsApp</a>
      <a href="https://maps.google.com/?q=${encodeURIComponent(deliveryAddress)}" class="btn btn-outline">🗺️ Maps</a>
      <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5175/orders'}" class="btn btn-primary">📦 Dashboard</a>
    </div>

    <div class="footer">The Butter Bowl Admin Panel • Auto-generated notification</div>
  </div>
</body>
</html>
`;
};

export const orderConfirmationUserTemplate = (order) => {
  const itemTotal = order.orderedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryAddress = formatAddress(order.customerDetails.address);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    ${baseStyles}

    /* --- User-facing-only styles --- */
    .header { background: #1F3D2E; color: white; padding: 32px 24px; text-align: center; }
    .header .brand-sub { font-size: 20px; font-style: italic; color: #e7c98a; font-family: Georgia, serif; }
    .header .brand-main { font-size: 30px; font-weight: bold; color: #ffffff; font-family: Georgia, serif; margin-top: 2px; }
    .header .brand-tag { font-size: 11px; letter-spacing: 2px; color: #e7c98a; margin-top: 6px; }

    .confirm { padding: 28px 24px 6px; text-align: center; }
    .confirm .check { width: 52px; height: 52px; background: #2fa84f; border-radius: 50%; line-height: 52px; margin: 0 auto 14px; color: #fff; font-size: 26px; }
    .confirm h2 { margin: 0 0 12px; font-size: 22px; color: #1F3D2E; font-family: Georgia, serif; }

    .greeting { padding: 0 24px 4px; font-size: 15px; color: #333; text-align: center; line-height: 1.5; }

    .order-meta { margin: 20px 24px 0; background: #1F3D2E; border-radius: 10px; display: flex; }
    .order-meta > div { flex: 1; padding: 16px 20px; }
    .order-meta > div:first-child { border-right: 1px solid #2c5541; }
    .order-meta .meta-label { font-size: 11px; letter-spacing: 1px; color: #c9d6cc; }
    .order-meta .meta-value { font-size: 16px; font-weight: bold; color: #fff; margin-top: 4px; }

    .track-box { margin: 20px 24px 0; background: #f0fdf4; border: 1px dashed #86efac; border-radius: 10px; padding: 16px 18px; text-align: center; }
    .track-box p { margin: 0 0 10px; font-size: 13px; color: #166534; }
    .track-btn { display: inline-block; background: #2fa84f; color: white; padding: 10px 22px; border-radius: 24px; font-size: 13px; font-weight: 600; text-decoration: none; }

    .thanks { padding: 20px 24px 28px; text-align: center; }
    .thanks .line1 { font-size: 14px; font-weight: bold; color: #1F3D2E; }
    .thanks .line2 { font-size: 13px; color: #666; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="card">

    <!-- Header -->
    <div class="header">
      <div class="brand-sub">The</div>
      <div class="brand-main">Butter Bowl</div>
      <div class="brand-tag">THE BOWL THAT MELTS HEARTS</div>
    </div>

    <!-- Confirmation -->
    <div class="confirm">
      <div class="check">&#10003;</div>
      <h2>Your Order is Confirmed!</h2>
    </div>

    <!-- Greeting -->
    <p class="greeting">
      Hi <b>${order.customerDetails.name}</b>,<br/>
      Thank you for ordering from The Butter Bowl.<br/>
      We've received your order and our chefs have already started preparing your delicious meal.
    </p>

    <!-- Order ID / Date -->
    <div class="order-meta">
      <div>
        <div class="meta-label">ORDER ID</div>
        <div class="meta-value">${order.orderNumber}</div>
      </div>
      <div>
        <div class="meta-label">DATE &amp; TIME</div>
        <div class="meta-value">${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
      </div>
    </div>

    ${
      order.trackingUrl
        ? `
    <!-- Track order -->
    <div class="track-box">
      <p>You can track your order anytime. Real-time updates from our kitchen to your doorstep.</p>
      <a class="track-btn" href="${order.trackingUrl}">Track My Order &rsaquo;</a>
    </div>`
        : ''
    }

    <!-- Delivery -->
    <div class="section">
      <h3>📍 Delivery Details</h3>
      <div class="row"><span class="label">Name</span><span class="value">${order.customerDetails.name}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${order.customerDetails.phone}</span></div>
      <div class="row"><span class="label">Address</span><span class="value" style="max-width:280px;text-align:right;">${deliveryAddress}</span></div>
    </div>

    <!-- Items -->
    <div class="section">
      <h3>🍲 Your Ordered Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderedItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="color:#888;">×${item.quantity}</td>
              <td>₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Payment & Total -->
    <div class="total-row">
      <div class="row">
        <span class="label">Payment</span>
        <span class="badge ${order.paymentMethod === 'COD' ? 'badge-cod' : 'badge-online'}">
          ${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Paid Online'}
        </span>
      </div>
      <div class="row" style="margin-top:10px;">
        <span class="label">Item Total</span>
        <span class="value">₹${itemTotal}</span>
      </div>
      ${order.offerDiscount > 0 ? `
      <div class="row">
        <span class="label">Offer Discount</span>
        <span class="value" style="color:#16a34a;">− ₹${order.offerDiscount}</span>
      </div>` : ''}
      ${order.couponDiscount > 0 ? `
      <div class="row">
        <span class="label">Coupon Discount</span>
        <span class="value" style="color:#16a34a;">− ₹${order.couponDiscount}</span>
      </div>` : ''}
      <div class="row" style="margin-top:8px;">
        <span class="label" style="font-weight:700;font-size:15px;">💰 Total Paid</span>
        <span class="value" style="font-size:20px;color:#1F3D2E;">₹${order.finalAmount || order.totalAmount}</span>
      </div>
    </div>

    <!-- Thank you -->
    <div class="thanks">
      <div class="line1">Thank you for choosing The Butter Bowl ❤️</div>
      <div class="line2">We truly appreciate your order and can't wait to serve you again!</div>
    </div>

    <div class="footer">
      Questions about your order? Visit <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">The Butter Bowl</a> or reply to this email.
    </div>

  </div>
</body>
</html>
`;
};