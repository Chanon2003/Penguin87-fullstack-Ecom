import { useEffect, useState } from "react"
import CardLoding from "../../components/user/cart/CardLoding"
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import InfiniteScroll from 'react-infinite-scroll-component'
import CardProduct from '../../components/user/cart/CardProduct'
import { useLocation } from "react-router-dom";
import noImageData from '../../assets/product/rezero/family/ram/3.jpg';

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  // const fetchData = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await Axios({
  //       ...SummaryApi.searchProduct,
  //       data: {
  //         search: searchText,
  //         page: page,
  //       }
  //     })
  //     const { data: responseData } = response
  //     if (responseData.success) {
  //       if (responseData.page == 1) {
  //         setData(responseData.data)
  //       } else {
  //         setData((prev) => ([...prev, ...responseData.data]))
  //       }
  //       setTotalPage(responseData.totalPage)
  //     }
  //   } catch (error) {
  //     AxiosToastError(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        }
      });
  
      const { data: responseData } = response;
      if (responseData.success) {
        const newData = Array.isArray(responseData.data) ? responseData.data : [];
  
        if (responseData.page === 1) {
          setData(newData);
        } else {
          setData((prev) => [...prev, ...newData]); // ✅ fix ตรงนี้
        }
  
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(p => p + 1)
    }
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length}</p>

        <InfiniteScroll dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 py-4 gap-4">

            {Array.isArray(data) && data.map((p, index) => (
              <CardProduct data={p} key={index} />
            ))}


            {/* loading data */}
            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoding key={"loadingSearchPage" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>
        {
          //no data
          !data[0] && !loading && (
            <div className="flex flex-col justify-center items-center w-fit mx-auto">
              <img src={noImageData} className="w-full h-full max-w-xs max-h-xs block" />
              <p className="font-semibold my-2">No Data found</p>
            </div>
          )
        }
      </div>

    </section>
  )
}
export default SearchPage