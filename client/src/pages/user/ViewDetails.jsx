import { PriceWithDiscount } from "../../utils/PriceWithDiscount";

const ViewDetails = ({ data, close }) => {

  return (
    <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal content */}
      <div className="bg-white rounded-lg p-6 w-full max-w-lg my-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <button
            onClick={close}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          {/* Order Summary */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Summary</h2>
            <p><strong>Order ID:</strong> {data.id}</p>
            <p><strong>Date:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className="text-blue-600">{data.payment_status}</span></p>
          </div>

          {/* Product List */}
          <h3 className="text-lg font-medium text-gray-700 mb-3">Products</h3>
          <div className="space-y-4">
            {data?.productOnOrder?.map((item) => {
              return (
                 <div key={item.product.id} className="flex items-center gap-4 p-3 border rounded-md">
                <img
                  src={item.product.image?.[0]?.productimage || "/fallback-image.jpg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <p><span className="font-medium text-gray-900">Name:</span> {item.product.name}</p>
                  <p><span className="text-green-600 font-medium">Price:</span> ฿{item.priceAtOrder}</p>
                  {item.discount>0 && 
                    <p><span className="text-red-700 font-medium">Discount:</span>{item.discount}%</p>
                  }
                  <p><span className="text-blue-500 font-medium">Total:</span> ฿{item.discountAtOrder}</p>
                  <p><span className="text-gray-700">Quantity:</span> {item.quantity}</p>
                  <p><span className="text-red-500 font-medium">All Total:</span> ฿{item.discountAtOrder*item.quantity}</p>
                </div>
              </div>
              )
            }
             
            )}
          </div>

          {/* Total Amount */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-lg font-semibold text-gray-800">Total Amount: <span className="text-red-600">฿{data.totalAmt.toLocaleString()}</span></p>
          </div>
        </div>

        <button
          onClick={close}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </section >
  );
};

export default ViewDetails;