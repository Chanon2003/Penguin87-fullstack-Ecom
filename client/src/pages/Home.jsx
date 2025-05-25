import { useSelector } from 'react-redux'
import banner from '../assets/banner1/banner2.png'
import bannerMobile from '../assets/banner1/banner1.png'
import { validURLConvert } from '../utils/validURLConcert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/user/product/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(s => s.product.loadingCategory)
  const categoryData = useSelector(s => s.product.allCategory)
  const subCategoryData = useSelector(s=>s.product.allSubCategory)

  const navigate = useNavigate()

  const handleRedirectProductListPage = (id, cat) => {
    if (!subCategoryData || subCategoryData.length === 0) {
      // console.error("subCategoryData is empty or undefined");
      return;
    }

    const subCategory = subCategoryData.find((sub) => {
    
      // ตรวจสอบว่า sub.Category มีค่าและเป็นอ็อบเจ็กต์
      if (!sub.Category || typeof sub.Category !== 'object') {
        // console.error("sub.Category is undefined or not an object", sub);
        return false;
      }
    
      // ค้นหา category ภายใน sub.Category
      return sub.Category.id === id;
    });
    
    
    if (!subCategory) {
      // console.error("No matching subCategory found");
      return;
    }

    const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(subCategory.name)}-${subCategory.id}`;
    navigate(url)
  };

  return (
    <section className='bg-white'>
      <div className="container mx-auto">
        <div className={`w-full h-full min-h-48 my-1 rounded  ${!banner && "animate-pulse"}`}>
          <img src={banner} alt="banner"
            className='w-full h-full hidden lg:block'
          />
          <img src={bannerMobile} alt="banner"
            className='w-full h-full lg:hidden' />
        </div>
      </div>

      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => {
              return (
                <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-100 min-h-24 rounded'></div>


                  <div className='bg-blue-100 h-8 rounded'></div>

                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
                <div key={cat.id+'displayCategory'} className='w-full h-full' onClick={()=>handleRedirectProductListPage(cat.id,cat.name)}>
                  <div>
                    <img src={cat.catimage} alt={cat.name} 
                    className='w-full h-full object-scale-down cursor-pointer'
                    />
                    <p>{cat.name}</p>
                  </div>
                </div>
              )
            })

          )
        }
      </div>
      {/* display Category product */}
      {
        categoryData.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay key={c?.id+"categorywiseProduct"} id={c?.id} name={c?.name}/>
          )
        })
      }
      
    </section>

  )
}
export default Home