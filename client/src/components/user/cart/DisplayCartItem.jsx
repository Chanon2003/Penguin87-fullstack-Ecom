import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../provider/GlobalProvider'
import { DisplayPriceInBath } from '../../../utils/DisplayPriceinBath'
import { FaCaretRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { PriceWithDiscount } from '../../../utils/PriceWithDiscount'
import imageEmpty from '../../../assets/ram1.jpg'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
  const { notDiscountPrice, totalPrice,totalQty} = useGlobalContext()
  const cartItem = useSelector(s => s.cartItem.cart)
  const user = useSelector(s=>s.user)
  const navigate = useNavigate()
  
  const redirectToCheckoutPage = () =>{
    if(user?.id){
      navigate('/checkout')
      if(close){
        close()
      }
      return
    }
    toast.error('Please login')
  }

  return (
    <section className="bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen min-hh-screen max-h-screen ml-auto">
        <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
          <h2 className='font-semibold'>Cart</h2>
          <Link to={'/'} className='lg:hidden'>
            <IoClose size={25} />
          </Link>
          <button onClick={close} className='hidden lg:block'>
            <IoClose size={25} />
          </button>
        </div>
        <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
          {/* display items */}
          {
            cartItem[0] ? (
              <>
                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                  <p>Your total savings</p>
                  <p>{DisplayPriceInBath(notDiscountPrice - totalPrice)}</p>
                </div>
                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItem[0] && (
                      cartItem.map((item, index) => {
                        return (
                          <div key={index} className='flex w-full gap-4'>
                            <div className='w-16 h-16 min-h-16  min-w-16 bg-red-500 border rounded'>
                              <img src={item?.product?.image[0].productimage} alt=""
                                className='w-full h-full'
                              />
                            </div>
                            <div className='w-full max-w-sm text-sx'>
                              <p className='text-xs text-ellipsis line-clamp-2'>{item?.product?.name}</p>
                              <p className='text-neutral-400'>{item?.product?.unit}</p>
                              <p className='font-semibold'>{PriceWithDiscount(item?.product?.price, item?.product?.discount_show)}</p>
                            </div>
                            <div>
                              <AddToCartButton data={item?.product} />
                            </div>
                          </div>
                        )
                      })
                    )
                  }
                </div>
                <div className='bg-white p-4'>
                  <h3 className='font-semibold'>Bill details</h3>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Items total</p>
                    <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInBath(notDiscountPrice)}</span><span>{DisplayPriceInBath(totalPrice)}</span></p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Quantity total</p>
                    <p className='flex items-center gap-2'>{totalQty} item</p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Delivery Charge</p>
                    <p className='flex items-center gap-2'>Free</p>
                  </div>
                  <div className='font-semibold flex items-center justify-between gap-4'>
                    <p>Gran total</p>
                    <p>{DisplayPriceInBath(totalPrice)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex bg-white flex-col justify-center items-center'>
                <img src={imageEmpty} alt="" className='w-full h-full object-scale-down' />
                <Link onClick={close} to={'/'} className='block bg-green-600 px-4 py-2 text-white rounded'>Shop Now</Link>
              </div>
            )

          }

        </div>

        {
          cartItem[0] && (
            <div className='p-2'>
              <div className='bg-green-700 text-neutral-100 px-2 font-bold text-base  py-4 static bottom-3 rounded flex items-center gap-4 justify-between'>
                <div>
                  {DisplayPriceInBath(totalPrice)}
                </div>
                <button onClick={redirectToCheckoutPage} className='flex items-center gap-2'>
                  PROCEED
                  <span><FaCaretRight /></span>
                </button>
              </div>
            </div>
          )
        }

      </div>
    </section>
  )
}
export default DisplayCartItem