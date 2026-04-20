import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiBook, FiAward } from 'react-icons/fi'
import { BsCurrencyRupee } from 'react-icons/bs'

import HomeLayout from '../../layouts/HomeLayout'
import { getAllCourse } from '../../Redux/slices/courseslice'
import CourseCard from './CourseCard'

function CourseList() {
    const dispatch = useDispatch()
    const { courseData } = useSelector((state) => state?.course)
    const { data: userData, isLoggedIn } = useSelector((state) => state?.auth)

    const isAdmin = userData?.role === 'ADMIN'
    const subscribedCourses = userData?.subscription?.courses?.filter(c => c.status === 'active') || []
    const subscribedCount = subscribedCourses.length

    useEffect(() => {
        dispatch(getAllCourse())
    }, [dispatch])

    return (
        <HomeLayout>
            <div className='flex flex-col min-h-screen pt-10 lg:px-20 px-4 gap-8'>

                <h1 className='font-bold lg:text-4xl md:text-4xl text-2xl font-serif text-white text-center'>
                    Explore all courses made by <span className='text-yellow-400'>Industry Experts</span>
                </h1>

                {/* Subscribed courses info */}
                {isLoggedIn && !isAdmin && subscribedCount > 0 && (
                    <div className='bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3'>
                        <FiAward className='text-2xl text-green-400 flex-shrink-0' />
                        <p className='text-green-400 font-semibold'>
                            ✅ You are enrolled in {subscribedCount} course{subscribedCount > 1 ? 's' : ''}!
                        </p>
                    </div>
                )}

                {/* Per-course pricing info */}
                {isLoggedIn && !isAdmin && (
                    <div className='bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className='bg-yellow-500/20 p-3 rounded-full'>
                                <FiBook className='text-2xl text-yellow-400' />
                            </div>
                            <div>
                                <h3 className='text-white font-bold text-lg'>Per Course Enrollment</h3>
                                <p className='text-slate-400 text-sm'>
                                    Each course is <span className='text-yellow-400 font-bold'>₹499</span> — pay only for what you need!
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 text-yellow-400 font-bold text-2xl'>
                            <BsCurrencyRupee />499
                            <span className='text-slate-400 text-sm font-normal'>per course</span>
                        </div>
                    </div>
                )}

                {/* Guest banner */}
                {!isLoggedIn && (
                    <div className='bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div>
                            <h3 className='text-white font-bold text-lg'>Start Learning Today</h3>
                            <p className='text-slate-400 text-sm'>Login to enroll in courses for just ₹499 each</p>
                        </div>
                        <div className='flex gap-3'>
                            <Link to='/login' className='border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold px-5 py-2.5 rounded-xl transition-all'>
                                Login
                            </Link>
                            <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-xl transition-all'>
                                Sign Up Free
                            </Link>
                        </div>
                    </div>
                )}

                {/* Course Grid */}
                <div className='flex flex-wrap mb-10 gap-10 w-full px-4 justify-center'>
                    {courseData?.map((course) => (
                        <CourseCard key={course._id} data={course} />
                    ))}
                </div>
            </div>
        </HomeLayout>
    )
}

export default CourseList
