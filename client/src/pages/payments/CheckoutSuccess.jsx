import Lottie from "lottie-react";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'

import animationData from '../../lotties/payment-successful.json'
import { getProfile } from '../../Redux/slices/authslice';


function CheckoutSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }

    document.title = "Checkout success - Learning Management System";

    // ✅ Async function inside useEffect (ESLint-safe)
    const fetchProfile = async () => {
      try {
        // Dispatch returns a promise if getProfile is a createAsyncThunk
        const resultAction = await dispatch(getProfile());

        // Optional: handle success/failure
        if (getProfile.fulfilled.match(resultAction)) {
          console.log("Profile fetched successfully");
        } else if (getProfile.rejected.match(resultAction)) {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [state, navigate, dispatch]);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="lg:w-1/3 w-11/12 m-auto bg-white rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center pb-4">
        <Lottie animationData={animationData} loop height={300} width={300} />
        <p className="px-4 text-xl tracking-wider text-slate-500 text-center">
          Congratulations! Welcome to the course
        </p>
        <Link className="btn btn-primary w-[90%]" to="/">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
