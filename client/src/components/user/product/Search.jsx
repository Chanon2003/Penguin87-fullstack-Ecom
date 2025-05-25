import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../../../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [isMobile] = useMobile()
  const params = useLocation()
  const searchText = params.search.slice(3)

  useEffect(() => {
    const isSearch = location.pathname === '/search'
    setIsSearchPage(isSearch)
  }, [location])

  const redirectToSearchPage = () => {
    navigate('/search')
  }

  const handleOnChange = (e)=>{
    const value = e.target.value
    const url = `/search?q=${value}`
    navigate(url)
  }

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 ">
      <div>
       
        {
          (isMobile && isSearchPage) ? (
            <button>
              <FaArrowLeft onClick={()=>navigate('/')} size={40} className="flex justify-center items-center h-full p-2 m-1 text-neutral-600 group-focus-within:text-primary-200 bg-white rounded-full shadow-md" />
            </button>
          ) : (
            <button className="flex justify-center items-center h-full p-3 text-neutral-600 group-focus-within:text-primary-200">
            <CiSearch size={22} />
          </button>
          )
      }

      </div>
      <div className="w-full h-full">
        {
          !isSearchPage ? (
            <div onClick={redirectToSearchPage} className="w-full h-full flex items-center">
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'Search Genshin?',
                  1000, // wait 1s before replacing "Mice" with "Hamsters"
                  'Search Honkai Starail',
                  1000,
                  'Search Zenless Zone zero',
                  1000,
                  'Search Rezero',
                  1000,
                  'One punchman?',
                  1000,
                  'Search Frirence',
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <input type="text"
                placeholder="Search for items and more."
                className="bg-transparent w-full h-full outline-none"
                autoFocus
                defaultValue={searchText}
                onChange={handleOnChange}
                name="" id="" />
            </div>
          )
        }
      </div>

    </div>
  )
}
export default Search