import { useEffect, useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import Axios from "../../../utils/Axios"
import SummaryApi from "../../../common/SummaryApi"
import AxiosToastError from "../../../utils/AxiosToastError"
import { setUserDetails, updatedAvatar } from '../../../store/userSlice'
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector(s => s.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)

  const handleUploadAvatar = async (e) => {
    if(loading)return
    setLoading(true);
    try {
      const file = e.target.files[0];
      if (!file) return console.error("No file selected!");
      if (!user.avatarPublicId) {
        const formData = new FormData();
        formData.append("avatar", file);
        const res = await Axios({
          ...SummaryApi.uploadAvatar,
          data: formData,
        });
        const { data: responseData } = res;
        // ✅ ใช้ responseData ให้ถูกต้อง
        dispatch(setUserDetails({ ...user, avatar: responseData.avatarUrl, avatarPublicId: responseData.avatarPublicId }));
      } else {
        const formData = new FormData();
        formData.append("avatar", file); // "avatar" ต้องตรงกับ upload.single('avatar')
        formData.append("oldImages", JSON.stringify([user.avatarPublicId])); // ต้องเป็น string

        const res = await Axios({
          ...SummaryApi.updateAvatar,
          data: formData,
        })

        const { data: responseData } = res;

        dispatch(setUserDetails({ ...user, avatar: responseData.avatarUrl, avatarPublicId: responseData.avatarPublicId }));
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      AxiosToastError(error);
    } finally {
      close();
      window.location.reload()
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async (e)=>{
    try {
      if(loading1)return
      setLoading1(true);

      const res = await Axios({
        ...SummaryApi.deleteAvatar,
        data: {publicId: user.avatarPublicId},
        
      });
      const { data: responseData } = res;
      if(responseData.success){
        dispatch(setUserDetails({ ...user, avatar: "", avatarPublicId: "" }));
      }

    } catch (error) {
      console.error(error);
    }finally {
      // close();
      // window.location.reload()
      setLoading1(false);
    }
  }
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button onClick={close} className=" text-neutral-800 w-fit block ml-auto">
          <IoClose size={25} />
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
        <div className="flex mx-auto gap-4">
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="uploadProfile">
            <div className="border border-primary-200 hover:bg-primary-200 px-4 py-1 rounded-md cursor-pointer text-sm my-3">
              {
                loading ? " Loading..." : "UpLoad"
              }

            </div>
          </label>
          <input onChange={handleUploadAvatar} type="file" id="uploadProfile" className="hidden" />
        </form>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="deleteAvatarProfile">
          <button
  disabled={!user.avatar}
  className={`border border-primary-200 px-4 py-1 rounded-md cursor-pointer text-sm my-3 ${
    !user.avatar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-200'
  }`}
>
  {loading1 ? "Loading..." : "Delete"}
</button>

          </label>
          <input onClick={handleDeleteAvatar} id="deleteAvatarProfile" className="hidden" />
        </form>
        </div>
       
        

      </div>
    </section>
  )
}
export default UserProfileAvatarEdit