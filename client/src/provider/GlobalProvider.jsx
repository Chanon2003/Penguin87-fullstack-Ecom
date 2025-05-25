import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children})=>{
  const dispatch = useDispatch()
  const [totalPrice,setTotalPrice] = useState(0)
  const [notDiscountPrice,setNotDiscountPrice] = useState(0)
  const [totalQty,setTotalQty] = useState(0) 
  const cartItem = useSelector(s => s.cartItem.cart)
  const user =useSelector(s=>s.user)

  const fetchCartItem = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem
      })
      const {data:responseData} = response
      if(responseData.success){
        dispatch(handleAddItemCart(responseData?.data))
      }
    } catch (error) {
      // AxiosToastError(error)
    }
  }

  const updateCartItem = async(id,qty)=>{
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data:{
          id:id,
          qty:qty,
        }
      })
      const {data:responseData} = response
      if(responseData.success){
        fetchCartItem() 
        return responseData
      }
    } catch (error) {
      // AxiosToastError(error)
      return error
    }
  }

  const deleteCartItem = async(cartId)=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data:{
          id:cartId
        }
      })
      const {data:responseData} = response

      if(responseData.message){
        toast.success(responseData.message)
      }
    } catch (error) {
      // AxiosToastError(error)
    }
  }

  
  const handleLogOut1 = ()=>{
      localStorage.clear()
      dispatch(handleAddItemCart([]))
  }

  const fetchAddress = async() =>{
    try {
      const response = await Axios({
        ...SummaryApi.getAddress
      })
      const {data:responseData} = response
      if(responseData.success){
        dispatch(handleAddAddress(responseData.data))
      }
    } catch (error) {
      //
    }
  }
  
  useEffect(()=>{
    const qty = cartItem.reduce((p,c)=>{
      return p+c.quantity
    },0)
    setTotalQty(qty)
    const tPrice = cartItem.reduce((p,c)=>{
      const priceAfterDiscount = PriceWithDiscount(c.product.price,c.product.discount_show)
      return p + (priceAfterDiscount * c.quantity)
    },0)
    setTotalPrice(tPrice)

    const notDiscountPrice = cartItem.reduce((p,c)=>{
      return p + (c.product.price * c.quantity)
    },0)
    setNotDiscountPrice(notDiscountPrice)
  },[cartItem])

  useEffect(()=>{
    fetchCartItem() 
    handleLogOut1()
    fetchAddress()
  },[user])

  return (
    <GlobalContext.Provider value={{fetchCartItem,updateCartItem,deleteCartItem,totalPrice,totalQty,notDiscountPrice,fetchAddress}}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider