import React, { useState } from 'react'
import useExpenses from './useExpenses'
import useProjects from '../projects/useProjects'
import Modal from '../../components/Modal'

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense, getTotalExpenses } = useExpenses()
  const { projects } = useProjects()
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterProject, setFilterProject] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "tools",
    date: new Date().toISOString().split('T')[0],
    projectId: "",
    notes: ""
  })

  const categories = ["tools", "marketing", "software", "equipment", "other"]

  const filteredExpenses = expenses.filter(exp => {
    const s = search.toLowerCase()
    const matchesSearch = !s || 
      exp.name.toLowerCase().includes(s) ||
      exp.category.toLowerCase().includes(s) ||
      exp.notes.toLowerCase().includes(s)
    
    const matchesCategory = filterCategory === "all" || exp.category === filterCategory
    const matchesProject = filterProject === "all" || exp.projectId === filterProject

    return matchesSearch && matchesCategory && matchesProject
  })

  function handleAddExpense() {
    if (!formData.name || !formData.amount) {
      alert("Please fill in name and amount")
      return
    }

    if (editingId) {
      updateExpense(editingId, formData)
      setEditingId(null)
    } else {
      addExpense(formData)
    }

    resetForm()
    setIsModalOpen(false)
  }

  function resetForm() {
    setFormData({
      name: "",
      amount: "",
      category: "tools",
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      notes: ""
    })
  }

  function startEdit(expense) {
    setEditingId(expense.id)
    setFormData(expense)
    setIsModalOpen(true)
  }

  function deleteExp(id) {
    if (window.confirm("Delete this expense?")) {
      deleteExpense(id)
    }
  }

  const totalExpenses = getTotalExpenses()
  const getProjectName = (projectId) => {
    const proj = projects.find(p => p.id === projectId)
    return proj ? proj.name : "General"
  }

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="page-container">
        <div className="page-header">
        <h1>Expenses</h1>
        <button 
            className="btn btn-primary"
            onClick={() => {
            resetForm()
            setEditingId(null)
            setIsModalOpen(true)
            }}
        >
            + Add Expense
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
            <h3>Total Expenses</h3>
            <p className="stat-value">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="stat-card">
            <h3>Total Count</h3>
            <p className="stat-value">{expenses.length}</p>
        </div>
      </div>

    <div className="modal-field">
        <input
            type="text"
            placeholder="Search expenses..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="modal-group"
        >
            <option value="all">All Categories</option>
            {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
        </select>
        <select 
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="filter-dropdown"
        >
            <option value="all">All Projects</option>
            <option value="">General</option>
            {projects.map(proj => (
        <option key={proj.id} value={proj.id}>{proj.name}</option>
        ))}
        </select>
    </div>

    <div className="table-container">
        <table className="data-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Project</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredExpenses.length === 0 ? (
                <tr>
                    <td colSpan="7" className="empty-message">No expenses found</td>
                </tr>
            ) : (
                filteredExpenses.map(exp => (
                <tr key={exp.id}>
                    <td>{exp.name}</td>
                    <td className="amount">{formatCurrency(exp.amount)}</td>
                    <td>
                        <span className="badge">{exp.category}</span>
                    </td>
                    <td>{getProjectName(exp.projectId)}</td>
                    <td>{formatDate(exp.date)}</td>
                    <td className="notes-cell">{exp.notes || "-"}</td>
                    <td>
                        <button 
                            className="btn btn-edit"
                            onClick={() => startEdit(exp)}
                        >
                    Edit
                    </button>
                    <button 
                        className="btn btn-delete"
                        onClick={() => deleteExp(exp.id)}
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))
            )}
        </tbody>
        </table>
    </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{editingId ? "Edit Expense" : "Add New Expense"}</h2>
        <div className="form-group">
          <label>Expense Name *</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Software license"
            />
        </div>

        <div className="form-group">
          <label>Amount *</label>
            <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
            />
        </div>

        <div className="modal-field">
            <label>Category</label>
            <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
            {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
        </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div className="modal-field">
          <label>Project (Optional)</label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({...formData, projectId: e.target.value})}
          >
            <option value="">General</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Add any notes..."
            rows="3"
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleAddExpense}>
            {editingId ? "Update" : "Add"} Expense
          </button>
          <button className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
