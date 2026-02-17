import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'

export default function Login() {
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const inputRef = useRef(null)

    useEffect(()=> {
        inputRef.current.focus()
    },[])
    

    function handleChange(e){
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name] : value
        })
    }

async function handleSubmit(e) {
    e.preventDefault();
    
    if (formData.username === "" || formData.password === "") {
        return window.alert("Make sure the fields are filled!");
    }
    
    try {
        const response = await fetch('https://hustleit-backend-production.up.railway.app/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        
        const data = await response.json()
        
        if (response.ok) {
            setUser({ username: data.user.username })
            navigate('/dashboard')
        } else {
            alert(data.error)
        }
    } catch (error) {
        alert('Login failed!')
    }
}
  return (<>
    <form onSubmit={handleSubmit}>
        <label htmlFor='username'>username:</label>
        <input ref={inputRef} type='text' name='username' value={formData.username} onChange={handleChange}/>
        <label htmlFor='password'>password:</label>
        <input type='text' name='password' value={formData.password} onChange={handleChange}/>
        <button type='submit' className='btn-submit'>Login</button>
    </form>
    <p>Don't have an account? <Link to="/register">Register</Link></p>
  </>
  )
}
