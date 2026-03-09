const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

/* EMAIL SETUP */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/* CASHFREE WEBHOOK ROUTE */

app.post("/api/cashfree-webhook", async (req, res) => {
  try {

    console.log("Webhook received");

    const data = req.body;

    const paymentStatus = data?.data?.payment?.payment_status;

    if (paymentStatus !== "SUCCESS") {
      return res.status(200).send("Ignored");
    }

    const email =
      data?.data?.customer_details?.customer_email ||
      data?.data?.order?.customer_details?.customer_email;

    if (!email) {
      return res.status(200).send("No email");
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your IIT-JEE Handwritten Revision Notes",
      html: `
Hello

Thank you for purchasing the IIT-JEE Handwritten Revision Notes.

📚 Access your notes:
https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l

🔑 Passwords are inside the drive folder image.

Best regards  
Team iiHub LLP
`
    });

    console.log("Email sent to:", email);

    res.status(200).send("OK");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

/* EMAIL FROM SUCCESS PAGE */

app.post("/send-email", async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email missing");
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your IIT-JEE Handwritten Revision Notes",
      html: `
Hello

Thank you for purchasing the IIT-JEE Handwritten Revision Notes.

📚 Access your notes:
https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l

🔑 Passwords are inside the drive folder image.

Best regards  
Team iiHub LLP
`
    });

    console.log("Email sent to:", email);

    res.json({ success: true });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("Email failed");
  }
});

/* SERVER */

app.get("/", (req, res) => {
  res.send("Cashfree Webhook Server Running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
