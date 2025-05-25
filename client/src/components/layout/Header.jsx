import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/penguin.jpg'
import Search from '../user/product/Search'
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from '../../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { useState } from 'react';
import UserMenu from '../user/menu/UserMenu';
import { DisplayPriceInBath } from '../../utils/DisplayPriceinBath';
import { useGlobalContext } from '../../provider/GlobalProvider';
import DisplayCartItem from '../user/cart/DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()

  const isSearchPage = location.pathname === '/search'
  const navigate = useNavigate()
  const cartItem = useSelector(s => s.cartItem.cart)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const { totalPrice, totalQty } = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false)
  
  const user = useSelector((s) => s?.user)


  const redirectToLoginPage = () => {
    navigate('/login')
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  const handleMobileUser = () => {
    if (!user.id) {
      return navigate('/login')
    }
    return navigate('/user')
  }

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-50 flex flex-col justify-center gap-1 bg-white'>
      {
        !((isSearchPage && isMobile)) && (
          <div className='container mx-auto flex items-center px-2 justify-between'>
            {/* logo */}
            <div className='h-full'>
              <Link to={'/'} className='h-full flex justify-center items-center '>
                <img src={logo}
                  alt="logo"
                  width={80}
                  height={50}
                  className='hidden lg:block rounded-full' />
                <img src={logo}
                  alt="logo"
                  width={60}
                  height={50}
                  className='lg:hidden rounded-full' />
              </Link>
            </div>

            {/* Search */}
            <div className='hidden lg:block'>
              <Search />
            </div>

            {/* login and my cart */}
            <div className=''>
              {/* user icon display in only movile version */}
              <button className='text-neutral-600 lg:hidden'
                onClick={handleMobileUser}
              >
                {
                  user.id ? (
                    user.avatar ? (
                      <img src={user.avatar} className="rounded-full w-[30px] h-[30px] object-cover" />
                    ) : (
                      <div className='rounded-full w-[30px] h-[30px] object-cover border bg-primary-200 text-black border-black flex items-center justify-center cursor-pointer'>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      
                    )

                  ) : (
                    <FaRegUserCircle size={30} />
                  )
                }


              </button>
              {/* Desktop */}
              <div className='hidden lg:flex items-center gap-10'>
                {
                  user?.id ? (

                    <div className='relative'>
                      <div onClick={() => setOpenUserMenu(p => !p)} className='flex select-none items-center gap-2 cursor-pointer'>
                        <p>Account</p>
                        {
                          openUserMenu ? (
                            <GoTriangleUp size={25} />
                          ) : (
                            <GoTriangleDown size={25} />
                          )
                        }
                      </div>

                      {
                        openUserMenu && (
                          <div className='absolute right-0 top-10 z-50'>
                            <div className=' rounded p-4 min-w-52 lg:shadow-lg bg-white'>
                              <UserMenu close={handleCloseUserMenu} />
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ) : (
                    <button onClick={redirectToLoginPage} className='text-lg px-2' >Login</button>
                  )
                }

                <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-2 bg-secondary-200 hover:bg-green-700 px-3 py-2 rounded text-white'>
                  {/* add to cart */}
                  <div className='animate-bounce'>
                    <BsCart4 size={26} />
                  </div>

                  <div className='font-semibold text-sm'>
                    {
                      cartItem[0] ? (
                        <div>
                          <p>{totalQty} Items</p>
                          <p>{DisplayPriceInBath(totalPrice)}</p>
                        </div>
                      ) : (
                        <p>My cart</p>
                      )
                    }

                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      }

      <div className='container mx-auto px-2 lg:hidden'>
        <Search />
      </div>

      {
        openCartSection && (
          <DisplayCartItem close={() => setOpenCartSection(false)} />
        )
      }

    </header>
  )
}
export default Header