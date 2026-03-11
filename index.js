const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const EMAIL_HTML = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2>IIT-JEE Handwritten Revision Notes</h2>
    <p>Hello,</p>
    <p>Thank you for purchasing the IIT-JEE Handwritten Revision Notes.</p>
    <p>📚 <strong>Access your notes:</strong><br/><br/>
      <a href="https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l">
        Click here to open Google Drive
      </a>
    </p>
    <p>🔑 <strong>Passwords are inside the drive folder image.</strong></p>
    <p>Best regards,<br/><strong>Team iiHub LLP</strong></p>
  </div>
`;

app.get("/", (req, res) => {
  res.send("Webhook Server Running");
});

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Railway SMTP Test",
      text: "Gmail SMTP is working on Railway!"
    });
    res.send("Test email sent! Check inbox.");
  } catch (err) {
    res.status(500).send("FAILED: " + err.message);
  }
});

app.post("/api/cashfree-webhook", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));
    const data = req.body;
    const paymentStatus = data && data.data && data.data.payment && data.data.payment.payment_status;
    console.log("Payment status:", paymentStatus);
    if (paymentStatus !== "SUCCESS") {
      return res.status(200).send("Ignored");
    }
    const email = (data.data.customer_details && data.data.customer_details.customer_email) || (data.data.order && data.data.order.customer_details && data.data.order.customer_details.customer_email);
    console.log("Customer email:", email);
    if (!email) {
      return res.status(200).send("No email found");
    }
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your IIT-JEE Handwritten Revision Notes",
      text: "Thank you for purchasing IIT-JEE Notes. Access: https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l Passwords are inside the drive folder image. Team iiHub LLP",
      html: EMAIL_HTML
    });
    console.log("Email sent to:", email);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Server Error");
  }
});

app.post("/send-email", async (req, res) => {
  try {
    const email = req.body && req.body.email;
    if (!email) {
      return res.status(400).send("Email missing");
    }
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your IIT-JEE Handwritten Revision Notes",
      text: "Thank you for purchasing IIT-JEE Notes. Access: https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l Passwords are inside the drive folder image. Team iiHub LLP",
      html: EMAIL_HTML
    });
    console.log("Email sent to:", email);
    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Email failed: " + err.message);
  }
});

app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
