import { useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"
import {setUserDetails, updatedAvatar} from '../store/userSlice'
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({close}) => {
  const user = useSelector(s => s.user)
  const dispatch = useDispatch()
  const [loading,setLoading] = useState(false)


  const handleUploadAvatar = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return console.error("No file selected!");
  
      const formData = new FormData();
      formData.append("avatar", file);
  
      setLoading(true);
  
      const res = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const { data: responseData } = res;
  
      // ✅ ใช้ responseData ให้ถูกต้อง
      dispatch(setUserDetails({ ...user, avatar: responseData.avatarUrl }));
  
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  

 

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button onClick={close} className=" text-neutral-800 w-fit block ml-auto">
          <IoClose size={25}/>
        </button>
        <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
          {
            user.avatar ? (
              <img
                alt={user.name}
                src={user.avatar}
                className="w-full h-full"
              />
            ) : (
              <FaUserCircle size={65} />
            )
          }

        </div>
        <form onSubmit={(e)=>e.preventDefault()}>
          <label htmlFor="uploadProfile">
            <div className="border border-primary-200 hover:bg-primary-200 px-4 py-1 rounded-md cursor-pointer text-sm my-3">
              {
                loading ? " Loading..." : "UpLoad"
              }

            </div>
          </label>
          <input onChange={handleUploadAvatar} type="file" id="uploadProfile" className="hidden" />
        </form>

      </div>
    </section>
  )
}
export default UserProfileAvatarEdit