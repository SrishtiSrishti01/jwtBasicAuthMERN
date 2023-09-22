import React, { useEffect } from 'react'
import axios from './axios/api.js'
function Home() {

    useEffect(()=> {
        (async function() {
            const token = localStorage.getItem('token')
            await axios.get('/protected', {headers : {'Authorization' : `Bearer ${token}`}})
        })()
    }, [])
  return (
    <div>Home</div>
  )
}

export default Home