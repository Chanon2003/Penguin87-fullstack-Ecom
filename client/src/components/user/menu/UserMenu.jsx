import { useDispatch, useSelector } from "react-redux"
import { Link, Links, useNavigate } from "react-router-dom"
import Divider from "../../common/Divider"
import Axios from '../../../utils/Axios'
import SummaryApi from "../../../common/SummaryApi"
import { logout } from "../../../store/userSlice"
import toast from 'react-hot-toast'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from "../../../utils/isAdmin"

const UserMenu = ({ close }) => {
  const user = useSelector((s) => s.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.logout
      })
      if (res.data.success) {
        if (close) {
          close()
        }
        dispatch(logout())
        localStorage.clear()
        navigate('/')
        toast.success(res.data.message)

      }
    } catch (error) {
      // console.log(error)
      // AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }

  return (
    <div>
      <div className="font-semibold">
        My Acoount
      </div>
      <div className="text-sm flex items-center gap-1">
        <span className="max-w-52 text-ellipsis line-clamp-1">{user.name || user.mobile}
          <span className="text-medium text-red-600">({user.role === 'ADMIN' ? "Admin" : "User"})</span>
        </span>
        <Link
          className="hover:text-primary-200"
          onClick={handleClose}
          to={'/dashboard/profile'}><HiOutlineExternalLink
            size={15} /></Link></div>

      <Divider />

      <div className="text-sm grid gap-1">
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/category"} className="px-2 hover:bg-orange-200 py-1">Category</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link
              onClick={(e) => {
                e.preventDefault();  // ป้องกันการโหลดหน้าใหม่
                handleClose();  // เรียกใช้งาน handleClose
                navigate("/dashboard/subcategory");  // ใช้ navigate เพื่อพาไปยังหน้าที่ต้องการ
                // window.location.reload();  // รีเฟรชหน้าเว็บ
              }}
              className="px-2 hover:bg-orange-200 py-1"
            >
              Sub Category
            </Link>
          )
        }


        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/upload-product"} className="px-2 hover:bg-orange-200 py-1">Upload Product</Link>
          )
        }


        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/product"} className="px-2 hover:bg-orange-200 py-1">Product</Link>
          )
        }


        {
          user.role ? (
            <>
              <Link onClick={handleClose} to={"/dashboard/myorders"} className="px-2 hover:bg-orange-200 py-1">My Orders</Link>
              <Link onClick={handleClose} to={"/dashboard/address"} className="px-2 hover:bg-orange-200 py-1">Save Address</Link>
              {
                user.role === 'ADMIN' && (
                  <Link onClick={handleClose} to={"/dashboard/user"} className="px-2 hover:bg-orange-200 py-1">User</Link>
                )
              }
              <button onClick={handleLogout} className="text-left px-2 hover:bg-orange-200 py-1">Log Out</button>
            </> 
          ) : (
            <>
              <div>login</div>
            </>
          )
        }


      </div>
    </div>
  )
}
export default UserMenu