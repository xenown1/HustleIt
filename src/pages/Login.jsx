import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

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

    function handleSubmit(e){
        e.preventDefault();
        if (
            formData.username === "" || formData.password === ""
        ) return window.alert(
            "Make sure the fields are filled!."
        );

        setUser({
            username: formData.username
        })

        navigate('/dashboard')


    }
  return (<>
    <form onSubmit={handleSubmit}>
        <label htmlFor='username'>username:</label>
        <input ref={inputRef} type='text' name='username' value={formData.username} onChange={handleChange}/>
        <label htmlFor='password'>password:</label>
        <input type='text' name='password' value={formData.password} onChange={handleChange}/>
        <button type='submit' className='btn-submit'>Login</button>
    </form>
  </>
  )
}
