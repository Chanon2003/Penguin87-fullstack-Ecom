import { useState } from "react"
import { useSelector } from "react-redux"
import AddAddress from "../../../components/user/address/AddAddress"
import { MdDelete } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'
import EditAddressDetails from "../../../components/user/address/EditAddressDetails"
import Axios from "../../../utils/Axios"
import SummaryApi from "../../../common/SummaryApi"
import toast from "react-hot-toast"
import AxiosToastError from "../../../utils/AxiosToastError"
import { useGlobalContext } from "../../../provider/GlobalProvider"
import Loading from "../../../components/common/Loading"

const Address = () => {
  const addressList = useSelector(s => s.address.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()
  const [loading, setLoading] = useState(false)

  const handleDisableAddress = async (id) => {
    const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?");
    if (!confirm) return;
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          id: id
        }
      })
      if (response.data.success) {
        toast.success('Address Remove')
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="">
      <div className="bg-white shadow-md px-2 py-2 flex justify-between gap-4 items-center">
        <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full">
          Add Address
        </button>
      </div>
      <div className="bg-blue-50 p-2 grid gap-4">
        {
          addressList.map((address, index) => {
            return (
              <div className={`border rounded p-3 flex gap-3 bg-white ${!address.status && 'hidden'}`} key={address + "soi" + index}>

                <div className="w-full">
                  <p>{address.address_line}</p>
                  <p>{address.city}</p>
                  <p>{address.state}</p>
                  <p>{address.country} - {address.pincode}</p>
                  <p>{address.mobile}</p>
                </div>
                <div className="grid gap-10">
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(address)
                  }} className="bg-green-200 p-1 rounded hover:text-white hover:bg-green-500">
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDisableAddress(address.id)}
                    className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-500"
                  >
                    {loading ? <Loading /> : <MdDelete size={20} />}
                  </button>
                </div>
              </div>

            )
          })
        }
        <div onClick={() => setOpenAddress(true)} className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer">
          Add address
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }

      {
        openEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  )
}
export default Address