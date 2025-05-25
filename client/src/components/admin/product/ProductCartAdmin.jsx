import { useEffect, useState } from "react"
import EditProductAdmin from "./EditProductAdmin"
import { IoClose } from "react-icons/io5"
import AxiosToastError from "../../../utils/AxiosToastError"
import Axios from "../../../utils/Axios"
import SummaryApi from "../../../common/SummaryApi"
import toast from "react-hot-toast"
import { IoReload } from "react-icons/io5";

const ProductCartAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading.");

  const handleDeleteCancel = () => {
    setOpenDelete()
  }

  const handleDelete = async () => {
    if(loading)return;
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          id: data.id,
          oldImagePublicIds: data.image.map((el) => el.productimagePublicId
          )
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchProductData) {
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div className="w-36 p-4 bg-white rounded">
      <div>
        <img src={data?.image[0]?.productimage
        } alt={data.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-medium">{data?.name}</p>
      <p className="text-slate-400">stock:{data?.stock}</p>
      <p className="text-slate-400">sold:{data?.sold}</p>
      <div className="grid grid-cols-2 gap-3 py-2">
        <button onClick={() => setEditOpen(true)} className="border px-2 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded">Edit</button>
        <button onClick={() => setOpenDelete(true)} className="border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded">Delete</button>
      </div>
      {
        editOpen && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
        )
      }
      {/* <ConfirmBox /> */}
      {
        openDelete && (
          <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center ">
            <div className="bg-white p-4 w-full max-w-md rounded-md">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">Permanent Delete</h3>
                <button onClick={() => setOpenDelete(false)}>
                  <IoClose size={25} />
                </button>
              </div>
              <p className="my-2">Are you sure want to delete permanent?</p>
              <div className="flex justify-end gap-5 py-2">
                <button 
                disabled={loading}
                onClick={handleDeleteCancel} className="border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200">Cancel</button>
                <button disabled={loading} onClick={handleDelete} className="border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      {loadingText} <IoReload className="animate-spin ml-2" />
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </section>
        )
      }

    </div>
  )
}
export default ProductCartAdmin