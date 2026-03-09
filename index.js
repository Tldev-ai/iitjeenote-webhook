import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

/* ---------------- EMAIL SETUP ---------------- */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/* ---------------- WEBHOOK ROUTE ---------------- */

app.post("/api/cashfree-webhook", async (req, res) => {
  try {

    console.log("Webhook received");

    const data = req.body;

    if (!data) {
      return res.status(400).send("No data received");
    }

    const paymentStatus = data.data?.payment?.payment_status;

    if (paymentStatus !== "SUCCESS") {
      console.log("Payment not successful");
      return res.status(200).send("Ignored");
    }

    const email =
      data.data?.customer_details?.customer_email ||
      data.data?.order?.customer_details?.customer_email;

    if (!email) {
      console.log("No email found");
      return res.status(200).send("No email");
    }

    console.log("Sending notes to:", email);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your IIT-JEE Handwritten Revision Notes",
      html: `
      <div style="font-family:Arial, sans-serif; line-height:1.6">

      <p>Hello,</p>

      <p>
      Thank you for purchasing the <b>IIT-JEE Handwritten Revision Notes</b>
      from <b>iitjeenotes.com</b>. We truly appreciate your support and trust.
      </p>

      <p>
      These notes are designed to help with fast revision, strong concept clarity,
      and effective preparation for IIT-JEE.
      </p>

      <h3>📚 Access Your Notes</h3>

      <p>
      <a href="https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l">
      Open Google Drive Folder
      </a>
      </p>

      <h3>🔑 Password Information</h3>

      <p>
      The passwords required to open the notes are available inside the Google
      Drive folder as an image file. Please open the image to view the passwords
      for the respective subjects.
      </p>

      <p>
      You may download the notes and keep them saved for convenient access during
      your preparation.
      </p>

      <p>
      We sincerely wish you a focused and successful IIT-JEE preparation journey.
      </p>

      <br>

      <p>
      Best regards,<br>
      <b>Team iiHub LLP</b><br>
      iitjeenotes.com
      </p>

      </div>
      `
    });

    console.log("Email sent successfully");

    res.status(200).send("OK");

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

/* ---------------- SERVER START ---------------- */

app.get("/", (req, res) => {
  res.send("Cashfree Webhook Server Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
