// import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Form from './components/Form.jsx'
import Home from './components/Home.jsx'
const router = createBrowserRouter([
  {
    path : '/',
    element: <Form></Form>
  },
  {
    path : '/home',
    element: <Home></Home>
  }
])
function App() {
  
  return (
    <>
      <RouterProvider router = {router}></RouterProvider>
    </>
  )
}

export default App
