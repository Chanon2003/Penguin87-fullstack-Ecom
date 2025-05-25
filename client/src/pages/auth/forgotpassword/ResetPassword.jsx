import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";

const ResetPassword = () => {
  const locaiton = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading,setLoading] = useState(false)

  const validValue = Object.values(data).every(el => el)

  useEffect(() => {
    if (!(locaiton?.state?.data?.success)) {
      navigate('/')
    }
    if (locaiton?.state?.email) {
      setData((p) => {
        return {
          ...p, email: locaiton?.state?.email
        }
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((p) => ({
      ...p, [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    if(loading)return;
    e.preventDefault()

    if(data.newPassword !== data.confirmPassword){
      toast.error("New password and confirm password must be same.")
      return 
    }
    setLoading(true)
    try {
      const res = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })
      if (res.data.error) {
        toast.error(res.data.message)
      }
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/login')
        setData({
          email: '',
          newPassword: '',
          confirmPassword: ''
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
        <p className="font-semibold text-lg">Enter Your new Password</p>
        <form action="" className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input type={showPassword ? 'text' : 'password'}
                autoFocus
                className="w-full bg-transparent outline-none"
                value={data.newPassword}
                id="password"
                name="newPassword"
                onChange={handleChange}
                placeholder="Enter new password"
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
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input type={showConfirmPassword ? 'text' : 'password'}
                autoFocus
                className="w-full bg-transparent outline-none"
                value={data.confirmPassword}
                id="password"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Enter New ConfirmPassword"
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
            disabled={!validValue} className={`${validValue ? "bg-green-600 hover:bg-green-500 text-white py-2 rounded font-semibold my-2 tracking-wide" : "bg-gray-500 text-white py-2 rounded font-semibold my-2 tracking-wide"}`} >Change Password</button>
        </form>
        <p>Already have acocount ? <Link to={'/login'} className='font-semibold text-green-500 hover:text-green-600'>Login</Link></p>
      </div>
    </section>
  )
}
export default ResetPassword