# IIT JEE Note — Automated Email Delivery Server

This server receives Cashfree payment webhooks and automatically sends download links to students via email.

## How It Works

1. Student pays ₹499 on your Cashfree payment form
2. Cashfree sends payment data to this server
3. Server verifies the payment is genuine
4. Server sends a beautiful email with all download links
5. Student gets their notes in under 2 minutes — automatically!

## Setup Instructions

### Step 1: Push to GitHub

1. Create a new repository on GitHub (name it: `iitjeenote-webhook`)
2. Push these files to that repository

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub Repo"
3. Select your `iitjeenote-webhook` repository
4. Railway will auto-detect Node.js and deploy

### Step 3: Add Environment Variables in Railway

Go to your Railway project → Variables tab → Add these:

| Variable | Value |
|---|---|
| CASHFREE_SECRET_KEY | (from Cashfree Dashboard → Developers → API Keys) |
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 587 |
| SMTP_USER | support@iitjeenote.com |
| SMTP_PASS | (Gmail App Password — NOT your regular password) |
| PHYSICS_LINK | (your Google Drive link) |
| CHEMISTRY_LINK | (your Google Drive link) |
| MATHS_LINK | (your Google Drive link) |
| FORMULA_LINK | (your Google Drive link) |
| PYQS_LINK | (your Google Drive link) |
| PREDICTED_LINK | (your Google Drive link) |

### Step 4: Get Your Webhook URL

After deploying, Railway gives you a URL like:
```
https://iitjeenote-webhook-production.up.railway.app
```

Your webhook endpoint is:
```
https://iitjeenote-webhook-production.up.railway.app/api/cashfree-webhook
```

### Step 5: Add to Cashfree

1. Cashfree Dashboard → Developers → Webhooks
2. Click "Add Webhook Endpoint"
3. Paste your Railway URL + `/api/cashfree-webhook`
4. Select latest webhook version
5. Enable "Payment Success" event
6. Save

### Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication (if not already)
3. Go to https://myaccount.google.com/apppasswords
4. Generate a new app password for "Mail"
5. Use that 16-character password as SMTP_PASS

## Testing

Visit your Railway URL in browser — you should see:
```json
{"status":"running","service":"IIT JEE Note — Cashfree Webhook Server"}
```

## Support

If anything breaks, check Railway logs (Dashboard → your project → Logs tab).
