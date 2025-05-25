import { useEffect, useState } from 'react'
import './App.css'
import { data, Outlet, useLocation } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import  { Toaster } from 'react-hot-toast'
import fetchUserDetails from './utils/fetchUserDetails.js'
import { useDispatch } from 'react-redux'
import { setUserDetails } from './store/userSlice.js'
import Axios from './utils/Axios.js'
import SummaryApi from './common/SummaryApi.js'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice.js'
import GlobalProvider from './provider/GlobalProvider.jsx'
import CartMobile from './components/user/cart/CartMobile.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import AxiosToastError from './utils/AxiosToastError.js'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const res = await Axios({
        ...SummaryApi.getCategory
      })

      const { data: responseData } = res
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {

      const res = await Axios({
        ...SummaryApi.getSubCategory
      })

      const { data: responseData } = res
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
    }
  }


  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData?.data))
  }



  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  }, [])

  
  return (
    <GlobalProvider>
      <ScrollToTop /> 
      <Header />
      <main className='min-h-[740px]'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {
        location.pathname !== '/checkout' && location.pathname !== '/payment' && (
          <CartMobile />
        )
      }
        
    </GlobalProvider>
  )
}

export default App
