await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "Your IIT-JEE Handwritten Revision Notes Access",
  html: `
  <div style="font-family:Arial,sans-serif;line-height:1.6">

  <p>Hello,</p>

  <p>Thank you for purchasing the <b>IIT-JEE Handwritten Revision Notes</b> from <b>iitjeenotes.com</b>.  
  We truly appreciate your support and trust.</p>

  <p>These notes are designed to help with <b>fast revision, strong concept clarity, and effective preparation for IIT-JEE.</b></p>

  <h3>📚 Access Your Notes</h3>

  <p>
  Google Drive Link:<br>
  <a href="https://drive.google.com/drive/folders/17zaLxIhNnY0m0pY2Axfa8UuKV2ELaT4l">
  Open Notes Folder
  </a>
  </p>

  <h3>🔑 Password Information</h3>

  <p>
  The passwords required to open the notes are available inside the Google Drive folder as an image file.
  Please open the image to view the passwords for the respective subjects.
  </p>

  <p>
  You may download the notes and keep them saved for convenient access during your preparation.
  </p>

  <p>
  We sincerely wish you a focused and successful IIT-JEE preparation journey.
  With consistent practice, revision, and strong conceptual understanding, great results are absolutely achievable.
  </p>

  <br>

  <p>Best regards,<br>
  <b>Team iiHub LLP</b><br>
  iitjeenotes.com
  </p>

  </div>
  `
});
