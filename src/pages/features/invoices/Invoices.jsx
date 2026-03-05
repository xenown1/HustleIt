import React, { useState, useEffect } from 'react'

import { v4 as uuidv4} from 'uuid'
import useClients from '../clients/useClients'
import useProjects from '../projects/useProjects'
import useInvoices from './useInvoices'
import Modal from '../../components/Modal'
import PrintableInvoice from './PrintableInvoice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Invoices() {
  const {invoices, setInvoices} = useInvoices()
  const [search, setSearch] = useState("")
  const filteredInvoices = invoices.filter(i => {
    const s = search.toLowerCase()
    if (!s) return true
    return (
      i.clientName.toLowerCase().includes(s) ||
      i.projectName.toLowerCase().includes(s) ||
      i.invoiceNumber.toLowerCase().includes(s) ||
      i.companyName.toLowerCase().includes(s) ||
      i.clientEmail.toLowerCase().includes(s) ||
      i.notes.toLowerCase().includes(s) ||
      String(i.amount).toLowerCase().includes(s)
    )
  })

  const { clients } = useClients()
  const { projects } = useProjects()
  const [notes, setNotes] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const selectedClient = clients.find(c => c.id === selectedProject?.clientId)
  const [paymentTerms, setPaymentTerms] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingFields, setEditingFields] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [printingInvoice, setPrintingInvoice] = useState(null)

  useEffect(() => {
    if (selectedClient && selectedClient.paymentType) {
      setPaymentTerms(selectedClient.paymentType)
    } else {
      setPaymentTerms("")
    }
  }, [selectedClient])

  function handlePrint(invoice){
    setPrintingInvoice(invoice)
    setTimeout(() =>{
      window.print()
    }, 100)
  }
  
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
      paid: selectedProject.paid,
      type: paymentTerms || selectedProject.paymentType,
      paymentTerms: paymentTerms,
      
    }
    setInvoices(prev => [...prev, newInvoice])
    setSelectedProjectId("")
    setPaymentTerms("")
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

  function isOverdue(invoice){
    if (invoice.paid) return false

    const today = new Date()
    const dueDate = new Date(invoice.dueDate)

    return dueDate < today
  }


  
  return (
  <div className="invoices-root">
    <div className="no-print">
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
      {selectedClient && (
        <select
          value={paymentTerms}
          onChange={e => setPaymentTerms(e.target.value)}
        >
          <option value="">Select payment terms</option>
          <option value="net30">Net 30</option>
          <option value="half">Half before / half after</option>
          <option value="dueOnReceipt">Due on receipt</option>
        </select>
      )}
    <button onClick={handleSaveInvoices}>Save Invoice</button>
    </div>
    {isModalOpen && (
      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}>
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
              onClick={() => setIsModalOpen(false)}>Cancel
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
          <th>Terms</th>
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
          <tr key={filteredInvoice.id}>
              <td>{filteredInvoice.clientName}</td>
              <td>{filteredInvoice.companyName}</td>
              <td>{filteredInvoice.clientEmail}</td>
              <td>{filteredInvoice.projectName}</td>
              <td>{filteredInvoice.invoiceNumber}</td>
              <td>{filteredInvoice.paymentTerms || filteredInvoice.type || '-'}</td>
              <td>{filteredInvoice.paid ? "✅ Paid" : 
                  (isOverdue(filteredInvoice) ?
                <span>❌ OVERDUE</span> : "❌ Unpaid")}
              </td>
              <td>{filteredInvoice.notes}</td>
              <td>{filteredInvoice.amount} $</td>
              <td>{filteredInvoice.issueDate}</td>
              <td>{filteredInvoice.dueDate}</td>
              
              <td>
                <button
                className='btn btn-delete'
                onClick={()=> handleDelete(filteredInvoice.id)}><FontAwesomeIcon icon="trash" /></button>
                <button
                className='btn btn-edit'
                onClick={() => startEdit(filteredInvoice)}><FontAwesomeIcon icon="edit" /></button>
                <button
                className='btn btn-add' 
                onClick={() => handlePrint(filteredInvoice)}
                ><FontAwesomeIcon icon="print" /></button>
                </td>
            </tr>
        ))}
      </tbody>
    </table>
    </div>
    <div className="print-only">
      {printingInvoice && (
        <PrintableInvoice invoice={printingInvoice} />
      )}
    </div>
  </div>
  )
}
