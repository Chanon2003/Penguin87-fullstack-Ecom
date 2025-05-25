import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import AxiosToastError from "../../../utils/AxiosToastError";
import CheckoutForm from "../../../components/user/payment/CheckoutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation()
  const data = location.state.data
  const [isProcessing, setIsProcessing] = useState(false);  // ป้องกันการคลิกซ้ำ
  
  const fetchClientSecret = async () => {
    try {
      if (isProcessing) return;
      setIsProcessing(true);
      const response = await Axios({ ...SummaryApi.payment,
        data: { list_items: data.list_items,addressId:data.addressId },
      });
      return response
    } catch (error) {
      AxiosToastError(error);
    }finally{
      setIsProcessing(false)
    }
  };

  useEffect(() => {
    fetchClientSecret()
    .then((res)=>{
      setClientSecret(res.data.clientSecret)
    })
    .catch((err)=>{
      console.log(err)
    })
  }, []);

  useEffect(() => {
    if (!location.state?.data) {
      navigate("/cart");  // เปลี่ยนไปหน้า cart หรือหน้าอื่น
    }
  }, [location.state]);

  const appearance = {
    theme: 'stripe',
  }

  const loader = 'auto'

  return (
    <div>
      {
        clientSecret && (
          <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
            <CheckoutForm  data={data}/>
          </Elements>
        )
      }
    </div>
  )
}
export default Payment