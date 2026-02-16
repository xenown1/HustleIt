import React, { useState } from 'react'

import { v4 as uuidv4} from 'uuid'
import useClients from './hooks/useClients'
import useProjects from './hooks/useProjects'
import useInvoices from './hooks/useInvoices'
import Modal from './Modal'

export default function Invoices() {
  const {invoices, setInvoices} = useInvoices()
  const [search, setSearch] = useState("")
  const filteredInvoices = invoices.filter(
    i => i.clientName.toLowerCase().includes(search.toLowerCase())
  )
  const { clients } = useClients()
  const { projects } = useProjects()
  const [notes, setNotes] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const selectedClient = clients.find(c => c.id === selectedProject?.clientId)
  const [editingId, setEditingId] = useState(null)
  const [editingFields, setEditingFields] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)


  
  function startEdit(invoice){
    setEditingId(invoice.id)
    setEditingFields({
      issueDate: invoice.issueDate,
      notes: invoice.notes,
      paid: invoice.paid,
      dueDate: invoice.dueDate
    })
    setIsModalOpen(true)
  }

  function saveEdit(id){
    if ( editingFields === "") return;
    setInvoices(
      invoices.map(
        i => i.id === id ? {...i, ...editingFields} : i
      )
    );
    setEditingId(null)
    setIsModalOpen(false)
  }

  function cancelEdit(){
    setEditingId(null)
    setEditingFields("")
  }
  

  function handleSaveInvoices(){
    if (!selectedProjectId) return window.alert("Select a project!");

    const newInvoice = {
      id: uuidv4(),
      clientName: selectedClient.fullName,
      projectName: selectedProject.name,
      companyName: selectedClient.company,
      clientEmail: selectedClient.email,
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      projectId: selectedProjectId,
      clientId: selectedClient.id,
      amount: selectedProject.amount,
      issueDate: issueDate,
      dueDate: dueDate,
      notes: notes,
      paid: selectedProject.paid
    }
    setInvoices(prev => [...prev, newInvoice])
    setSelectedProjectId("")
    setIssueDate("")
    setDueDate("")
    setNotes("")
  }

  function handleDelete(idToDelete){
    setInvoices(prev =>
      prev.filter(i => i.id !== idToDelete)
    )
  }

  function handleEditChange(e){
    const {name, value} = e.target;
    setEditingFields(prev => (
      {...prev, [name] : value}
    ))
  }

  return (
  <>
    <div  className="page-title">
      <h1>Invoices</h1>
        <div className="search-wrapper">
          <input
            className="search-input"
            type='text'
            onChange={(e)=> setSearch(e.target.value)}
            placeholder='Search..'
          />
        </div>
    </div>
    <div  className="client-form">
      
      <select
        value={selectedProjectId}
        onChange={e => setSelectedProjectId(e.target.value)}
      >
      <option value=""> Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
      ))}
      </select>
      <label htmlFor='issueDate'>Issue Date :</label>
      <input
        type='date'
        value={issueDate}
        onChange={e => setIssueDate(e.target.value)}
      />
      <label htmlFor='dueDate'>Due Date :</label>
      <input
        type='date'
        value={dueDate}
        onChange={(e)=> setDueDate(e.target.value)}
      />
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Add notes..."
      />
    <button onClick={handleSaveInvoices}>Save Invoice</button>
    </div>
    {isModalOpen && (
      <Modal onClose={()=>setIsModalOpen(false)}>
        <h2  className="modal-title">Edit Invoice</h2>
        <div className='modal-content'>
          <div className='modal-field'>
          <label htmlFor="issueDate">issue Date</label>
          <input
            name='issueDate'
            type='date'
            value={editingFields.issueDate}
            onChange={handleEditChange}
          />
          </div>

          <div className='modal-field'>
            <label htmlFor="notes">Note</label>
            <input
            name='notes'
              value={editingFields.notes}
              onChange={handleEditChange}
            />
            
          </div>
          <div className='modal-field'>
          <label htmlFor="dueDate">Due Date</label>
          <input 
            name='dueDate'
            type='date'
            value={editingFields.dueDate}
            onChange={handleEditChange}
          />
          </div>

          <div className='modal-actions'>
          <button 
            className='btn btn-edit'
            onClick={() => saveEdit(editingId)}>Save
          </button>
            <button 
              className='btn btn-cancel'
              onClick={cancelEdit}>Cancel
          </button>
          </div>

        </div>
          
      </Modal>
    )}
    <table>
      <thead>
        <tr>
          <th>Client Name</th>
          <th>Company</th>
          <th>Email</th>
          <th>Project</th>
          <th>Invoice ID</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Amount</th>
          <th>Issue Date</th>
          <th>Due Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredInvoices.map((filteredInvoice) => (
          <tr>
              <td>{filteredInvoice.clientName}</td>
              <td>{filteredInvoice.companyName}</td>
              <td>{filteredInvoice.clientEmail}</td>
              <td>{filteredInvoice.projectName}</td>
              <td>{filteredInvoice.invoiceNumber}</td>
              <td>{filteredInvoice.paid ? "✅ Paid" : "❌ Unpaid"}</td>
              <td>{filteredInvoice.notes}</td>
              <td>{filteredInvoice.amount} $</td>
              <td>{filteredInvoice.issueDate}</td>
              <td>{filteredInvoice.dueDate}</td>
              <td>
                <button onClick={()=> handleDelete(filteredInvoice.id)}>Delete</button>
                <button onClick={() => startEdit(filteredInvoice)}>Edit</button>
                </td>
            </tr>
        ))}
      </tbody>
    </table>
  </>
  )
}
