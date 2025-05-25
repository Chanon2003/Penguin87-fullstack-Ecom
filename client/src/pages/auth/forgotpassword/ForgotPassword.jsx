import { useState } from "react"
import toast from 'react-hot-toast'
import Axios  from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import AxiosToastError from "../../../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data,setData] = useState({
    email:'',
  })

  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)

  const handleChange = (e) =>{
    const {name,value} = e.target
    setData((p)=>({
      ...p,[name]:value
    }))
  }

  const validValue = Object.values(data).every(el=>el)

  const handleSubmit = async(e) =>{
    if(loading)return
    e.preventDefault()
    setLoading(true)
    try {
       const res = await Axios({
      ...SummaryApi.forgot_password,
      data: data
    })
    if(res.data.error){
      toast.error(res.data.message)
    }
    if(res.data.success){
      toast.success(res.data.message)
      navigate('/verification-otp',{
        state: data
      })
      setData({
        email:'',
      })
     
    }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
   
  }

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
      <p className="font-semibold text-lg">Forgot Password</p>
      <form action="" className="grid gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-1">
          <label htmlFor="email">Email :</label>
          <input type="email"
          autoFocus
          className="bg-blue-50 p-2 border rounded"
          value={data.email}
          id="email"
          name="email"
          onChange={handleChange}
          placeholder="email"
          />
        </div>
      
        
          <button 
          type="submit"
          disabled={!validValue} className={`${validValue ? "bg-green-600 hover:bg-green-500 text-white py-2 rounded font-semibold my-2 tracking-wide" : "bg-gray-500 text-white py-2 rounded font-semibold my-2 tracking-wide"}`} >Send Otp</button>
      </form>
      <p>Already have acocount ? <Link to={'/login'} className='font-semibold text-green-500 hover:text-green-600'>Login</Link></p>
      </div>
    </section>
  )
}
export default ForgotPassword