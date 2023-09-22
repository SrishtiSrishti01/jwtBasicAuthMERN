import axios from 'axios';


const axiosInstance = axios.create(
    {
            baseURL: "http://localhost:5000",
        //     withCredentials: false,
        //     headers: {
        //       'Access-Control-Allow-Origin' : '*',
        //       'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',   
        //   }
    }
)

axiosInstance.interceptors.response.use((response) => {
    return response
}, async function(error) {
    const originalRequest = error.config

    if(error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true

        const token = localStorage.getItem('refreshtoken')
        const {data} = await axiosInstance.get('/refresh', {headers: {'Authorization' : `Bearer ${token}`}})
        localStorage.setItem('token', data)
        originalRequest.headers.Authorization = `Bearer ${data}`

        return axiosInstance(originalRequest)
    }

    return Promise.reject(error)
} )


      
export default axiosInstance