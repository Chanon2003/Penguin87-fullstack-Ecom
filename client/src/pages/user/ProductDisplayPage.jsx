import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'
import AxiosToastError from "../../utils/AxiosToastError"
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
import { DisplayPriceInBath } from '../../utils/DisplayPriceinBath';
import Divider from '../../components/common/Divider';
import image1 from '../../assets/rem1.jpg'
import image2 from '../../assets/rem2.jpg'
import image3 from '../../assets/ram1.jpg'
import { PriceWithDiscount } from '../../utils/PriceWithDiscount';
import AddToCartButton from '../../components/user/cart/AddToCartButton';
import Loading from '../../components/common/Loading';
import useDiscountCountdown from '../../utils/useDiscountCountdown';

const ProductDisplayPage = () => {
  const params = useParams();
  const productParam = params.product || "";
  const productId = productParam.split("-").slice(1).join("-");

  const [data, setData] = useState({
    name: '',
    image: [],
    price: 0,
    discount: 0,
    discount_show: 0,
    description: '',
    stock: '',
    more_details: {},
    unit: '',
    discount_start: '',
    discount_end: '',
  })

  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        const product = responseData.data;
        setData({
          ...product,
          price: Number(product.price),
          discount_show: Number(product.discount_show),
          discount: Number(product.discount), // ถ้าใช้ตัวนี้ด้วย
        });
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  const timeLeft = useDiscountCountdown(data.discount_start, data.discount_end);


  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
      {
        loading && <Loading />
      }
      <div className=''>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img src={data.image[image]?.productimage}
            alt=""
            className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            data.image.map((img, index) => {
              return (
                <div
                  key={img + index}
                  className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && 'bg-slate-300'}`}></div>
              )
            })
          }
        </div>

        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, index) => {
                return (
                  <div key={img.id} className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md'>
                    <img src={img.
                      productimage
                    } alt="min-product"
                      onClick={() => setImage(index)}
                      className='h-full w-full object-scale-down'
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full -ml-3 h-full flex absolute justify-between  items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white p-1 relative rounded-full shadow-lg'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white p-1 relative rounded-full shadow-lg'>
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>

      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <div className="flex items-center gap-1">
          {data.discount_show > 0 && data.discount_start && data.discount_end ? (
            <p className="text-red-500">เหลือเวลา: {timeLeft}</p>
          ) : null}

          {data.discount_show > 0 && (
            <div>
              <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
                {data.discount}% discount
              </p>
            </div>
          )}
        </div>

        <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
        <p className=''>{data.unit}</p>
        <Divider />
        <div>
          <p className=''>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-500 bg-green-50 w-fit px-4 py-2 rounded'>
              <p className='font-semibold text-lg lg:text-xl'>
                {DisplayPriceInBath(PriceWithDiscount(data.price, data.discount_show))}

              </p>
            </div>
            {
              data.discount_show ?
                <p className='line-through'>{DisplayPriceInBath(data.price)}</p>
                : ""
            }
            {Boolean(data.discount_show) && data.discount_show > 0 && (
              <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
                {data.discount}% discount
              </p>
            )}

          </div>
        </div>
        {
          data.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          )
            : (

              <div className='my-4'>
                <AddToCartButton data={data} />
              </div>
            )
        }

        {/* only mobile */}
        <div className='my-4 grid gap-3'>
          <div >
            <p className='font-semibold'>Discription</p>
            <p className='text-base '>{data.description}</p>
          </div>

          {(() => {
            const rawDetails = data?.more_details || data?.moredetail;
            if (!rawDetails) return null;

            let detailsArray = [];

            // Case 1: Already an array
            if (Array.isArray(rawDetails)) {
              detailsArray = rawDetails;
            }
            // Case 2: Already an object (not array)
            else if (typeof rawDetails === 'object' && rawDetails !== null) {
              detailsArray = [rawDetails];
            }
            // Case 3: JSON string
            else if (typeof rawDetails === 'string') {
              try {
                const parsed = JSON.parse(rawDetails);
                detailsArray = Array.isArray(parsed) ? parsed : [parsed];
              } catch (e) {
                console.error('Error parsing JSON:', e);
                return null;
              }
            }

            if (detailsArray.length === 0) return null;

            return detailsArray.map((detailObj, arrayIndex) => (
              <div key={arrayIndex} className="mb-4">
                {Object.entries(detailObj).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <p className="font-semibold text-gray-700 capitalize">{key}</p>
                    <p className="text-base text-gray-600">
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </p>
                  </div>
                ))}
              </div>
            ));
          })()}




        </div>
        <h2 className='font-semibold'>Why shop from Penguin87?</h2>
        <div>
          <div className='flex items-center gap-4 my-4 '>
            <img src={image1} alt="suprefast delivery" className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>
                Superfast Delivery
              </div>
              <p>Get your order delivered to yout doorstep at the earliest from dark stores near you</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4 '>
            <img src={image2} alt="suprefast delivery" className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>
                Best Prices & Offers
              </div>
              <p>Best price destination with offers directly from the nanufactures.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4 '>
            <img src={image3} alt="Wide Assortment" className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>
                Wide Assortment
              </div>
              <p>Choose from 5000+ products across food personal</p>
            </div>
          </div>

        </div>


      </div>
    </section>
  )
}
export default ProductDisplayPage