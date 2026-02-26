import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { projects, clients, invoices, setProjects } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const project = projects.find(p => p.id === id)
    const client = project ? clients.find(c => c.id === project.clientId) : null
    const projectInvoices = project ? invoices.filter(i => i.projectId === id) : []
    const totalInvoiceAmount = projectInvoices.reduce((total, i) => total + Number(i.amount), 0)
    
    const [editingFields, setEditingFields] = useState({
        name: project?.name || '',
        status: project?.status || '',
        amount: project?.amount || '',
        paid: project?.paid || false
    })
    
    function handleEditChange(e) {
        const { name, value } = e.target
        setEditingFields(prev => ({
            ...prev,
            [name]: name === "paid" ? value === "true" : value
        }))
    }

    if (!project) return <div className="p-8">Project not found</div>

    function saveEdit() {
        setProjects(projects.map(p => p.id === id ? {...p, ...editingFields} : p))
        setIsModalOpen(false)
    }

    return (
        <div className="project-details">
            <button onClick={() => navigate(-1)} className="btn">← Back</button>
            
            <h1>{project.name}</h1>
            <p>Client: <Link to={`/clients/${client?.id}`}>{client?.fullName || 'Unknown'}</Link></p>
            
            <div className="stat-card">
                <p>Amount: ${project.amount}</p>
                <p>Status: {project.status}</p>
                <p>Paid: {project.paid ? '✅' : '❌'}</p>
            </div>
            <div className="project-detail-section">
                <h2>Related Invoices</h2>
                {projectInvoices.length === 0 ? (
                    <p>No invoices</p>
                ) : (
                    <div className="table">
                        <div className="table-header">
                            <span>Invoice #</span>
                            <span>Amount</span>
                            <span>Status</span>
                        </div>
                        {projectInvoices.map(i => (
                            <div key={i.id} className="table-row">
                                <span>{i.invoiceNumber}</span>
                                <span>${i.amount}</span>
                                <span className={`status ${i.paid ? "paid" : "unpaid"}`}>
                                    {i.paid ? "Paid" : "Unpaid"}
                                </span>
                            </div>
                        ))}
                        <div className="table-row" style={{fontWeight: 'bold'}}>
                            <span>Total</span>
                            <span>${totalInvoiceAmount}</span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="btn btn-edit"><FontAwesomeIcon icon="edit" /> Edit</button>
            
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div className="modal-content">
                        <h2 className="modal-title">Edit Project</h2>
                        <div className="modal-field">
                            <label htmlFor="name">Project Name</label>
                            <input 
                                id="name"
                                name="name"
                                value={editingFields.name} 
                                onChange={handleEditChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label htmlFor="status">Status</label>
                            <select 
                                id="status"
                                name="status"
                                value={editingFields.status} 
                                onChange={handleEditChange}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Awaiting Client">Awaiting Client</option>
                            </select>
                        </div>
                        <div className="modal-field">
                            <label htmlFor="amount">Amount</label>
                            <input 
                                id="amount"
                                name="amount"
                                type="number"
                                value={editingFields.amount} 
                                onChange={handleEditChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label htmlFor="paid">Paid</label>
                            <select 
                                id="paid"
                                name="paid"
                                value={editingFields.paid} 
                                onChange={handleEditChange}
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-edit" onClick={saveEdit}>Save</button>
                            <button className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}