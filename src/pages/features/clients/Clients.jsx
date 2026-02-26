import React, {  useState, useEffect, useRef } from 'react'
import {v4 as uuidv4 } from 'uuid'
import { useNavigate, Link } from 'react-router-dom'
import useClients from './useClients'
import useProjects from '../projects/useProjects'
import useAuth from '../Auth/useAuth'
import Modal from '../../components/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function Clients() {
    const [ search, setSearch ] = useState("")
    const [ filterCompany, setFilterCompany ] = useState("")
    const [ filterStatus, setFilterStatus ] = useState("all")
    const {clients, setClients} = useClients()
    
    const uniqueCompanies = [...new Set(clients.map(c => c.company))].filter(Boolean)
    
    const finalClients = clients.filter(c => {
      const matchesSearch = c.fullName.toLowerCase().includes(search.toLowerCase())
      const matchesCompany = filterCompany === "" || c.company === filterCompany
      
      const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? c.active : !c.active)
      return matchesSearch && matchesCompany && matchesStatus
    })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const inputRef= useRef(null)
    const { user} = useAuth()
    
    const {projects} = useProjects()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) navigate('/login')
    }, [user, navigate])

    useEffect(()=> {
        inputRef.current.focus()
    },[])

    const [clientInfo, setClientInfo] = useState({
        fullName:"",
        email:"",
        phone:"",
        company:"",
        active: false
    })

    const [editingId, setEditingId] = useState(null)
    const [editingFields, setEditingFields] = useState({
        fullName: "",
        email: "",
        phone: "",
        company: ""
    })
    
    function startEdit(client){
        setEditingId(client.id)
        setEditingFields({
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
            company: client.company
        })
        setIsModalOpen(true)
    }


    function saveEdit(id){
        if (editingFields === "") return;
        setClients(
            clients.map(
                c=> c.id === id ? {...c, ...editingFields} : c 
            )
        );
        setEditingId(null)
        setIsModalOpen(false)
    }

    function cancelEdit(){
        setEditingId(null)
        setEditingFields("")
        setIsModalOpen(true)
     }
    


    function handleChange(e){
        const { name, value } = e.target;

        setClientInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function deleteClient(idToDelete){
        const hasItems = projects.some(
            p => p.clientId === idToDelete && p.status !== "Completed"
        )
        if (hasItems){
            alert("Cannot delete client with existing projects.")
            return;
        }
        setClients(prev => prev.filter(c => c.id !== idToDelete))
    }
    

    function handleSubmit(e) {
        e.preventDefault();
    
        const { fullName, email, phone, company } = clientInfo;
    
        if (!fullName || !email || !phone || !company) {
            alert("Please fill out the form.");
            return;
        }
    
        setClients((prev) => [
            ...prev,{
                ...clientInfo,
                id: uuidv4()
            }
        ]);
    
        setClientInfo({
            fullName: "",
            email: "",
            phone: "",
            company: "",
            active: false,
        });
      }

      function handleEditChange(e){
        const { name, value} = e.target;
        setEditingFields(prev => 
        ({...prev, [name] : value})
        )
      }
  return (
  <>
    <div  className="page-title">
      <h1>Clients</h1>
        <div className="filter-search">
            <input 
                type="text" 
                placeholder="Search clients..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            <select 
                value={filterCompany} 
                onChange={(e) => setFilterCompany(e.target.value)}
                className="filter-dropdown"
            >
                <option value="">All Companies</option>
                {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
            ))}
            </select>
            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-dropdown"
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>
    </div>
    <div className="form-base">
        <form onSubmit={handleSubmit} className="client-form">
            <label htmlFor="fullName">Client Name</label>
            <input
                ref={inputRef}
                type="text"
                name="fullName"
                value={clientInfo.fullName}
                onChange={handleChange}
            />


            <label htmlFor="email">Email</label>
            <input
                type="text"
                name="email"
                value={clientInfo.email}
                onChange={handleChange}
            />

            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                name="phone"
                value={clientInfo.phone}
                onChange={handleChange}
            />

            <label htmlFor="company">Company</label>
            <input
                type="text"
                name="company"
                value={clientInfo.company}
                onChange={handleChange}
            />

            <label htmlFor="active">
            <input
                type="checkbox"
                id="active"
                name="active"
                checked={clientInfo.active}
                onChange={(e) => setClientInfo(prev => ({...prev, active: e.target.checked}))}
            />
            Active Client
            </label>

            <button type="submit">Add Client</button>
        </form>
    </div>
    

    {clients.length > 0 && (
    <div className="table-wrapper">
        {isModalOpen && (
                    <Modal onClose={() => setIsModalOpen(false)}>
                        <div className="modal-content">
                            <h2  className="modal-title">Edit Client</h2>
                            <div className="modal-field">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    value={editingFields.fullName}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="modal-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={editingFields.email}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="modal-field">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    value={editingFields.phone}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="modal-field">
                                <label htmlFor="company">Company</label>
                                <input
                                    id="company"
                                    name="company"
                                    value={editingFields.company}
                                    onChange={handleEditChange}
                                />
                            </div>
                            </div>
                            <div className="modal-actions">
                            <button
                                className="btn btn-edit"
                                onClick={() => saveEdit(editingId)}
                            >
                                Save
                            </button>
                            <button
                                className="btn btn-cancel"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                            
                        </div>
                        </Modal>

                )}
        <table className="clients-table">
        <thead>
            <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>


        <tbody>
            {finalClients.map((filteredClient) => ( 
            <tr key={filteredClient.id}>
                    <td><Link className='client-link' to={`/clients/${filteredClient.id}`}>{filteredClient.fullName}</Link></td>
                    <td>{filteredClient.email}</td>
                    <td>{filteredClient.phone}</td>
                    <td>{filteredClient.company}</td>
                    <td>{filteredClient.active ? '✓ Active' : '○ Inactive'}</td>
                    <td>
                    <button
                        className="btn-delete btn"
                        onClick={() => deleteClient(filteredClient.id)}
                    >
                        <FontAwesomeIcon icon="trash"/>
                    </button>
                    <button
                        className='btn btn-edit'
                        onClick={() => startEdit(filteredClient)}
                    >
                        <FontAwesomeIcon icon="edit"/>
                    </button>
                    </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    )}
  </>
);

}