import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiBook, FiCalendar, FiAward, FiClock, FiPlay, FiUser, FiLock } from 'react-icons/fi'
import { BsCurrencyRupee } from 'react-icons/bs'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'
import { refreshProfile } from '../../Redux/slices/authslice'

function StudentDashboard() {
    const dispatch = useDispatch()
    const { data: user } = useSelector((state) => state.auth)
    const [allCourses, setAllCourses] = useState([])
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    // ✅ Get only subscribed course IDs
    const subscribedCourses = user?.subscription?.courses?.filter(c => c.status === 'active') || []
    const subscribedCourseIds = subscribedCourses.map(c => c.courseId?.toString())

    useEffect(() => {
        async function fetchData() {
            try {
                // Refresh profile first to get latest subscription data
                await dispatch(refreshProfile())

                const [coursesRes, bookingsRes] = await Promise.all([
                    axiosInstance.get('/api/v1/course'),
                    axiosInstance.get('/api/v1/booking/student')
                ])
                setAllCourses(coursesRes.data?.courses || [])
                setBookings(bookingsRes.data?.bookings || [])
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    // ✅ Filter to show only enrolled courses
    const enrolledCourses = allCourses.filter(course =>
        subscribedCourseIds.includes(course._id?.toString())
    )

    const upcomingBookings = bookings.filter(b => b.status === 'confirmed')

    const statCards = [
        { icon: <FiBook className='text-2xl text-yellow-400' />, label: 'Enrolled Courses', value: enrolledCourses.length, bg: 'bg-yellow-400/10' },
        { icon: <FiAward className='text-2xl text-green-400' />, label: 'Certificates Earned', value: 0, bg: 'bg-green-400/10' },
        { icon: <FiCalendar className='text-2xl text-blue-400' />, label: 'Lessons Booked', value: bookings.length, bg: 'bg-blue-400/10' },
        { icon: <FiClock className='text-2xl text-purple-400' />, label: 'Hours Learned', value: '0', bg: 'bg-purple-400/10' },
    ]

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-6xl mx-auto'>

                {/* Welcome */}
                <div className='bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 mb-8 flex items-center gap-6'>
                    <img
                        src={user?.avatar?.secure_url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                        className='w-20 h-20 rounded-full border-4 border-yellow-400 object-cover'
                    />
                    <div>
                        <p className='text-slate-400'>Welcome back,</p>
                        <h1 className='text-3xl font-bold capitalize'>{user?.name}</h1>
                        <p className='text-yellow-400 text-sm mt-1'>Keep learning and growing! 🚀</p>
                        {subscribedCourses.length > 0 && (
                            <span className='text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full mt-1 inline-block'>
                                ⭐ Enrolled in {subscribedCourses.length} course{subscribedCourses.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    {statCards.map((s, i) => (
                        <div key={i} className={`${s.bg} border border-slate-700 rounded-xl p-5 flex items-center gap-4`}>
                            <div className='bg-slate-800 p-3 rounded-lg'>{s.icon}</div>
                            <div>
                                <p className='text-2xl font-bold'>{s.value}</p>
                                <p className='text-slate-400 text-sm'>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                    {/* Enrolled Courses - LEFT */}
                    <div className='lg:col-span-2'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold text-yellow-400'>My Courses</h2>
                            <Link to='/courses' className='text-sm text-slate-400 hover:text-yellow-400'>Browse More →</Link>
                        </div>

                        {loading ? (
                            <p className='text-slate-400'>Loading...</p>
                        ) : enrolledCourses.length === 0 ? (
                            <div className='bg-slate-800 rounded-xl p-8 text-center border border-slate-700'>
                                <FiLock className='text-4xl text-slate-600 mx-auto mb-3' />
                                <p className='text-slate-400 mb-2'>No courses enrolled yet</p>
                                <p className='text-slate-500 text-sm mb-4'>Enroll in a course for just ₹499</p>
                                <Link to='/courses'
                                    className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg inline-flex items-center gap-2'>
                                    <BsCurrencyRupee /> Browse Courses
                                </Link>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-4'>
                                {enrolledCourses.map((course) => (
                                    <div key={course._id} className='bg-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border border-yellow-400/30 transition-all border border-slate-700'>
                                        <img src={course?.thumbnail?.secure_url} alt={course.title}
                                            className='w-16 h-16 rounded-lg object-cover flex-shrink-0' />
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-semibold capitalize truncate'>{course.title}</h3>
                                            <p className='text-slate-400 text-sm'>{course.numberOfLectures} lectures</p>
                                            <div className='flex items-center gap-2 mt-1'>
                                                <span className='text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full'>✅ Enrolled</span>
                                                <span className='text-xs text-slate-500'>{course.category}</span>
                                            </div>
                                            <div className='w-full bg-slate-700 rounded-full h-1.5 mt-2'>
                                                <div className='bg-yellow-400 h-1.5 rounded-full' style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                        <Link to={`/course/${course.title}/${course._id}/lectures`}
                                            state={course}
                                            className='bg-yellow-500 hover:bg-yellow-600 text-black p-2.5 rounded-lg flex-shrink-0'>
                                            <FiPlay />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Not-enrolled courses hint */}
                        {!loading && enrolledCourses.length > 0 && allCourses.length > enrolledCourses.length && (
                            <div className='mt-4 bg-slate-800 border border-dashed border-slate-600 rounded-xl p-4 flex items-center justify-between'>
                                <div>
                                    <p className='text-slate-400 text-sm'>
                                        {allCourses.length - enrolledCourses.length} more course{allCourses.length - enrolledCourses.length > 1 ? 's' : ''} available
                                    </p>
                                    <p className='text-slate-500 text-xs'>Enroll for ₹499 each</p>
                                </div>
                                <Link to='/courses'
                                    className='text-yellow-400 hover:text-yellow-300 text-sm font-semibold border border-yellow-400/30 px-4 py-2 rounded-lg'>
                                    View All →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className='space-y-6'>

                        {/* Upcoming Bookings */}
                        <div>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-bold text-yellow-400'>Upcoming Lessons</h2>
                                <Link to='/my-bookings' className='text-sm text-slate-400 hover:text-yellow-400'>View All →</Link>
                            </div>
                            {upcomingBookings.length === 0 ? (
                                <div className='bg-slate-800 rounded-xl p-6 text-center border border-slate-700'>
                                    <FiCalendar className='text-3xl text-slate-600 mx-auto mb-2' />
                                    <p className='text-slate-400 text-sm mb-3'>No upcoming lessons</p>
                                    <Link to='/tutors' className='text-yellow-400 text-sm hover:underline'>Find a Tutor</Link>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-3'>
                                    {upcomingBookings.slice(0, 3).map((b) => (
                                        <div key={b._id} className='bg-slate-800 rounded-xl p-4 border border-slate-700'>
                                            <p className='font-semibold capitalize text-sm'>{b.tutorName}</p>
                                            <p className='text-yellow-400 text-xs'>{b.date} at {b.time}</p>
                                            <p className='text-slate-400 text-xs'>{b.duration}hr session</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h2 className='text-xl font-bold text-yellow-400 mb-4'>Quick Links</h2>
                            <div className='flex flex-col gap-2'>
                                {[
                                    { to: '/courses', icon: <FiBook className='text-yellow-400' />, label: 'Browse Courses' },
                                    { to: '/tutors', icon: <FiUser className='text-yellow-400' />, label: 'Find Tutors' },
                                    { to: '/my-bookings', icon: <FiCalendar className='text-yellow-400' />, label: 'My Bookings' },
                                    { to: '/certificate', icon: <FiAward className='text-yellow-400' />, label: 'My Certificate' },
                                    { to: '/profile', icon: <FiUser className='text-yellow-400' />, label: 'My Profile' },
                                ].map((link) => (
                                    <Link key={link.to} to={link.to}
                                        className='flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-all border border-slate-700'>
                                        {link.icon} {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default StudentDashboard
