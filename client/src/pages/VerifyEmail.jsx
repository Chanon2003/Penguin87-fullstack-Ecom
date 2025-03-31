import { useEffect, useState } from "react"
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import toast from 'react-hot-toast'
import Axios  from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { useRef } from "react";


const VerifyEmail = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const validValue = data.every((el) => el);
  const inputRef = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/login");
    }

    // 🎯 โฟกัสไปที่ช่องแรกหลังจากโหลดหน้า
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Axios({
        ...SummaryApi.verifyEmailOtp,
        data:{
          otp: data.join(""),
          email: location?.state?.email,
        }
      });
      console.log('ress1',res)
      
      if (res.data.error) {
        toast.error(res.data.message);
      }
      if (res.data.success) {
        toast.success(res.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
    <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
      <p className="font-semibold text-lg">Enter OTP:</p>
      <form action="" className="grid gap-4 mt-6" onSubmit={handleSubmit}>
        <div className="grid gap-1">
          <label htmlFor="otp">Enter Your OTP TO Verify Email:</label>
          <div className="flex items-center gap-2 justify-between mt-3">
            {data.map((_, index) => (
              <input
                key={"otp" + index}
                ref={(ref) => (inputRef.current[index] = ref)}
                value={data[index]}
                onChange={(e) => {
                  const value = e.target.value;
                  const newData = [...data];
                  newData[index] = value;
                  setData(newData);

                  if (value && index < 5) {
                    inputRef.current[index + 1]?.focus();
                  }
                }}
                maxLength={1}
                className="bg-blue-50 w-full p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold"
                id="otp"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!validValue}
          className={`${
            validValue
              ? "bg-green-600 hover:bg-green-500 text-white py-2 rounded font-semibold my-2 tracking-wide"
              : "bg-gray-500 text-white py-2 rounded font-semibold my-2 tracking-wide"
          }`}
        >
          Verify OTP
        </button>
      </form>
      <p>
        Goback to Login{" "}
        <Link
          to={"/login"}
          className="font-semibold text-green-500 hover:text-green-600"
        >
          Login
        </Link>
      </p>
    </div>
  </section>
  );
};

export default VerifyEmail