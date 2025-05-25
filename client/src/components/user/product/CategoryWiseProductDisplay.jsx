import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import AxiosToastError from "../../../utils/AxiosToastError"
import Axios from '../../../utils/Axios'
import SummaryApi from "../../../common/SummaryApi"
import CardLoding from "../cart/CardLoding"
import CardProduct from "../cart/CardProduct"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { useSelector } from "react-redux"
import { validURLConvert } from "../../../utils/validURLConcert"

const CategoryWiseProductDisplay = ({ id, name }) => {
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState([])
  const containerRef = useRef()

  const subCategoryData = useSelector(s=>s.product.allSubCategory)
  const loadingCardNumber = new Array(6).fill(null)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setData(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
  }, [])

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200
  }

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200
  }

  


  const handleRedirectProductListPage = () => {
  
    if (!subCategoryData || subCategoryData.length === 0) {
      // console.error("subCategoryData is empty or undefined");
      return;
    }
  
    
    const subCategory = subCategoryData.find((sub) => {
    
      // ตรวจสอบว่า sub.Category มีค่าและเป็นอ็อบเจ็กต์
      if (!sub.Category || typeof sub.Category !== 'object') {
        console.error("sub.Category is undefined or not an object", sub);
        return false;
      }
    
      // ค้นหา category ภายใน sub.Category
      return sub.Category.id === id;
    });
    
    if (!subCategory) {
      // console.error("No matching subCategory found");
      return;
    }
    
    const url = `/${validURLConvert(name)}-${id}/${validURLConvert(subCategory.name)}-${subCategory?.id}`;

    return url
  };

  return (
    <div>
      <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
        <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
        <Link to={handleRedirectProductListPage()} className='text-green-600 hover:text-green-400'>See All</Link>
      </div>
      <div className="relative flex items-center ">
        <div className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth" ref={containerRef}>
          {loading && loadingCardNumber.map((id, index) => {
            return (
              <CardLoding key={"CategorywiseProductDisplay1234" + index} />
            )
          })}
          {
            data?.map((p, index) => {
              return (
                <CardProduct data={p} key={p.id + "CategorywiseProductDisplay" + index} />
              )
            })
          }

        </div>
        
        <div className="w-full left-0 right-0 container mx-auto px-2 absolute flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-2xl p-2 rounded-full">
            <FaAngleLeft />
          </button>
          <button onClick={handleScrollRight} className="z-10 relative bg-white shadow-lg text-lg p-2 rounded-full">
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  )
}
export default CategoryWiseProductDisplay