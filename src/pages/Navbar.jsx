import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
export default function Navbar() {
    const { user, setUser} = useAuth()
    const navigate = useNavigate()

    function handleLogout(){
        setUser(null)
        navigate('/login')
    }



    return (
        <nav className="top-navbar">
            <div className="nav-links">
                {user ? (
                    <>
                        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
                        <NavLink to="/clients" className="nav-item">Clients</NavLink>
                        <NavLink to="/projects" className="nav-item">Projects</NavLink>
                        <NavLink to="/invoices" className="nav-item">Invoices</NavLink>
                        <button onClick={handleLogout} className='btn-logout'>Logout</button>
                    </>
                ) : (
                    <NavLink to='/login' className="nav-item">Login</NavLink>
                )}
            </div>
        </nav>
    )
}