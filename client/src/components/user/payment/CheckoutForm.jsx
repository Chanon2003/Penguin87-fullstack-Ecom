import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import { redirect, useNavigate } from "react-router-dom";
import AxiosToastError from "../../../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../../provider/GlobalProvider";
import { DisplayPriceInBath } from "../../../utils/DisplayPriceinBath";

export default function CheckoutForm({data}) {

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()
  const {fetchCartItem} = useGlobalContext()

  const handleSubmit = async (e) => {
    if(isLoading)return;
    e.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    
    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
    
      const confirmPayment = window.confirm(`คุณต้องการทำการชำระเงินหรือไม่? ราคา ${DisplayPriceInBath(data.totalAmt)}`);
      if(confirmPayment){
        setIsLoading(true)
        try {
          const response = await Axios({
            ...SummaryApi.payment1,
            data: { list_items: data.list_items,addressId:data.addressId, payment: paymentIntent,totalAmt:data.totalAmt }, // ส่งข้อมูลให้ชัดเจน
          });
          if(response.error){
            return AxiosToastError(response.error)
          }
          
          fetchCartItem()        
          navigate('/')
          toast.success('Payment Success')
        } catch (err) {
          console.error("❌ Order processing failed:", err);
          AxiosToastError(err);
        }finally{
         setIsLoading(false);
        }
      }else{
        setMessage("การชำระเงินถูกยกเลิก.");
      }
      
    } else {
      console.warn("⚠️ Payment not confirmed yet:", paymentIntent);
    }
    
    
   
  };
  
  const paymentElementOptions = {
    layout: "accordion"
  }

  return (
    <div className="container mx-auto mt-10">
      <form id="payment-form" onSubmit={handleSubmit}>

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button className="flex border mx-auto gap-4 max-w-[600px] w-full justify-center  items-center my-10 rounded-md bg-primary-100 p-4 font-semibold text-2xl border-black hover:bg-primary-200 hover:text-black" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
    </div>
    
  );
}