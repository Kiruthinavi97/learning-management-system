import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { FiCheckCircle, FiBook, FiAward } from 'react-icons/fi'
import { refreshProfile } from '../../Redux/slices/authslice'
import HomeLayout from '../../layouts/HomeLayout'

function CheckoutSuccess() {
    const dispatch = useDispatch()
    const { state } = useLocation()

    useEffect(() => {
        // ✅ Refresh profile so subscription status updates immediately
        dispatch(refreshProfile())
    }, [])

    return (
        <HomeLayout>
            <div className='min-h-screen flex items-center justify-center px-4'>
                <div className='bg-slate-800 rounded-2xl p-10 max-w-md w-full text-center border border-green-500/30'>

                    {/* Success Icon */}
                    <div className='flex justify-center mb-6'>
                        <div className='bg-green-500/20 p-5 rounded-full'>
                            <FiCheckCircle className='text-6xl text-green-400' />
                        </div>
                    </div>

                    <h1 className='text-3xl font-bold text-white mb-2'>Payment Successful!</h1>
                    <p className='text-slate-400 mb-6'>
                        Welcome to <span className='text-yellow-400 font-semibold'>LearnSphere Pro!</span> You now have full access to all courses.
                    </p>

                    {/* Course info */}
                    {state?.title && (
                        <div className='bg-slate-700 rounded-xl p-4 mb-6 text-left'>
                            <p className='text-slate-400 text-xs uppercase tracking-wider mb-1'>Subscribed Course</p>
                            <p className='text-white font-semibold capitalize'>{state.title}</p>
                        </div>
                    )}

                    {/* Benefits */}
                    <div className='flex flex-col gap-3 mb-8 text-left'>
                        {[
                            '✅ Access to all courses unlocked',
                            '✅ Watch video lectures anytime',
                            '✅ Get course completion certificates',
                            '✅ Book lessons with expert tutors',
                        ].map((benefit, i) => (
                            <p key={i} className='text-slate-300 text-sm'>{benefit}</p>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className='flex flex-col gap-3'>
                        <Link to='/courses'
                            className='flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all'>
                            <FiBook /> Start Learning Now
                        </Link>
                        <Link to='/certificate'
                            className='flex items-center justify-center gap-2 border border-slate-600 text-slate-300 hover:bg-slate-700 py-3 rounded-xl transition-all'>
                            <FiAward /> View My Certificate
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CheckoutSuccess
