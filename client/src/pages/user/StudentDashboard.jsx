import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiBook, FiCalendar, FiAward, FiClock, FiPlay, FiUser } from 'react-icons/fi'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function StudentDashboard() {
    const { data: user } = useSelector((state) => state.auth)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [bookings, setBookings] = useState([])
    const [stats, setStats] = useState({ enrolled: 0, completed: 0, bookings: 0, certificates: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [coursesRes, bookingsRes] = await Promise.all([
                    axiosInstance.get('/api/v1/course'),
                    axiosInstance.get('/api/v1/booking/student')
                ])
                const courses = coursesRes.data?.courses || []
                const userBookings = bookingsRes.data?.bookings || []
                setEnrolledCourses(courses)
                setBookings(userBookings)
                setStats({
                    enrolled: courses.length,
                    completed: 0,
                    bookings: userBookings.length,
                    certificates: 0
                })
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const statCards = [
        { icon: <FiBook className='text-2xl text-yellow-400' />, label: 'Enrolled Courses', value: stats.enrolled, bg: 'bg-yellow-400/10' },
        { icon: <FiAward className='text-2xl text-green-400' />, label: 'Certificates Earned', value: stats.certificates, bg: 'bg-green-400/10' },
        { icon: <FiCalendar className='text-2xl text-blue-400' />, label: 'Lessons Booked', value: stats.bookings, bg: 'bg-blue-400/10' },
        { icon: <FiClock className='text-2xl text-purple-400' />, label: 'Hours Learned', value: '0', bg: 'bg-purple-400/10' },
    ]

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-6xl mx-auto'>

                {/* Welcome Header */}
                <div className='bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 mb-8 flex items-center gap-6'>
                    <img
                        src={user?.avatar?.secure_url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                        className='w-20 h-20 rounded-full border-4 border-yellow-400 object-cover'
                    />
                    <div>
                        <p className='text-slate-400'>Welcome back,</p>
                        <h1 className='text-3xl font-bold capitalize'>{user?.name}</h1>
                        <p className='text-yellow-400 text-sm mt-1'>Keep learning and growing! 🚀</p>
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

                    {/* Enrolled Courses */}
                    <div className='lg:col-span-2'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold text-yellow-400'>My Courses</h2>
                            <Link to='/courses' className='text-sm text-slate-400 hover:text-yellow-400'>Browse More →</Link>
                        </div>
                        {loading ? (
                            <p className='text-slate-400'>Loading...</p>
                        ) : enrolledCourses.length === 0 ? (
                            <div className='bg-slate-800 rounded-xl p-8 text-center'>
                                <FiBook className='text-4xl text-slate-600 mx-auto mb-3' />
                                <p className='text-slate-400 mb-4'>No courses enrolled yet</p>
                                <Link to='/courses' className='bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg'>
                                    Explore Courses
                                </Link>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-4'>
                                {enrolledCourses.slice(0, 4).map((course) => (
                                    <div key={course._id} className='bg-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border border-yellow-400/30 transition-all'>
                                        <img src={course?.thumbnail?.secure_url} alt={course.title}
                                            className='w-16 h-16 rounded-lg object-cover' />
                                        <div className='flex-1'>
                                            <h3 className='font-semibold capitalize'>{course.title}</h3>
                                            <p className='text-slate-400 text-sm'>{course.numberOfLectures} lectures</p>
                                            <div className='w-full bg-slate-700 rounded-full h-1.5 mt-2'>
                                                <div className='bg-yellow-400 h-1.5 rounded-full' style={{ width: '0%' }}></div>
                                            </div>
                                        </div>
                                        <Link to={`/course/${course.title}/${course._id}/lectures`}
                                            className='bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded-lg'>
                                            <FiPlay />
                                        </Link>
                                    </div>
                                ))}
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
                            {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                                <div className='bg-slate-800 rounded-xl p-6 text-center'>
                                    <FiCalendar className='text-3xl text-slate-600 mx-auto mb-2' />
                                    <p className='text-slate-400 text-sm mb-3'>No upcoming lessons</p>
                                    <Link to='/tutors' className='text-yellow-400 text-sm hover:underline'>Find a Tutor</Link>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-3'>
                                    {bookings.filter(b => b.status === 'confirmed').slice(0, 3).map((b) => (
                                        <div key={b._id} className='bg-slate-800 rounded-xl p-4'>
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
                                <Link to='/courses' className='flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-all'>
                                    <FiBook className='text-yellow-400' /> Browse Courses
                                </Link>
                                <Link to='/tutors' className='flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-all'>
                                    <FiUser className='text-yellow-400' /> Find Tutors
                                </Link>
                                <Link to='/my-bookings' className='flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-all'>
                                    <FiCalendar className='text-yellow-400' /> My Bookings
                                </Link>
                                <Link to='/profile' className='flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg transition-all'>
                                    <FiUser className='text-yellow-400' /> My Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default StudentDashboard