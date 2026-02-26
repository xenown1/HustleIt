import './App.css';

import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Clients from './pages/features/clients/Clients';
import { useEffect, useState } from 'react';
import Projects from './pages/features/projects/Projects';
import Dashboard from './pages/components/Dashboard';
import Login from './pages/features/Auth/Login';
import Navbar from './pages/components/Navbar';
import Invoices from './pages/features/invoices/Invoices';
import { UserContext } from './context/UserContext';
import ClientDetail from './pages/features/clients/ClientDetail';
import Register from './pages/features/Auth/Register';
import PrintableInvoice from './pages/features/invoices/PrintableInvoice';
import Settings from './pages/features/settings/Settings';
import ProjectDetails from './pages/features/projects/ProjectDetails';


function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.className = theme === "light" ? "light-theme" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  const [settingForms, setSettingForms] = useState(() => {
      try {
        const saved = localStorage.getItem("settingForms");
        return saved
          ? JSON.parse(saved)
          : {
              name: "",
              businessName: "",
              address: "",
              email: "",
              phone: "",
              taxId: "",
              paymentType: "",
              currency: "CAD",
              invoiceFooter: ""
            };
      } catch {
        return {
          name: "",
          businessName: "",
          address: "",
          email: "",
          phone: "",
          taxId: "",
          paymentType: "",
          currency: "CAD",
          invoiceFooter: ""
        };
      }
    });
  
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
      localStorage.setItem("settingForms", JSON.stringify(settingForms))
      localStorage.setItem("invoices", JSON.stringify(invoices));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("clients", JSON.stringify(clients));
      localStorage.setItem("projects", JSON.stringify(projects));
    }, [clients, projects, user, invoices, settingForms])


  return (
  <UserContext.Provider value={{
      user, setUser,
      projects,setProjects,
      clients, setClients,
      invoices, setInvoices,
      settingForms, setSettingForms
    }}>
  <BrowserRouter>
  
  <div className="app-layout">
    <nav className="top-navbar">
      <div className="nav-logo">HustleIt</div>
      <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      <div className="nav-links">
        <Navbar/>
      </div>
    </nav>

    <div className="main-content">

      <Routes>
        
        <Route path='/' 
          element={
            <Navigate to={user ? "/dashboard" : '/login'}/>
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
        <Route path='/printableinvoice'
          element={
            <PrintableInvoice />
          }
        />
        <Route path='/settings'
          element={
            <Settings />
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
        <Route path='/projects/:id'
          element={
            <ProjectDetails />
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
