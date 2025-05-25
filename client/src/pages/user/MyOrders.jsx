import { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "../../components/common/Loading";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import ViewDetails from "./ViewDetails";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortDate, setSortDate] = useState("desc");
  const [sortPrice, setSortPrice] = useState("desc");

  const [openEdit, setOpenEdit] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getOrder,
        data: {
          page: page, // ส่งค่า page ไปที่ API
          limit: 10,
          sortDate: sortDate,
          sortPrice: sortPrice,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage); // อัปเดตจำนวนหน้าทั้งหมด
        setOrders(responseData.data || []); // เก็บข้อมูลคำสั่งซื้อ
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [page, sortDate]);

  const handleNext = () => {
    if (page < totalPageCount) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSortDate = () => {
    setSortDate((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPageCount); // ไปที่หน้าท้ายสุด
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">My Orders</h2>
  
      {loading && <Loading />}
  
      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 md:px-3 md:py-3 text-left text-sm md:text-base border-b">Order ID</th>
              <th className="px-2 py-2 md:px-3 md:py-3 text-left text-sm md:text-base border-b hidden sm:table-cell">
                <div className="flex items-center">
                  Date
                  <button onClick={handleSortDate} className="ml-1">
                    {sortDate === "asc" ? (
                      <GoTriangleUp size={16} className="md:size-[20px]" />
                    ) : (
                      <GoTriangleDown size={16} className="md:size-[20px]" />
                    )}
                  </button>
                </div>
              </th>
              <th className="px-2 py-2 md:px-3 md:py-3 text-left text-sm md:text-base border-b hidden md:table-cell">
                Total Price
              </th>
              <th className="px-2 py-2 md:px-3 md:py-3 text-left text-sm md:text-base border-b hidden md:table-cell">
                Status
              </th>
              <th className="px-2 py-2 md:px-3 md:py-3 text-left text-sm md:text-base border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 py-2 md:px-3 md:py-3 border-b text-sm md:text-base whitespace-nowrap">
                    ORD-{order.id.slice(0, 8)}
                  </td>
                  <td className="px-2 py-2 md:px-3 md:py-3 border-b text-sm md:text-base hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 md:px-3 md:py-3 border-b text-sm md:text-base text-green-600 font-semibold hidden md:table-cell">
                    ฿{order.totalAmt.toLocaleString()}
                  </td>
                  <td
                    className={`px-2 py-2 md:px-3 md:py-3 border-b text-sm md:text-base font-medium hidden md:table-cell ${
                      order.payment_status === "Delivered"
                        ? "text-green-600"
                        : order.payment_status === "Processing"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.payment_status}
                  </td>
                  <td className="px-2 py-2 md:px-3 md:py-3 border-b">
                    <button
                      onClick={() => setOpenEdit(order.id)}
                      className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                  </td>
  
                  {openEdit === order.id && (
                    <ViewDetails data={order} close={() => setOpenEdit(null)} />
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleFirstPage}
            className="border border-primary-200 px-3 py-1 md:px-4 md:py-2 text-xs md:text-base hover:bg-primary-200 disabled:opacity-50"
            disabled={page === 1}
          >
            First
          </button>
          <button
            onClick={handlePrevious}
            className="border border-primary-200 px-3 py-1 md:px-4 md:py-2 text-xs md:text-base hover:bg-primary-200 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
        </div>
  
        <span className="text-center py-1 px-3 md:py-2 md:px-4 border border-primary-200 bg-slate-100 text-xs md:text-base">
          {page}/{totalPageCount}
        </span>
  
        <div className="flex gap-2">
          <button
            onClick={handleNext}
            className="border border-primary-200 px-3 py-1 md:px-4 md:py-2 text-xs md:text-base hover:bg-primary-200 disabled:opacity-50"
            disabled={page === totalPageCount}
          >
            Next
          </button>
          <button
            onClick={handleLastPage}
            className="border border-primary-200 px-3 py-1 md:px-4 md:py-2 text-xs md:text-base hover:bg-primary-200 disabled:opacity-50"
            disabled={page === totalPageCount}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default MyOrders;
