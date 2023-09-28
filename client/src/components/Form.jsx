import React, { useState } from 'react'
import axios from './axios/api.js'
import { useNavigate } from 'react-router-dom'
export default function Form() {

  const [formState, setFormState] = useState('register')
  const [values, setValues] = useState({username:'', email: '', password: ''})

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues(prev => ({...prev, [e.target.name]: e.target.value}))
    console.log(values)
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    const response = await axios.post(`/${formState}`, values, {
      withCredentials: true
    })
    const {token} = response.data
    // if(status === 201) {
      localStorage.setItem('token', token)
      // localStorage.setItem('refreshtoken', refreshToken)
      navigate('/home')
    // }
  }

  return (
    <div className='flex justify-center items-center'>

      <form className='flex flex-col w-[250px]' onSubmit = {handleSubmit}>

        {formState === 'register' && <input type="text" name = "username" value={values.username} onChange = {handleChange} className="border h-[40px] w-full pl-2" placeholder='Enter your user name' />}
        <input type="email" name = "email" value={values.email} onChange = {handleChange} className='border h-[40px] w-full pl-2' placeholder='Enter your email' />
        <input type="password" name = "password" value={values.password} onChange = {handleChange} className='border h-[40px] w-full pl-2' placeholder='Enter password' />
        <button type = "submit" className='w-full bg-sky-500 text-white cursor-pointer mt-5 h-[40px]'>{formState === 'register'? 'Register' : 'Login'} </button>
        <div className = "text-center cursor-pointer" onClick={()=> {setFormState(prev => prev === 'register' ? 'login' : 'register')}}>{formState === 'register' ? 'Already a user? Login' : 'Not a user ? Register'}</div>
    
      </form>

    </div>
  )
}

