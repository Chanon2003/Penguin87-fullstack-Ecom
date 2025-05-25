import { useDispatch, useSelector } from "react-redux"
import { FaUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../../components/user/menu/UserProfileAvatarEdit";
import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../../store/userSlice";
import fetchUserDetails from "../../utils/fetchUserDetails";

const Profile = () => {
  const user = useSelector((s)=>s.user)
  const [openProfileAvatarEdit,serProfileAvatarEdit] = useState(false)
  const [userData,setUserData] = useState({
    name:user.name,
    mobile:user.mobile
  })


  const dispatch = useDispatch()

  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    setUserData({
      name:user.name,
      mobile:user.mobile
    })
  },[user])

  const handleOnChange = (e) =>{
    const {name,value} = e.target
    setUserData((p)=>({
      ...p,[name]:value
    }))
  }

  const handleSubmit =async(e) =>{
    if(loading)return;
    e.preventDefault()
    setLoading(true)
    try {
      const res = await Axios({
        ...SummaryApi.updateUserDetails,
        data:userData
      })
      const {data:responseData} = res
      if(responseData.success){
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <div className="p-4">
      {/* profile upload and display image */}
      <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {
          user.avatar ? (
            <img
              alt={user.name}
              src={user.avatar}
              className="w-full h-full"
            />
          ) : (
             <FaUserCircle size={65}/>
          )
        }

      </div>
      <button onClick={()=>serProfileAvatarEdit(true)} className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3">Edit</button>
      
      {
        openProfileAvatarEdit && (
           <UserProfileAvatarEdit close={()=>serProfileAvatarEdit(false)}/>
        )
      }
     
     {/* name,mobile,change password */}
     <form className="my-4 grid gap-4" onSubmit={handleSubmit}> 
      <div className="grid">
        <label htmlFor="">Name</label>
        <input type="text"
          placeholder="Enter your name"
          className="p-2 bg-blue-50 outline-primary border focus-within:border-primary-200 rounded"
          value={userData.name}
          name="name"
          onChange={handleOnChange}
          id="name"
          required
        />
      </div>
      <div className="grid">
        <label htmlFor="mobile">Mobile</label>
        <input type="texy"
          id="mobile"
          placeholder="Enter your Mobile"
          className="p-2 bg-blue-50 outline-primary border focus-within:border-primary-200 rounded"
          value={userData.mobile}
          name="mobile"
          onChange={handleOnChange}
          required
        />
      </div>
      <button className=" border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-neutral-800 hover:text-green-800 ">
        {
          loading ? "Loading..." : "Submit"
        }
        </button>
     </form>
    </div>
  )
}
export default Profile