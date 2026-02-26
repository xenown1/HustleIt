import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";

export default function PrintableInvoice({ invoice }) {
    const { settingForms, clients } = useContext(UserContext)
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
            <p><strong>Issue Date:</strong> {invoice.issueDate}</p>
            <p><strong>Payment Type: </strong> {clients.paymentType}</p>
            <p><strong>Due Date:</strong> {invoice.dueDate}</p>
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
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{invoice.projectName}</td>
                <td>{invoice.paid ? "Paid" : "Unpaid"}</td>
                <td>${invoice.amount} {settingForms.currency}</td>
            </tr>
        </tbody>
    </table>

    <div className="invoice-total">
        <p>
            <strong>Total:</strong> ${invoice.amount}
        </p>
    </div>

    <div className="invoice-footer">
        <p>{settingForms.invoiceFooter}</p>
    </div>

    </div>
  );
}