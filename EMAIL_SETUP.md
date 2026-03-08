# Email Feature Setup Guide

Your HustleIT platform now has email functionality integrated! Follow these steps to enable sending invoices to your clients.

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com
2. Click "Sign up free"
3. Create an account (you can use GitHub or email)

### Step 2: Add Email Service
1. In the EmailJS dashboard, go to **Email Services** (left sidebar)
2. Click **Add Service**
3. Select your email provider:
   - **Gmail**: Select "Gmail" and click connect. Authorize EmailJS
   - **Outlook**: Select "Outlook" and enter your credentials
   - **Yahoo**: Select "Yahoo Mail" and enter credentials
4. Click **Create Service**
5. Copy your **Service ID** (format: `service_xxxxx`)

### Step 3: Create Email Template
1. Go to **Email Templates** in the sidebar
2. Click **Create New Template**
3. Fill in:
   - **Template Name**: "Invoice Email"
   - **Subject**: `Invoice {{invoice_number}} from {{business_name}}`
4. Replace the default content with this HTML template:

```html
<h2>Invoice {{invoice_number}}</h2>
<p>Dear {{client_name}},</p>

<p>Thank you for your business! Please find your invoice details below:</p>

<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
  <tr style="border-bottom: 1px solid #ddd;">
    <td style="padding: 8px; font-weight: bold;">Project:</td>
    <td style="padding: 8px;">{{project_name}}</td>
  </tr>
  <tr style="border-bottom: 1px solid #ddd;">
    <td style="padding: 8px; font-weight: bold;">Amount:</td>
    <td style="padding: 8px;">${{amount}}</td>
  </tr>
  <tr style="border-bottom: 1px solid #ddd;">
    <td style="padding: 8px; font-weight: bold;">Issue Date:</td>
    <td style="padding: 8px;">{{issue_date}}</td>
  </tr>
  <tr style="border-bottom: 1px solid #ddd;">
    <td style="padding: 8px; font-weight: bold;">Due Date:</td>
    <td style="padding: 8px;">{{due_date}}</td>
  </tr>
  <tr style="border-bottom: 1px solid #ddd;">
    <td style="padding: 8px; font-weight: bold;">Payment Terms:</td>
    <td style="padding: 8px;">{{payment_terms}}</td>
  </tr>
</table>

<p><strong>Notes:</strong><br>{{notes}}</p>

<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

<p>Invoice from:</p>
<p>
  <strong>{{business_name}}</strong><br>
  Email: {{business_email}}
</p>

<p style="font-size: 12px; color: #666; margin-top: 30px;">
  Thank you for your business!
</p>
```

5. Click **Save Template**
6. Copy your **Template ID** (format: `template_xxxxx`)

### Step 4: Get Your Public Key
1. Go to **Account** > **API Keys** in the top right
2. Copy your **Public Key** (format: `sk_xxxxx`)

### Step 5: Add Credentials to Your App
1. Create a `.env` file in the root of your project (same level as `package.json`)
2. Add these three lines:

```env
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
```

Replace the values with your actual IDs from EmailJS.

### Step 6: Restart Your App
```bash
npm start
```

## Using the Email Feature

1. Go to the **Invoices** page
2. Each invoice row now has an **envelope icon** button
3. Click the envelope button to send the invoice to the client
4. You'll see a success or error message at the top

## Troubleshooting

### "EmailJS not configured" error
- Make sure your `.env` file is in the root directory
- Check that all three environment variables are set correctly
- Restart your dev server after creating/modifying `.env`

### Email not sending
- Verify your email service is **connected** in EmailJS (green status)
- Check that the client email in the invoice is valid
- Make sure your email service is **active** (not paused)

### Template variables not showing
- The template must have variables in the format: `{{variable_name}}`
- Check the [emailService.js](src/services/emailService.js) file to see which variables are available

## Available Template Variables

- `{{to_email}}` - Recipient email address
- `{{client_name}}` - Client's full name
- `{{company_name}}` - Client's company
- `{{invoice_number}}` - Invoice number (e.g., INV-001)
- `{{amount}}` - Invoice amount
- `{{currency}}` - Currency (e.g., CAD)
- `{{issue_date}}` - Date invoice was issued
- `{{due_date}}` - Payment due date
- `{{project_name}}` - Name of the project
- `{{payment_terms}}` - Payment terms (e.g., Net 30)
- `{{notes}}` - Invoice notes
- `{{business_name}}` - Your business name
- `{{business_email}}` - Your business email

## Next Steps

- Add payment reminders (automatic emails for overdue invoices)
- Create email templates for quotes, estimates, and receipts
- Set up automated follow-ups for unpaid invoices

## Support

For EmailJS support: https://www.emailjs.com/docs/
