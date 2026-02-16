import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Clients from './pages/Clients';
import { useEffect, useState } from 'react';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './pages/Navbar';
import Invoices from './pages/Invoices';
import { UserContext } from './context/UserContext';
import ClientDetail from './pages/ClientDetail';
import Register from './pages/Register';

function App() {
  const [invoices, setInvoices] = useState(()=>{
    try {
      const currInvoices = localStorage.getItem("invoices");
      return currInvoices ? JSON.parse(currInvoices) : []
    } catch {
      return []
    }
  })
  
  const [user, setUser] = useState(()=>{
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser): null
    }catch{
      return null;
    }
  })


  
    const [clients, setClients] = useState(() => {
        try {
            const saved = localStorage.getItem("clients");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    })

    const [projects, setProjects] = useState(() => {
      try {
        const savedProjects = localStorage.getItem("projects");
        return savedProjects ? JSON.parse(savedProjects) : []
      }catch {
        return [];
      }
    })





    useEffect(() => {
      localStorage.setItem("invoices", JSON.stringify(invoices));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("clients", JSON.stringify(clients));
      localStorage.setItem("projects", JSON.stringify(projects));
    }, [clients, projects, user, invoices])


  return (
  <UserContext.Provider value={{
      user, setUser,
      projects,setProjects,
      clients, setClients,
      invoices, setInvoices
    }}>
  <BrowserRouter>
  <div className="app-layout">
    <nav className="top-navbar">
      <div className="nav-logo">HustleIt</div>
      <div className="nav-links">
        <Navbar/>
      </div>
    </nav>

    <div className="main-content">

      <Routes>
        <Route path='/' 
          element={
            <Navigate to={user ? "/dashboard" : '/register'}/>
          }
        />
        <Route path='/register'
          element={
            <Register />
          }
        />
        <Route path='/invoices'
          element={
          <Invoices />
          }
        />
        <Route path='/login'
          element={
            <Login />
          }
        />
        <Route path="/clients"
          element={
            <Clients />
          }
        />
        <Route path='/clients/:id'
          element={
            <ClientDetail />
          }
         />
        <Route path="/projects"
          element={
            <Projects />
          }
        />
        <Route path="/dashboard" 
          element={
          <Dashboard/>} />
      </Routes>
    </div>

  </div>
</BrowserRouter>
</UserContext.Provider>
  )
}

export default App
