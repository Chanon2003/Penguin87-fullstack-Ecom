import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from '../utils/Axios'
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"
import Loading from '../components/Loading'
import CardProduct from "../components/CardProduct"
import { useSelector } from 'react-redux'
import { validURLConvert } from "../utils/validURLConcert"

const ProductListPage = () => {
  const params = useParams()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const AllSubCategory = useSelector(s => s.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  const categoryPrefix = params.category ? params.category.split("-")[0] : "";
  const subCategoryPrefix = params.subCategory ? params.subCategory.split("-")[0] : "";

  //importent
  const categoryId = params.category.split('-').slice(1).join('-');
  const subCategoryId = params.subCategory.split("-").slice(1).join("-");
  const soi = params.subCategory

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page) {
          setData(responseData.data)
          // console.log('responsedata1,',responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        // console.log(responseData)
        setTotalPage(response.totalCount)

      }
    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
    // console.log('realdata',data)
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      if (!s.categoryRelations) return false; // ✅ ป้องกัน undefined
      // console.log('s.c',s.categoryRelations)
      return s.categoryRelations.some(el => el.category.id == categoryId);
    });
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory]);




  return (
    <section className="sticky top-24 lg:top-20">
      <div className='container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/* sub category */}
        <div className=' min-h-[88vh] max-h-[88vh] overflow-y-scroll  grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {
            DisplaySubCategory.map((s, index) => {
              // console.log('s',s)
              const link  =`/${validURLConvert(s?.categoryRelations[0]?.category?.name)}-${s?.categoryRelations[0]?.category?.id}/${validURLConvert(s.name)}-${s.id}`;
              return (
                <Link to={link} key={s+index} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                  hover:bg-green-100 cursor-pointer
                  ${subCategoryId === s.id ? "bg-green-100" : ""}
                `}>
                    <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded  box-border' >
                    <img src={s.image} alt="subCategory"
                       className=' w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                    />
                  </div>
                  
                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>
        {/* Product */}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            <h3>{subCategoryPrefix}</h3>
          </div>
          <div>
            <div className=" min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 ">
              {
                data.map((p, index) => {
                  return (
                    <CardProduct data={p} key={p.id + "productSubCategory" + index} />
                  )
                })
              }
            </div>
            </div>
          
            {
              loading && (
                <Loading />
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}
export default ProductListPage