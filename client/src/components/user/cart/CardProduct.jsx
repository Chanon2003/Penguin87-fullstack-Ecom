import { Link } from "react-router-dom"
import { DisplayPriceInBath } from "../../../utils/DisplayPriceinBath"
import { validURLConvert } from "../../../utils/validURLConcert"
import { PriceWithDiscount } from "../../../utils/PriceWithDiscount"
import AddToCartButton from "./AddToCartButton";
import useDiscountCountdown from "../../../utils/useDiscountCountdown";

const CardProduct = ({ data }) => {

  const url = `/product/${validURLConvert(data.name)}-${data.id}`

  return (
    <Link 
  to={url} 
  className="border p-3 lg:p-4 grid gap-2 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow"
>
  {/* Product Image */}
  <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
    <img
      src={data?.image[0]?.productimage}
      className="w-full h-full object-contain"
      alt={data.name}
    />
  </div>

  {/* Discount Badges */}
  <div className="flex flex-wrap items-center gap-2">
    {data.discount_show >0 && data.discount_start && data.discount_end && (
      <div className="rounded-full text-xs py-1 px-2 text-red-500 bg-red-50 border border-red-100">
        ⏳ {useDiscountCountdown(data.discount_start, data.discount_end)}
        
      </div>
    )}

    {Boolean(data.discount_show) && data.discount_show > 0 && (
      <span className="text-xs font-medium py-1 px-2 rounded-full bg-green-100 text-green-800">
        {data.discount}% OFF
      </span>
    )}
  </div>

  {/* Product Name */}
  <h3 className="font-medium text-sm text-blue-900 lg:text-2xl line-clamp-2 leading-tight">
    {data.name}
  </h3>

  {/* Stock Information */}
  <div className="flex items-center text-sm text-gray-600">
    <span className="text-green-600 font-medium">Stock:</span>
    <span className="ml-1">{data.stock}</span>
  </div>

{/* sold ยอดขาย */}
  <div className="flex items-center text-sm text-gray-600">
    <span className="text-red-600 font-medium">Sold:</span>
    <span className="ml-1">{data.sold}</span>
  </div>

  {/* Price and CTA */}
  <div className="flex items-center justify-between mt-1">
    <div className="flex items-baseline gap-1">
      <span className="font-bold text-lg text-gray-900">
        {DisplayPriceInBath(PriceWithDiscount(data.price, data.discount_show))}
      </span>
      {data.discount_show > 0 && (
        <span className="text-xs text-gray-500 line-through">
          {DisplayPriceInBath(data.price)}
        </span>
      )}
    </div>

    <div className="flex-shrink-0">
      {data.stock == 0 ? (
        <button className="text-red-500 text-xs lg:text-sm font-medium mx-2">Out <br/>of Stock</button>
      ) : (
        <AddToCartButton data={data} />
      )}
    </div>
  </div>
</Link>
  )
}
export default CardProduct