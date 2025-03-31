import { useEffect, useState } from "react"
import { useGlobalContext } from "../provider/GlobalProvider"
import { DisplayPriceInBath } from "../utils/DisplayPriceinBath"
import AddAddress from "../components/AddAddress"
import { useSelector } from "react-redux"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'


const CheckoutPage = () => {
  const { notDiscountPrice, totalPrice, totalQty, fetchCartItem } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(s => s.address.addressList)
  const [selectAddress, setSelectAddress] = useState(null)
  const cartItemsList = useSelector(s => s.cartItem.cart)

  const [isProcessing, setIsProcessing] = useState(false);  // ป้องกันการคลิกซ้ำ

  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await Axios({
        ...SummaryApi.cashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?.id,
          totalAmt: totalPrice,
          subTotalAmt: totalPrice,
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        navigate('/')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsProcessing(false);
    }
  }

  const handleOnlinePayment = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      navigate('/payment', {
        state: {
          data: {
            list_items: cartItemsList,
            addressId: addressList[selectAddress]?.id,
            totalAmt: totalPrice,
            subTotalAmt: totalPrice,
          }
        }
      })

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    // console.log("Cart items updated:", cartItemsList);
  }, [cartItemsList]);

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/* address */}
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {
              addressList.map((address, index) => {
                return (
                  <label htmlFor={'address' + index} key={index} className={!address.status && 'hidden'}>
                    <div className="border rounded p-3 flex gap-3 hover:bg-blue-50" key={address + "soi" + index}>
                      <div>
                        <input type="radio"
                          id={'address' + index}
                          name="address" value={index} onChange={(e) => setSelectAddress(e.target.value)} />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>

                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer">
              Add address
            </div>
          </div>


        </div>

        <div className="w-full max-w-md bg-white py-4 px-2 mx-auto">
          {/* summary */}
          <h3 className="text-lg font-semibold">Summary</h3>
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
          <div className="w-full flex flex-col gap-4">
            <button
              onClick={handleOnlinePayment}
              disabled={!addressList[selectAddress]?.id || cartItemsList.length === 0}
              className={`py-2 px-4 border-2 border-green-600 bg-white hover:bg-green-600 rounded text-green-600 hover:text-white font-semibold 
                ${(!addressList[selectAddress]?.id || cartItemsList.length === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Online Payment
            </button>

            <button
              onClick={handleCashOnDelivery}
              disabled={!addressList[selectAddress]?.id || cartItemsList.length === 0}
              className={`py-2 px-4 border-2 border-green-600 bg-white hover:bg-green-600 rounded text-green-600 hover:text-white font-semibold 
               ${(!addressList[selectAddress]?.id || cartItemsList.length === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Cash on delivery
            </button>




          </div>

        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}
export default CheckoutPage