export const orderPlacedAdminTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: white; border-radius: 12px; max-width: 520px; margin: auto; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
    .header { background: #1F3D2E; color: white; padding: 20px 24px; }
    .header h2 { margin: 0; font-size: 20px; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
    .section { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; }
    .section h3 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
    .label { color: #666; }
    .value { font-weight: 600; color: #1a1a1a; }
    .items-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .items-table th { text-align: left; color: #888; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #eee; }
    .items-table td { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
    .items-table td:last-child { text-align: right; font-weight: 600; }
    .total-row { background: #f9fafb; padding: 16px 24px; }
    .total-row .row { font-size: 15px; }
    .total-row .value { color: #1F3D2E; font-size: 18px; }
    .actions { padding: 16px 24px; display: flex; gap: 10px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; }
    .btn-primary { background: #1F3D2E; color: white; }
    .btn-outline { background: white; color: #1F3D2E; border: 1px solid #1F3D2E; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-cod { background: #fef3c7; color: #92400e; }
    .badge-online { background: #d1fae5; color: #065f46; }
    .footer { padding: 14px 24px; background: #f9fafb; text-align: center; font-size: 12px; color: #aaa; }
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
      <div class="row"><span class="label">📍 Address</span><span class="value" style="max-width:280px;text-align:right;">${order.customerDetails.address}</span></div>
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
      <a href="https://maps.google.com/?q=${encodeURIComponent(order.customerDetails.address)}" class="btn btn-outline">🗺️ Maps</a>
      <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5175/orders'}" class="btn btn-primary">📦 Dashboard</a>
    </div>

    <div class="footer">The Butter Bowl Admin Panel • Auto-generated notification</div>
  </div>
</body>
</html>
`;

export const orderConfirmationUserTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: white; border-radius: 12px; max-width: 520px; margin: auto; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
    .header { background: #1F3D2E; color: white; padding: 24px; text-align: center; }
    .header h2 { margin: 0 0 6px; font-size: 22px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.8; }
    .greeting { padding: 20px 24px 0; font-size: 15px; color: #333; }
    .section { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; }
    .section h3 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
    .label { color: #666; }
    .value { font-weight: 600; color: #1a1a1a; }
    .items-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .items-table th { text-align: left; color: #888; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #eee; }
    .items-table td { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
    .items-table td:last-child { text-align: right; font-weight: 600; }
    .total-row { background: #f9fafb; padding: 16px 24px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-cod { background: #fef3c7; color: #92400e; }
    .badge-online { background: #d1fae5; color: #065f46; }
    .track-box { margin: 20px 24px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 14px 18px; text-align: center; }
    .track-box p { margin: 0 0 10px; font-size: 14px; color: #166534; }
    .track-btn { display: inline-block; background: #1F3D2E; color: white; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; }
    .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #aaa; background: #f9fafb; }
    .footer a { color: #1F3D2E; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">

    <!-- Header -->
    <div class="header">
      <h2>✅ Order Confirmed!</h2>
      <p>${order.orderNumber} • ${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
    </div>

    <!-- Greeting -->
    <p class="greeting">Hi <b>${order.customerDetails.name}</b>, your order has been placed successfully! 🎉<br/>
    We'll start preparing it right away.</p>

    <!-- Items -->
    <div class="section">
      <h3>🍲 Your Items</h3>
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

    <!-- Delivery -->
    <div class="section">
      <h3>📍 Delivery Details</h3>
      <div class="row"><span class="label">Address</span><span class="value" style="max-width:280px;text-align:right;">${order.customerDetails.address}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${order.customerDetails.phone}</span></div>
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
        <span class="label" style="font-weight:700;font-size:15px;">💰 Total Paid</span>
        <span class="value" style="font-size:20px;color:#1F3D2E;">₹${order.finalAmount || order.totalAmount}</span>
      </div>
    </div>

    <div class="footer">
      Thank you for ordering from <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">The Butter Bowl</a> 🧈<br/>
      Questions? Call us or reply to this email.
    </div>

  </div>
</body>
</html>
`;