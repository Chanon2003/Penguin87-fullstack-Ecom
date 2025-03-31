import { useEffect, useState } from "react"
import { useGlobalContext } from "../provider/GlobalProvider"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import toast from "react-hot-toast"
import AxiosToastError from "../utils/AxiosToastError"
import Loading from './Loading'
import { useSelector } from "react-redux"
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { PriceWithDiscount } from "../utils/PriceWithDiscount"

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoding] = useState(false)
  const cartItem = useSelector(s => s.cartItem.cart)
  const [isAvailableCart, setIsAvailableCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartItemDetails, setCartItemDetails] = useState()
  // console.log('cartitemdt',cartItemDetails)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setLoding(true)
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data?.id,
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
      }
    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    } finally {
      setLoding(false)
    }
  }

  useEffect(() => {
    const checkingitem = cartItem.some(item => item.productId === data.id)
    setIsAvailableCart(checkingitem)

    const product = cartItem.find(item => item.productId === data.id)
    setQty(product?.quantity)
    setCartItemDetails(product)

  }, [data, cartItem])

  const increaseQty = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    const response = await updateCartItem(cartItemDetails?.id, qty + 1)
  }

  const decreaseQty = async(e) => {
    e.preventDefault()
    e.stopPropagation()
    if (qty === 1) {
      deleteCartItem(cartItemDetails?.id)
      setQty(0);
      setIsAvailableCart(false);

      // เรียก fetchCartItem() ให้แน่ใจว่าตะกร้าอัปเดตแล้ว
      setTimeout(() => {
        fetchCartItem();
      }, 50);
    } else {
      const response = await updateCartItem(cartItemDetails?.id, qty - 1)
      // if(response.success){
      //   toast.success('Item remove')
      // }
    }
  }

  return (
    <div className="w-full max-w-[150px]">
      {
        isAvailableCart ? (
          <div className="flex w-full h-full">
            <button onClick={decreaseQty} className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full rounded flex items-center justify-center"><FaMinus /></button>
            <p className="flex flex-1 justify-center font-semibold px-1">{qty}</p>
            <button onClick={increaseQty} className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full rounded flex items-center justify-center "><FaPlus /></button>
          </div>
        ) : (
          <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-2 rounded">
            {loading ? <Loading /> : 'Add'}
          </button>
        )
      }

    </div>
  )
}
export default AddToCartButton