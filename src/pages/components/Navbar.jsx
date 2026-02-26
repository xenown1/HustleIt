import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import useAuth from '../features/Auth/useAuth'
import { UserContext } from '../../context/UserContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from './Modal'

export default function Navbar() {
    const { user, setUser} = useAuth()
    const { invoices } = useContext(UserContext) // notifications source
    const navigate = useNavigate()
    const [showNotif, setShowNotif] = useState(false)

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }
    function handleLogout(){
        setUser(null)
        navigate('/login')
    }

    const overdue = invoices.filter(i => !i.paid && new Date(i.dueDate) < new Date())
    const notifications = overdue.map(i => ({
        id: i.id,
        message: `Invoice ${i.invoiceNumber} overdue (${formatDate(i.dueDate)})`,
    }))

    return (
        <>
        <nav className="top-navbar">
            <div className="nav-links">
                {user ? (
                    <>
                        <div className="notification" onClick={() => setShowNotif(true)}>
                            <FontAwesomeIcon icon="bell" />
                            {notifications.length > 0 && (
                                <span className="notification-count">{notifications.length}</span>
                            )}
                        </div>
                        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
                        <NavLink to="/clients" className="nav-item">Clients</NavLink>
                        <NavLink to="/projects" className="nav-item">Projects</NavLink>
                        <NavLink to="/invoices" className="nav-item">Invoices</NavLink>
                        <NavLink to="/settings" className="nav-item">Settings</NavLink>
                        <button onClick={handleLogout} className='btn-logout'>Logout</button>
                    </>
                ) : (
                    <NavLink to='/login' className="nav-item">Login</NavLink>
                )}
            </div>
        </nav>
        {showNotif && (
            <Modal onClose={() => setShowNotif(false)}>
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <p>No notifications</p>
                ) : (
                    <ul className="notif-list">
                        {notifications.map(n => (
                            <li key={n.id}>{n.message}</li>
                        ))}
                    </ul>
                )}
            </Modal>
        )}
        </>
    )
}