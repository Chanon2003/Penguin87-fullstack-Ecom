import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from '../../utils/Axios'
import SummaryApi from "../../common/SummaryApi"
import AxiosToastError from "../../utils/AxiosToastError"
import Loading from '../../components/common/Loading'
import CardProduct from "../../components/user/cart/CardProduct"
import { useSelector } from 'react-redux'
import { validURLConvert } from "../../utils/validURLConcert"

const ProductListPage = () => {
  const params = useParams()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const AllSubCategory = useSelector(s => s.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  const subCategoryPrefix = params.subCategory ? params.subCategory.split("-")[0] : "";

  const categoryId = params.category.split('-').slice(1).join('-');
  const subCategoryId = params.subCategory.split("-").slice(1).join("-");

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

        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(response.totalCount)

      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      if (!s.categoryId) return false; // ✅ ป้องกัน undefined
      return s.categoryId == categoryId;
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
              const link = `/${validURLConvert(s?.Category?.name)}-${s?.Category?.id}/${validURLConvert(s.name)}-${s.id}`;

              return (
                <Link to={link} key={s.id} className={`
    w-full p-2
    md:flex md:flex-col lg:flex-row
    items-center text-center
    lg:w-full lg:h-16
    box-border lg:gap-4 border-b
    hover:bg-green-100 cursor-pointer
    ${subCategoryId === s.id ? "bg-green-100" : ""}
  `}>
                  <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded  box-border' >
                  <img
  src={s.subcatimage}
  alt="subCategory"
  className="w-14 h-14 object-contain mx-auto"
/>

                  </div>

                  <p className="hidden md:block text-xs md:text-base lg:text-base mt-2 lg:mt-0 text-center lg:text-left">
  {s.name}
</p>

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
          {
            loading && (
              <Loading />
            )
          }
          <div>

            <div className=" min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
              <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 p-4 gap-4 ">
                {
                  data.map((p, index) => {

                    return (
                      <CardProduct data={p} key={p.id + "productSubCategory" + index} />
                    )
                  })
                }
              </div>
            </div>



          </div>
        </div>
      </div>
    </section>
  )
}
export default ProductListPage