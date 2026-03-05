import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";

const formatCurrency = amount =>
  Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const formatDate = dateString =>
  new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function PrintableInvoice({ invoice }) {
    const { settingForms, clients } = useContext(UserContext);
    const client = clients.find(c => c.id === invoice.clientId) || {};
    const paymentText = invoice.paymentTerms || client.paymentType || 'n/a';
    
  return (
    <div className="print-page">
        <div className="invoice-header">
            <div className="invoice-brand">
                <h1>{settingForms.businessName}</h1>
                <p>{settingForms.address}</p>
                <p>{settingForms.email}</p>
                <p>{settingForms.phone}</p>
            </div>
            
        <div className="invoice-meta">
            <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Issue Date:</strong> {formatDate(invoice.issueDate)}</p>
            <p><strong>Payment:</strong> {paymentText}</p>
            <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
        </div>
    </div>

    <div className="invoice-client">
        <h3>Bill To</h3>
        <p>{invoice.clientName}</p>
        <p>{invoice.companyName}</p>
        <p>{invoice.clientEmail}</p>
    </div>


    <table className="invoice-table">
        <thead>
            <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Amount ({settingForms.currency})</th>
            </tr>
        </thead>
        <tbody>
            <tr className="change-color">
                <td>{invoice.projectName}</td>
                <td>{invoice.paid ? "Paid" : "Unpaid"}</td>
                <td>{formatCurrency(invoice.amount)}</td>
            </tr>
        </tbody>
    </table>

    <div className="invoice-total">
        <p>
            <strong>Total:</strong> {formatCurrency(invoice.amount)}
        </p>
    </div>

    <div className="invoice-footer">
        <p>{settingForms.invoiceFooter}</p>
    </div>

    </div>
  );
}