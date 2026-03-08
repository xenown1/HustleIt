import emailjs from '@emailjs/browser';

// Read env variables
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS only if key exists
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
} else {
  console.warn('⚠️ EmailJS PUBLIC_KEY missing. Check your .env file.');
}

/**
 * Send invoice email to client
 * @param {Object} invoice - Invoice object
 * @param {Object} settingForms - Business settings with email, name, etc.
 * @returns {Promise}
 */
export const sendInvoiceEmail = async (invoice, settingForms) => {
  try {
    if (!invoice.clientEmail) throw new Error('Client email is missing');

    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      throw new Error('EmailJS not configured. Check your environment variables.');
    }

    const templateParams = {
        to_email: invoice.clientEmail,
        client_name: invoice.clientName,
        company_name: invoice.companyName,
        invoice_number: invoice.invoiceNumber,
        amount: invoice.amount,
        currency: settingForms.currency || 'CAD',
        due_date: invoice.dueDate,
        issue_date: invoice.issueDate,
        notes: invoice.notes || 'Thank you for your business!',
        business_name: settingForms.businessName,
        business_email: settingForms.email,
        payment_terms: invoice.paymentTerms || 'Net 30',
        project_name: invoice.projectName,
    };
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    return { success: true, message: `Invoice sent to ${invoice.clientEmail}`, response };
  } catch (error) {
    console.error('Invoice email error:', error);
    return { success: false, message: error.message || 'Failed to send invoice', error };
  }
};

/**
 * Send payment reminder email
 * @param {Object} invoice - Invoice object
 * @param {Object} settingForms - Business settings
 * @returns {Promise}
 */
export const sendPaymentReminder = async (invoice, settingForms) => {
  try {
    if (!invoice.clientEmail) throw new Error('Client email is missing');

    if (!PUBLIC_KEY || !SERVICE_ID) {
      throw new Error('EmailJS not configured. Check your environment variables.');
    }

    const templateParams = {
      to_email: invoice.clientEmail,
      client_name: invoice.clientName,
      invoice_number: invoice.invoiceNumber,
      amount: invoice.amount,
      due_date: invoice.dueDate,
      business_name: settingForms.businessName,
      business_email: settingForms.email,
    };

    const response = await emailjs.send(SERVICE_ID, 'template_reminder', templateParams);
    return { success: true, message: `Payment reminder sent to ${invoice.clientEmail}`, response };
  } catch (error) {
    console.error('Payment reminder error:', error);
    return { success: false, message: error.message || 'Failed to send reminder', error };
  }
};