import { useEffect, useState } from "react"
import UploadCategoryModel from "../../components/admin/category/UploadCategoryModel"
import Loading from "../../components/common/Loading"
import NoData from "../../components/common/NoData"
import Axios from "../../utils/Axios"
import SummaryApi from "../../common/SummaryApi"
import EditCategory from "../../components/admin/category/EditCategory"
import ConfirmBox from "../../components/common/ConfirmBox"
import toast from "react-hot-toast"
import AxiosToastError from "../../utils/AxiosToastError"
import { useSelector } from "react-redux"

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    catimage: '',
    catimagePublicId:''
  })

  const [openConfirmBoxDelete,setOpenConfirmBoxDelete] = useState(false)
  const [deleteCategory,setDeleteCategory] = useState({})

  const allCategory = useSelector(s=>s.product.allCategory)

  const fetchCategory = async () => {
    try {
      setLoading(true)
      const res = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = res
      if (responseData.success) {
        setCategoryData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
    setCategoryData(allCategory)
  }, [allCategory])

  const handleDeleteCategory = async()=>{
    if(loading)return;
    setLoading(true)
    try {
      const res = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory
      })
      const {data:responseData} = res
      if(responseData.success){
        toast.success(responseData.message)
        setOpenConfirmBoxDelete(false)
        fetchCategory()
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded">Add Category</button>
      </div>
      {
        !categoryData[0] && !loading && (
          <NoData />
        )
      }


      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categoryData.map((c, index) => {
          return (
            <div
              key={c.id}
              className="w-full h-72 shadow-lg bg-white rounded-lg overflow-hidden transform hover:scale-105 transition-all ease-in-out duration-300 border border-gray-300">

              {/* Image Section (3/5) */}
              <div className="w-full h-3/5 group bg-gray-100 border-b border-gray-300">
                <img
                  alt={c.name}
                  src={c.catimage}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Divider Line */}
              <div className="border-b border-gray-300"></div>

              {/* Name Section & Action Buttons (2/5) */}
              <div className="h-2/5 p-2 flex flex-col justify-between">
                {/* Name */}
                <div className="text-lg font-semibold text-gray-800 text-center">{c.name}</div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(c)
                  }} className="bg-green-100 hover:bg-green-300 text-green-600 font-medium py-2 px-4 rounded-lg transition-all">
                    Edit
                  </button>
                  <button onClick={()=>{
                    setOpenConfirmBoxDelete(true)
                    setDeleteCategory(c)
                  }} className="bg-red-100 hover:bg-red-300 text-red-600 font-medium py-2 px-4 rounded-lg transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {
        loading && (
          <Loading />
        )
      }

      {
        openUploadCategory && (
          <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
        )
      }

      {
        openEdit && (
          <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
        )
      }

      {
        openConfirmBoxDelete && (
          <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)} 
          cancel={()=>setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
          loading={loading}
          />
        )
        
      }
    </section>


  )
}
export default Category