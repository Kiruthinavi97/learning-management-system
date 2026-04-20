import { useEffect, useState, useCallback } from 'react';
import { BsCurrencyRupee } from 'react-icons/bs';
import { FiCheckCircle, FiBook, FiAward, FiUsers } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import HomeLayout from '../../layouts/HomeLayout'
import { getRazorpayKey, purchaseCourseBundle, verifyUserPayment } from '../../Redux/slices/razorpayslice';
import { refreshProfile } from '../../Redux/slices/authslice';

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const razorpay = useSelector((state) => state.razorpay);
    const userdata = useSelector((state) => state.auth?.data);
    const [loading, setLoading] = useState(false);

    const onLoad = useCallback(async () => {
        try {
            await dispatch(getRazorpayKey());
            // Pass courseId and courseTitle for per-course payment
            await dispatch(purchaseCourseBundle({
                courseId: state?._id,
                courseTitle: state?.title
            }));
        } catch (error) {
            toast.error('Failed to initialize payment. Please try again.');
        }
    }, [dispatch, state]);

    useEffect(() => {
        if (!state) {
            navigate('/courses');
        } else {
            onLoad();
        }
    }, [state, navigate, onLoad]);

    async function handleSubscription() {
        if (!window.Razorpay) {
            toast.error('Payment gateway failed to load. Please refresh.');
            return;
        }

        if (!razorpay.key || !razorpay.subscription_id) {
            toast.error('Something went wrong! Please try again.');
            return;
        }

        setLoading(true);

        const options = {
            key: razorpay.key,
            amount: 49900, // ₹499 in paise
            currency: 'INR',
            order_id: razorpay.subscription_id,
            name: 'LearnSphere',
            description: `Course: ${state?.title}`,
            theme: { color: '#EAB308' },
            prefill: { email: userdata?.email, name: userdata?.name },
            handler: async function (response) {
                const paymentDetails = {
                    payment_id: response.razorpay_payment_id,
                    subscription_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    courseId: state?._id,
                    courseTitle: state?.title
                };

                try {
                    const res = await dispatch(verifyUserPayment(paymentDetails));
                    if (res?.payload?.success) {
                        // ✅ Refresh profile to update subscription status
                        await dispatch(refreshProfile())
                        navigate(`/course/${state?.title}/checkout/success`, { state });
                    } else {
                        navigate(`/course/${state?.title}/checkout/fail`, { state });
                    }
                } catch (err) {
                    toast.error('Payment verification failed.');
                } finally {
                    setLoading(false);
                }
            },
            modal: {
                ondismiss: () => setLoading(false)
            }
        };

        const paymentObj = new window.Razorpay(options);
        paymentObj.open();
    }

    return (
        <HomeLayout>
            <div className='min-h-screen flex items-center justify-center px-4 py-10'>
                <div className='bg-slate-800 rounded-2xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-700'>

                    {/* Header */}
                    <div className='bg-yellow-500 p-6 text-black text-center'>
                        <h1 className='text-2xl font-bold mb-1'>Course Enrollment</h1>
                        <p className='text-black/70 text-sm'>One-time payment per course</p>
                    </div>

                    <div className='p-6 flex flex-col gap-5'>

                        {/* Course Info */}
                        {state?.thumbnail?.secure_url && (
                            <img src={state.thumbnail.secure_url} alt={state.title}
                                className='w-full h-40 object-cover rounded-xl' />
                        )}

                        <div>
                            <h2 className='text-white font-bold text-xl capitalize mb-1'>{state?.title}</h2>
                            <p className='text-slate-400 text-sm'>By {state?.createdBy} • {state?.numberOfLectures} lectures</p>
                        </div>

                        {/* Benefits */}
                        <div className='bg-slate-700/50 rounded-xl p-4 flex flex-col gap-2'>
                            {[
                                'Lifetime access to this course',
                                'Watch all video lectures',
                                'Course completion certificate',
                                'Access on all devices',
                            ].map((b, i) => (
                                <div key={i} className='flex items-center gap-2 text-sm text-slate-300'>
                                    <FiCheckCircle className='text-green-400 flex-shrink-0' /> {b}
                                </div>
                            ))}
                        </div>

                        {/* Price */}
                        <div className='flex items-center justify-between bg-slate-700 rounded-xl px-5 py-4'>
                            <span className='text-slate-400 font-medium'>Course Price</span>
                            <span className='text-green-400 font-bold text-2xl flex items-center gap-1'>
                                <BsCurrencyRupee />499
                            </span>
                        </div>

                        <p className='text-slate-500 text-xs text-center'>
                            100% refund on cancellation within 14 days
                        </p>

                        <button
                            className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl text-lg transition-all disabled:opacity-50'
                            onClick={handleSubscription}
                            disabled={loading}>
                            {loading ? 'Processing...' : 'Enroll Now — ₹499'}
                        </button>

                        <p className='text-slate-500 text-xs text-center flex items-center justify-center gap-1'>
                            🔒 Secured by Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Checkout;
