import React, { useEffect, useContext } from 'react'
import { useNavigate ,Link} from 'react-router-dom'
import { UserContext } from '../../context/UserContext'


export default function Dashboard() {
  const { clients, projects, user, invoices, expenses } = useContext(UserContext)
  const navigate = useNavigate()  
  function getRecentActivity() {
    const clientActivities = clients.map(c => ({
      type: 'client',
      name: c.fullName,
      company: c.company,
      clientId: c.id,
      date: c.createdAt || c.joinedDate || null
    }))
    const projectActivities = projects.map(p => ({
      type: 'project',
      name: p.name,
      date: p.issueDate,
      clientId: p.clientId,
      projectId: p.id
    }))
    const invoiceActivities = invoices.map(i => ({
      type: 'invoice',
      name: i.invoiceNumber,
      paid: i.paid,
      clientId: i.clientId,
      projectId: i.projectId,
      date: i.issueDate
    }))
    const expenseActivities = expenses.map(e => ({
      type: 'expense',
      name: e.name,
      amount: e.amount,
      category: e.category,
      date: e.date
    }))
    const allActivities = [...clientActivities, ...projectActivities, ...invoiceActivities, ...expenseActivities]
    allActivities.sort((a, b) => new Date(b.date || b.issueDate) - new Date(a.date || a.issueDate))
    return allActivities.slice(0, 10)
  }

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const totalClients = clients.length
  const totalProjects = projects.length
  const totalRevenue = projects.reduce((total, p) => total + Number(p.amount), 0)
  const unpaidTotal = projects
    .filter(p => !p.paid)
    .reduce((total, p) => total + Number(p.amount), 0)
  const totalExpenses = expenses.reduce((total, e) => total + Number(e.amount), 0)
  const totalProfit = totalRevenue - totalExpenses
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
  const clientFullName = clientId => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.fullName : "Unknown Client"
  }
  

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard</h1>

      <section className="dashboard-section stats-section">
        <div className="revenue-stats">
          <p className='revenue-box'>Total Revenue: {formatCurrency(totalRevenue)}</p>
          <p className='revenue-box'>Total Expenses: {formatCurrency(totalExpenses)}</p>
          <p className='revenue-box'>💰 Total Profit: {formatCurrency(totalProfit)}</p>
          <p className='revenue-box'>Total Clients: {totalClients}</p>
          <p className='revenue-box'>Total Projects: {totalProjects}</p>
          <p className='revenue-box'>Amount Unpaid: {formatCurrency(unpaidTotal)}</p>
          <p className='revenue-box'>Ongoing Projects: {activeProjects}</p>
          <p className='revenue-box'>⚠️ Overdue Invoices: {overdueCount}</p>
          <p className='revenue-box'>💸 Overdue Amount: {formatCurrency(overdueAmount)}</p>
        </div>
      </section>
      
<div className="dashboard-layout">
  <div className="sidebar">
    <div className="recent-activity">
  <div className="recent-activity-header">
    <h2 className="recent-activity-title">Recent Activity</h2>
  </div>
  <ul className="activity-list">
    {getRecentActivity().length === 0 && <p>No recent activity.</p>}
    {getRecentActivity().map((activity, index) => {
      let displayElement = activity.name;

      if (activity.type === 'client' && activity.clientId) {
        displayElement = (
          <Link className='regular-text' to={`/clients/${activity.clientId}`}>
            {clientFullName(activity.clientId)}
          </Link>
        );
      }

      const content = activity.type === 'project' && activity.projectId ? (
        <Link to={`/projects/${activity.projectId}`}>{activity.name}</Link>
      ) : (
        displayElement
      );
      
      return (
        <li key={index} className="activity-item">
          <div className="activity-content">
            <span className="activity-type">{activity.type}</span>
            <span className="activity-name">
              {content}
            </span>
          </div>
          <span className="activity-meta">
            {activity.type === 'client' && activity.company ? `${activity.company}` : ''}
            {activity.type === 'project' && activity.date ? `Created at - (${formatDate(activity.date)})` : ''}
            {activity.type === 'invoice' && activity.paid !== undefined ? (activity.paid ? "Paid" : "Unpaid") : ''}
            {activity.type === 'expense' ? `${activity.category} - ${formatCurrency(activity.amount)}` : ''}
          </span>
        </li>
      )
    })}
  </ul>
    </div>
  </div>

  <div className="main-content">
    <div className="recent-projects">
  <h2>Recent Projects</h2>
  <div className="cards-grid">
    {projects.length === 0 && <span>No recent projects.</span>}
    {projects.slice(0, 5).map(p => {
      const client = getClient(p.clientId)
        const hasClient = client && client.id;

      return (
        <div key={p.id} className='project-card'>
          <h3>{p.name}</h3>
      <div>
        Client:{' '}
        {hasClient ? (
          <Link to={`/clients/${client.id}`}>
            {client.fullName}
          </Link>
        ) : (
          'Unknown Client'
        )}
          <p>Amount: {formatCurrency(Number(p.amount))}</p>
          <p>Due: {formatDate(p.dueDate || p.issueDate)}</p>
          {getStatusBadge(p.status)}
          {getPaymentBadge(p.paid)}
          {getOverdueBadge(p.dueDate || p.issueDate, p.paid)}
      </div>

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
</div>
    </div>
  )
}