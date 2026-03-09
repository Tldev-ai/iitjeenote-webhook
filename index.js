const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();

// Parse raw body for signature verification + JSON
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// ============================================
// 📧 EMAIL CONFIGURATION
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,     // your email (e.g., support@iitjeenote.com)
    pass: process.env.SMTP_PASS,     // app password (NOT regular password)
  },
});

// ============================================
// 📦 YOUR PRODUCT DETAILS (Edit these)
// ============================================
const PRODUCT = {
  name: 'IIT JEE PCM Handwritten Notes Bundle',
  // Add your actual Google Drive / download links here
  downloadLinks: {
    physics: process.env.PHYSICS_LINK || 'https://drive.google.com/your-physics-link',
    chemistry: process.env.CHEMISTRY_LINK || 'https://drive.google.com/your-chemistry-link',
    maths: process.env.MATHS_LINK || 'https://drive.google.com/your-maths-link',
    formulaSheet: process.env.FORMULA_LINK || 'https://drive.google.com/your-formula-sheet-link',
    pyqs: process.env.PYQS_LINK || 'https://drive.google.com/your-pyqs-link',
    predictedPaper: process.env.PREDICTED_LINK || 'https://drive.google.com/your-predicted-paper-link',
  },
  supportEmail: 'support@iitjeenote.com',
  supportWhatsApp: 'https://wa.me/918639221271',
  website: 'https://www.iitjeenote.com',
};

// ============================================
// 🔐 WEBHOOK SIGNATURE VERIFICATION
// ============================================
function verifyWebhookSignature(timestamp, rawBody, signature) {
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!secretKey) {
    console.error('❌ CASHFREE_SECRET_KEY not set!');
    return false;
  }
  const body = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('base64');
  return expectedSignature === signature;
}

// ============================================
// 📨 DELIVERY EMAIL TEMPLATE
// ============================================
function buildEmailHTML(name, orderId) {
  const links = PRODUCT.downloadLinks;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f7f7f7; font-family: Arial, sans-serif;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; margin-top:20px; margin-bottom:20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:30px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:24px;">🎉 Payment Successful!</h1>
      <p style="color:#e8e0ff; margin:8px 0 0 0; font-size:14px;">Order ID: ${orderId}</p>
    </div>

    <!-- Body -->
    <div style="padding:30px;">
      <p style="font-size:16px; color:#333;">Hi <strong>${name || 'Student'}</strong>,</p>
      <p style="font-size:15px; color:#555; line-height:1.6;">
        Thank you for purchasing the <strong>${PRODUCT.name}</strong>! 🚀<br>
        Your download links are ready. Click below to access your notes:
      </p>

      <!-- Download Links -->
      <div style="background:#f8f6ff; border-radius:10px; padding:20px; margin:20px 0;">
        <h3 style="margin:0 0 15px 0; color:#4a3f8a; font-size:16px;">📥 Your Download Links</h3>
        
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;">
              <a href="${links.physics}" style="color:#667eea; text-decoration:none; font-weight:bold; font-size:15px;">📘 Physics Notes (750+ Pages)</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;">
              <a href="${links.chemistry}" style="color:#667eea; text-decoration:none; font-weight:bold; font-size:15px;">📗 Chemistry Notes (1247+ Pages)</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;">
              <a href="${links.maths}" style="color:#667eea; text-decoration:none; font-weight:bold; font-size:15px;">📙 Maths Notes (726+ Pages)</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Bonus Section -->
      <div style="background:#fff8e1; border-radius:10px; padding:20px; margin:20px 0; border-left:4px solid #ffc107;">
        <h3 style="margin:0 0 15px 0; color:#f57f17; font-size:16px;">🎁 Your FREE Bonuses</h3>
        
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;">
              <a href="${links.formulaSheet}" style="color:#e65100; text-decoration:none; font-size:14px;">⚡ Physics Formula Cheat Sheet</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;">
              <a href="${links.pyqs}" style="color:#e65100; text-decoration:none; font-size:14px;">📝 Top 100 Repeated PYQs</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;">
              <a href="${links.predictedPaper}" style="color:#e65100; text-decoration:none; font-size:14px;">🔮 2026 Predicted Question Paper</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Instructions -->
      <div style="background:#e8f5e9; border-radius:10px; padding:15px; margin:20px 0;">
        <p style="margin:0; font-size:14px; color:#2e7d32;">
          💡 <strong>Tip:</strong> Download all files and save them to your device. You have lifetime access — these links won't expire.
        </p>
      </div>

      <!-- Support -->
      <div style="border-top:1px solid #eee; padding-top:20px; margin-top:20px;">
        <p style="font-size:14px; color:#888; line-height:1.6;">
          Having trouble downloading? Don't worry!<br>
          📧 Reply to this email or mail us at <a href="mailto:${PRODUCT.supportEmail}" style="color:#667eea;">${PRODUCT.supportEmail}</a><br>
          💬 WhatsApp us: <a href="${PRODUCT.supportWhatsApp}" style="color:#667eea;">Click Here</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8f6ff; padding:20px; text-align:center;">
      <p style="margin:0; font-size:13px; color:#999;">
        All the best for JEE 2026! You've got this! 💪
      </p>
      <p style="margin:8px 0 0 0; font-size:12px; color:#bbb;">
        ${PRODUCT.website} | Managed by iihub llp
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================
// 🔔 WEBHOOK ENDPOINT
// ============================================
app.post('/api/cashfree-webhook', async (req, res) => {
  console.log('📩 Webhook received at', new Date().toISOString());

  try {
    // 1. Verify signature (security)
    const timestamp = req.headers['x-cashfree-timestamp'];
    const signature = req.headers['x-cashfree-signature'];

    if (timestamp && signature && process.env.CASHFREE_SECRET_KEY) {
      const isValid = verifyWebhookSignature(timestamp, req.rawBody, signature);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('✅ Signature verified');
    } else {
      console.log('⚠️ Skipping signature verification (key not set or headers missing)');
    }

    // 2. Extract payment data
    const eventData = req.body;
    const paymentData = eventData?.data?.payment || eventData?.data?.order || {};
    const orderData = eventData?.data?.order || {};
    const customerDetails = orderData?.customer_details || paymentData?.customer_details || {};

    const paymentStatus = paymentData?.payment_status || orderData?.order_status || '';
    const email = customerDetails?.customer_email;
    const name = customerDetails?.customer_name || '';
    const phone = customerDetails?.customer_phone || '';
    const orderId = orderData?.order_id || paymentData?.cf_payment_id || 'N/A';

    console.log(`📋 Order: ${orderId} | Status: ${paymentStatus} | Email: ${email}`);

    // 3. Only send email for successful payments
    if (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID') {
      if (!email) {
        console.error('❌ No email found in webhook data');
        return res.status(200).json({ message: 'No email found, skipping' });
      }

      // 4. Send the delivery email
      await transporter.sendMail({
        from: `"IIT JEE Note" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🎉 Your IIT JEE Notes are Ready — Download Now!',
        html: buildEmailHTML(name, orderId),
      });

      console.log(`✅ Email sent to ${email} for order ${orderId}`);
    } else {
      console.log(`⏭️ Skipped — payment status: ${paymentStatus}`);
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Always return 200 so Cashfree doesn't retry endlessly
    res.status(200).json({ message: 'Error processing webhook', error: error.message });
  }
});

// ============================================
// 🏥 HEALTH CHECK (Railway needs this)
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    service: 'IIT JEE Note — Cashfree Webhook Server',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================
// 🚀 START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📡 Endpoint: /api/cashfree-webhook`);
});
