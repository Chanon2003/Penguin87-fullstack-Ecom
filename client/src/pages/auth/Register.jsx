import { useState } from "react"
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import toast from 'react-hot-toast'
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";


const Register = () => {
  const [loading,setLoading] = useState(false)

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((p) => ({
      ...p, [name]: value
    }))
  }

  const validValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    if(loading)return
    e.preventDefault()

    if (data.password !== data.confirmPassword) {
      toast.error(
        "password and confirm password must be same"
      )
      return
    }

    try {
      setLoading(true)
      const res = await Axios({
        ...SummaryApi.register,
        data: data
      })
      if (res.data.error) {
        toast.error(res.data.message)
      }
      if (res.data.success) {
        toast.success(res.data.message)
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        })
        navigate('/login')
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }

  }

  return (
    <section className="w-full container mx-auto px-2">
      {loading && (
        <div><Loading/></div>
      )}
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p>Welcome to penguin87</p>
        <form action="" className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input type="text"
              autoFocus
              className="bg-blue-50 p-2 border rounded"
              value={data.name}
              id="name"
              name="name"
              onChange={handleChange}
              placeholder="name"
            />
          </div>

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
          <div className="grid gap-1">
            <label htmlFor="password">password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input type={showPassword ? 'text' : 'password'}
                autoFocus
                className="w-full bg-transparent outline-none"
                value={data.password}
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="password"
              />
              <div onClick={() => setShowPassword(p => !p)} className="cursur-pointer">
                {
                  showPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )
                }
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">confirmPassword :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input type={showConfirmPassword ? 'text' : 'password'}
                autoFocus
                className="w-full bg-transparent outline-none"
                value={data.confirmPassword}
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="confirmPassword"
              />
              <div onClick={() => setShowConfirmPassword(p => !p)} className="cursur-pointer">
                {
                  showConfirmPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )
                }
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!validValue || loading} className={`${validValue ? "bg-green-600 hover:bg-green-500 text-white py-2 rounded font-semibold my-2 tracking-wide" : "bg-gray-500 text-white py-2 rounded font-semibold my-2 tracking-wide"}`} >Register</button>
        </form>
        <p>Already have acocount ? <Link to={'/login'} className='font-semibold text-green-500 hover:text-green-600'>Login</Link></p>
      </div>
    </section>
  )
}
export default Register