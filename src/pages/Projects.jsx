import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import useClients from './hooks/useClients'
import useProjects from './hooks/useProjects'
import useAuth from './hooks/useAuth'
import Modal from './Modal'

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { clients } = useClients()
  const { projects, setProjects } = useProjects()
  const { user } = useAuth()
  const [ search, setSearch] = useState("")
  const filteredProjects = projects.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase())
  )

  const navigate = useNavigate()
  useEffect(() => {
    if (!user) navigate('/login')
}, [user, navigate])

  const [projectInfo, setProjectInfo] = useState({
    name: "",
    clientId: "",
    status: "Not Started",
    amount: "",
    issueDate: "",
    paid: false
  })

  const [editingId, setEditingId] = useState(null)
  const [editingFields, setEditingFields] = useState({
      name: "",
      clientId: "",
      status: "",
      amount: "",
      issueDate: "",
      paid: false
  })
    
  function startEdit(project){
      setEditingId(project.id)
      setEditingFields({
          name: project.name,
          status: project.status,
          amount: project.amount,
          paid: project.paid,
          issueDate: project.issueDate
      })
      setIsModalOpen(true)
  }

  function saveEdit(id){
      if (editingFields === "") return;
      setProjects(
          projects.map(
              p=> p.id === id ? {...p, ...editingFields} : p
          )
      );
      setEditingId(null)
      setIsModalOpen(false)
  }

  function cancelEdit(){
      setEditingId(null)
      setEditingFields(
        {
        
          name: "",
        
          clientId: "",
        
          status: "",
        
          amount: "",
        
          issueDate: "",
        
          paid: false
       }
      )
      setIsModalOpen(false)
  }
  
  function handleChange(e){
    const { name, value } = e.target;

    setProjectInfo((prev) => ({
      ...prev,
      [name]: name === "paid" ? value === "true" : value
    }));
  }

  function handleSubmit(e){
    e.preventDefault();
    if ( !projectInfo.name || !projectInfo.status || !projectInfo.amount || !projectInfo.clientId ){
      return (
        window.alert(
          "Plesae fill out the form!"
        )
      )
    }

    setProjects(prev => [
        ...prev, {
            ...projectInfo,
            id: uuidv4()
        }
    ])

    setProjectInfo({
        name: "",
        clientId: "",
        status: "Not Started",
        amount: "",
        issueDate: "",
        paid: false
    })
  }
  
  function deleteProject(idToDelete){
      setProjects(prev => prev.filter(p => p.id !== idToDelete))
  }

  function handleEditChange(e){
    const { name, value } = e.target;
    setEditingFields(prev => 
      ({...prev, [name] : value})
    )
  }

  
  return (<>
    <div  className="page-title">
      <h1>Projects</h1>
        <div className="search-wrapper">
          <input
            className="search-input"
            type='text'
            onChange={(e)=> setSearch(e.target.value)}
            placeholder='Search..'
          />
        </div>
    </div>

    <form onSubmit={handleSubmit} className='project-form'>
      <label htmlFor='projectName'>Project name</label>
      <input type='text' name='name' value={projectInfo.name} onChange={handleChange}></input>
      <select name='clientId' value={projectInfo.clientId} onChange={handleChange}>
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.fullName}
          </option>
        ))}
      </select>
      <select name='status' value={projectInfo.status} onChange={handleChange}>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Awaiting Client">Awaiting Client</option>
      </select>

      <label htmlFor='amount'>Amount:</label>
      <input type='number' name='amount' value={projectInfo.amount} onChange={handleChange} placeholder='Price'></input>
      <label htmlFor='issueDate'>Due Date</label>
      <input type='date' name='issueDate' value={projectInfo.issueDate} onChange={handleChange}/>
      <label htmlFor='paid'>Paid?</label>
      <select name='paid' value={projectInfo.paid} onChange={handleChange}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>

    <button type='submit'>Submit</button>
    </form>
    {projects && (
      <div className="table-wrapper">
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
      <label htmlFor="clientId">Client ID</label>
      <input
        id="clientId"
        name="clientId"
        value={editingFields.clientId}
        onChange={handleEditChange}
      />
    </div>

    <div className="modal-field">
      <label htmlFor="status">Status</label>
      <input
        id="status"
        name="status"
        value={editingFields.status}
        onChange={handleEditChange}
      />
    </div>

    <div className="modal-field">
      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        name="amount"
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
        onChange={(e) =>
          setEditingFields((prev) => ({
            ...prev,
            paid: e.target.value === "true",
          }))
        }
      >
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
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

  </div>
</Modal>
)}

      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((filteredProject) =>{
            const client = clients.find(c => c.id === filteredProjects.clientId);
            return (
              <tr key={filteredProject.id}>
                
                <td>{filteredProject.name}</td>
                
                <td>{client ? client.fullName : "Deleted Client"}</td>

                <td>{filteredProject.status}</td>
                
                <td>{`${filteredProject.amount} $`}</td>
                
                <td>{filteredProject.paid ? "✅ Paid" : "❌ Unpaid"}</td>
                
                <td>
                  <button
                  onClick={() => deleteProject(filteredProject.id)}
                  className='btn btn-delete'
                  >Delete
                  </button>
                  <button
                  onClick={() => startEdit(filteredProject)}
                  className='btn btn-edit'
                  >Edit
                  </button>
                </td>
              </tr>
            )
        })}
        </tbody>
      </table>
      </div>
    )}
  </>)
}
