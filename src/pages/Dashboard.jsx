import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'


export default function Dashboard() {
  const { clients, projects,user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
      if (!user) navigate('/login')
  }, [user, navigate])

  const totalClients = clients.length
  const totalProjects = projects.length
  const totalRevenue = projects.reduce((total, p) => total + Number(p.amount), 0)
  const unpaidTotal = projects
      .filter(p => p.paid === false)
      .reduce((total, p) => total + Number(p.amount), 0)
  const activeProjects = projects.filter(p => p.status === "In Progress").length
  
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className='revenue-box'>Total Revenue: {totalRevenue} $</p>
      <p className='revenue-box'>Total Client: {totalClients}</p>
      <p className='revenue-box'>Total Projects: {totalProjects}</p>
      <p className='revenue-box'>Amount Unpaid: {unpaidTotal} $</p>
      <p className='revenue-box'>Ongoing Projects: {activeProjects}</p>
    </div>
  )
}
