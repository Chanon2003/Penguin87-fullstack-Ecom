import { Link } from "react-router-dom"
import { DisplayPriceInBath } from "../utils/DisplayPriceinBath"
import { validURLConvert } from "../utils/validURLConcert"
import { PriceWithDiscount } from "../utils/PriceWithDiscount"
import AxiosToastError from "../utils/AxiosToastError";
import { useState } from "react";
import Axios from '../utils/Axios';
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data.id}`
  const [loading,setLoding] = useState(false)


  // console.log('dataimage',data)
  return (
    <Link to={url} className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white mb-3 mt-1">
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data?.image[0]?.url}
          className="w-full h-full object-scale-down lg:scale-125"
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="rounded w-fit text-xs p-[1px] px-2 text-green-600 bg-green-50">
          10 min
        </div>
        <div >
          {
            Boolean(data.discount) && (
              <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">{data.discount}% discount</p>
            )
          }
        </div>
      </div>

      <div className="px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>
      <div className="w-fit items-center gap-1 px-2 text-sm lg:text-base">
        <span className="text-sm text-green-600">stock : </span>{data.stock}

      </div>

      <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="flex items-center gap-1">
          <div className="font-semibold">
            {DisplayPriceInBath(PriceWithDiscount(data.price, data.discount))}
          </div>


        </div>

        <div className="">
          {
            data.stock == 0 ? (
              <p className="text-red-500 text-sm text-center">Out of Stock</p>
            ): (
              <AddToCartButton data={data}/>
            )
          }
          
        </div>
      </div>

    </Link>
  )
}
export default CardProduct