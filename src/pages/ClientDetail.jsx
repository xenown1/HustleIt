import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useParams } from 'react-router-dom'


export default function ClientDetail() {
    const {clients, projects, invoices} = useContext(UserContext)
    const {id} = useParams()
    const client = clients.find(c => c.id === id)
    const clientProjects = projects.filter(p => p.clientId === id)
    const totalRevenue = clientProjects.reduce((total, p) => total + Number(p.amount), 0)
    const totalUnpaid = clientProjects
    .filter(p=> p.paid === false)
    .reduce((total, p) => total + Number(p.amount),0)
    const clientInvoices = invoices.filter(i => i.clientId === id)
    
  return (
  <>
    <div className='client-details'>
        <div className='client-card'>
            <h2>{client.fullName}</h2>
            <p>{client.email}</p>
            <p>{client.phone}</p>
            <p>{client.company}</p>
        </div>
        <div className='stat-card'>
            <p>Total Revenue: ${totalRevenue}</p>
            <p>Unpaid: ${totalUnpaid}</p>
            <p>Projects: {clientProjects.length}</p>
        </div>
            <div className="client-detail-section">
      <h2>Projects</h2>
      <div className="table">
        <div className="table-header">
          <span>Project</span>
          <span>Status</span>
          <span>Amount</span>
        </div>
        {clientProjects.map(p => (
          <div key={p.id} className="table-row">
            <span>{p.name}</span>
            <span>{p.status}</span>
            <span>${p.amount}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="client-detail-section">
      <h2>Invoices</h2>
      <div className="table">
        <div className="table-header">
          <span>Invoice #</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {clientInvoices.map(i => (
          <div key={i.id} className="table-row">
            <span>{i.invoiceNumber}</span>
            <span>${i.amount}</span>
            <span className={`status ${i.paid ? "paid" : "unpaid"}`}>{i.paid ? "Paid" : "Unpaid"}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  </>
  )
}
