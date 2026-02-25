import React, { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '../../components/Modal'



export default function ClientDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false)
    const {clients, projects, invoices, setClients} = useContext(UserContext)
    const {id} = useParams()
    const client = clients.find(c => c.id === id)
    const clientProjects = projects.filter(p => p.clientId === id)
    const totalRevenue = clientProjects.reduce((total, p) => total + Number(p.amount), 0)
    const totalUnpaid = clientProjects
    .filter(p=> p.paid === false)
    .reduce((total, p) => total + Number(p.amount),0)
    const clientInvoices = invoices.filter(i => i.clientId === id)
  
    const [editingId, setEditingId] = useState(null)
    const [editingFields, setEditingFields] = useState({
      fullName: "",
      email: "",
      phone: "",
      company: ""
    })

    function startEdit(client) {
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
      setClients(clients.map(
        c => c.id === id ? {...c, ...editingFields} : c)
      )
      setEditingId(null)
      setIsModalOpen(false)
    }

    function cancelEdit(){
      setEditingId(null)
      setEditingFields("")
    }

    function handleEditChange(e){
      const {name, value} = e.target;
      setEditingFields(prev => 
      ({...prev, [name]: value})
      )
    }
  return (
  <>
    <div className='client-details'>
        <div className='client-card'>
          {client && (
            <>
            {isModalOpen && (
              <Modal onClose={() => setIsModalOpen(false)}>
                <div className='modal-content'>
                  <h2 className='modal-title'>Edit</h2>
                  <div className='modal-field'>
                    <label htmlFor='fullName'>full name:</label>
                    <input
                      id='fullName'
                      name='fullName'
                      value={editingFields.fullName}
                      onChange={handleEditChange}
                    />
                    <label htmlFor='email'>email:</label>
                    <input
                      id='email'
                      name='email'
                      value={editingFields.email}
                      onChange={handleEditChange}
                    />
                    <label htmlFor='phone'>phone:</label>
                    <input
                      id='phone'
                      name='phone'
                      value={editingFields.phone}
                      onChange={handleEditChange}
                    />
                    <label htmlFor='company'>company:</label>
                    <input
                      id='company'
                      name='company'
                      value={editingFields.company}
                      onChange={handleEditChange}
                    />
                  </div>
                  <button 
                  className='btn btn-save'
                  onClick={()=> saveEdit(editingId)}><FontAwesomeIcon icon="save"/></button>
                  <button 
                  className='btn btn-cancel'
                  onClick={() => cancelEdit}><FontAwesomeIcon icon="cancel" /></button>
                </div>
              </Modal>
            )}
          </>)}

            <button 
            className='btn'
            onClick={() => startEdit(client)}><FontAwesomeIcon icon="edit"/></button>
            <h2>{client.fullName}</h2>
            <p>{client.email}</p>
            <p>{client.phone}</p>
            <p>{client.company}</p>
            <div className='stat-card'>
              <p>Total Revenue: ${totalRevenue}</p>
              <p>Unpaid: ${totalUnpaid}</p>
              <p>Projects: {clientProjects.length}</p>
            </div>
        </div>
      <div className="client-detail-section">
      <h2>Projects</h2>
      <div className="table">
        <div className="table-header">
          <span>Project</span>
          <span>Status</span>
          <span>Amount</span>
        </div>
        {clientProjects.length === 0 ? (
          <p>No Project</p>
        ) : (
        clientProjects.map(p => (
          <div key={p.id} className="table-row">
            <span>{p.name}</span>
            <span>{p.status}</span>
            <span>${p.amount}</span>
          </div>
        ))
        )}
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
