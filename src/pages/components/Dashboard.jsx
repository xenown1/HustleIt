import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'


export default function Dashboard() {
  const { clients, projects, user, invoices } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const totalClients = clients.length
  const totalProjects = projects.length
  const totalRevenue = projects.reduce((total, p) => total + Number(p.amount), 0)
  const unpaidTotal = projects
    .filter(p => !p.paid)
    .reduce((total, p) => total + Number(p.amount), 0)
  const activeProjects = projects.filter(p => p.status === "In Progress").length

  const overdueInvoices = invoices.filter(i => !i.paid && new Date(i.dueDate) < new Date())
  const overdueCount = overdueInvoices.length
  const overdueAmount = overdueInvoices.reduce((total, i) => total + Number(i.amount), 0)

  const formatCurrency = amount =>
    amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  const getStatusBadge = status => (
    <span className={`status-badge ${status.toLowerCase().replace(/\s/g, '-')}`}>{status}</span>
  )

  const getPaymentBadge = paid => (
    paid ? <span className='paid-badge'>Paid</span> : <span className='unpaid-badge'>Unpaid</span>
  )

  const getOverdueBadge = (dueDate, paid) => {
    if (paid) return null
    return new Date(dueDate) < new Date() ? <span className='overdue-badge'>Overdue</span> : null
  }

  const getClient = clientId => clients.find(c => c.id === clientId) || {}
  const getProject = projectId => projects.find(p => p.id === projectId) || {}

  


  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard</h1>
      <div className="revenue-stats">
        <p className='revenue-box'>Total Revenue: {formatCurrency(totalRevenue)}</p>
        <p className='revenue-box'>Total Clients: {totalClients}</p>
        <p className='revenue-box'>Total Projects: {totalProjects}</p>
        <p className='revenue-box'>Amount Unpaid: {formatCurrency(unpaidTotal)}</p>
        <p className='revenue-box'>Ongoing Projects: {activeProjects}</p>
        <p className='revenue-box'>⚠️ Overdue Invoices: {overdueCount}</p>
        <p className='revenue-box'>💸 Overdue Amount: {formatCurrency(overdueAmount)}</p>
      </div>

<div className="recent-projects">
  <h2>Recent Projects</h2>
  <div className="cards-grid">
    {projects.slice(0, 5).map(p => {
      const client = getClient(p.clientId)
      return (
        <div key={p.id} className='project-card'>
          <h3>{p.name}</h3>
          <p>Client: {client.fullName || "Unknown Client"}</p>
          <p>Amount: {formatCurrency(Number(p.amount))}</p>
          <p>Due: {formatDate(p.dueDate || p.issueDate)}</p>
          {getStatusBadge(p.status)}
          {getPaymentBadge(p.paid)}
          {getOverdueBadge(p.dueDate || p.issueDate, p.paid)}
        </div>
      )
    })}
  </div>
</div>

<div className="recent-invoices">
  <h2>Recent Invoices</h2>
  <div className="cards-grid">
    {invoices.slice(0, 5).map(i => {
      const client = getClient(i.clientId)
      const project = getProject(i.projectId)
      return (
        <div key={i.id} className='invoice-card'>
          <h3>{i.invoiceNumber}</h3>
          <p>Project: {project.name || "Unknown Project"}</p>
          <p>Client: {client.fullName || "Unknown Client"}</p>
          <p>Amount: {formatCurrency(Number(i.amount))}</p>
          <p>Due: {formatDate(i.dueDate)}</p>
          {getPaymentBadge(i.paid)}
          {getOverdueBadge(i.dueDate, i.paid)}
        </div>
      )
    })}
  </div>
</div>
    </div>
  )
}