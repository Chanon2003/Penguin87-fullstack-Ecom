import { useForm } from 'react-hook-form'
import Axios from '../../../utils/Axios'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../../utils/AxiosToastError' 
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '../../../provider/GlobalProvider'
import { useState } from 'react'

const AddAddress = ({close}) => {
  const { register, handleSubmit,reset } = useForm()
  const {fetchAddress} = useGlobalContext()
  const [loading,setLoading] = useState(false)

  const onSubmit = async(data) => {
    if(loading)return;
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data:{
          address_line : data.addressline,
          city:data.city,
          state:data.state,
          country:data.country,
          pincode:data.pincode,
          mobile:data.mobile
        }
      })
      const {data:responseData} =response
      if(responseData.success){
        toast.success(responseData.message)
        if(close){
          close()
          reset()
          fetchAddress()
        }
      }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 overflow-auto h-screen">
      <div className="bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded">
        <div className='flex justify-between'>
           <h2 className="font-semibold">Add Address</h2>
        <IoClose size={25} className='cursor-pointer hover:text-red-500' onClick={close}/>
        </div>
       
        <form action="" className="mt-4 grid gap-4"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <label htmlFor="addressline">Address Line:</label>
            <input type="text" className="border bg-blue-50 p-2 rounded " id="addressline"
              {...register("addressline", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="city">City :</label>
            <input type="text" className="border bg-blue-50 p-2 rounded " id="city"
              {...register("city", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="state">State :</label>
            <input type="text" className="border bg-blue-50 p-2 rounded " id="state"
              {...register("state", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="pincode">Pincode :</label>
            <input type="text" className="border bg-blue-50 p-2 rounded " id="pincode"
              {...register("pincode", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="country">Country :</label>
            <input type="text" className="border bg-blue-50 p-2 rounded " id="country"
              {...register("country", { required: true })}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="mobile">Mobile Number:</label>
            <input type="text" className="border bg-blue-50 p-2 rounded " id="mobile"
              {...register("mobile", { required: true })}
            />
          </div>
          
          
          <button type='submit' className='bg-primary-200 w-full mt-4 py-2 font-semibold hover:bg-primary-100'>{
            loading ? 'loading...' : 'Submit'
            }</button>
        </form>
      </div>
    </section>
  )
}
export default AddAddress