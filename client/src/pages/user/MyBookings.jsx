import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiCalendar, FiClock, FiDollarSign, FiX, FiVideo } from 'react-icons/fi'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchBookings() {
        try {
            const res = await axiosInstance.get('/api/v1/booking/student')
            setBookings(res.data.bookings || [])
        } catch {
            toast.error('Failed to load bookings')
        }
        setLoading(false)
    }

    async function cancelBooking(id) {
        try {
            await axiosInstance.put(`/api/v1/booking/${id}/cancel`)
            toast.success('Booking cancelled')
            fetchBookings()
        } catch {
            toast.error('Failed to cancel booking')
        }
    }

    useEffect(() => { fetchBookings() }, [])

    const statusColor = {
        pending: 'text-yellow-400 bg-yellow-400/10',
        confirmed: 'text-green-400 bg-green-400/10',
        cancelled: 'text-red-400 bg-red-400/10',
        completed: 'text-blue-400 bg-blue-400/10'
    }

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-5xl mx-auto'>
                <h1 className='text-3xl font-bold text-yellow-400 mb-2'>My Bookings</h1>
                <p className='text-slate-400 mb-8'>Manage your scheduled lessons</p>

                {loading ? (
                    <p className='text-slate-400 text-center py-20'>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className='text-center py-20'>
                        <p className='text-slate-400 mb-4'>No bookings yet.</p>
                        <Link to='/tutors' className='bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg'>
                            Find a Tutor
                        </Link>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {bookings.map((booking) => (
                            <div key={booking._id} className='bg-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4'>
                                <div className='flex items-center gap-4'>
                                    <img src={booking.tutor?.avatar?.secure_url ||
                                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                                        className='w-14 h-14 rounded-full object-cover border-2 border-yellow-400' />
                                    <div>
                                        <h3 className='font-semibold capitalize text-lg'>{booking.tutorName}</h3>
                                        <p className='text-yellow-400 text-sm'>{booking.tutor?.subject}</p>
                                        <div className='flex flex-wrap gap-3 mt-1 text-sm text-slate-400'>
                                            <span className='flex items-center gap-1'><FiCalendar />{booking.date}</span>
                                            <span className='flex items-center gap-1'><FiClock />{booking.time} ({booking.duration}hr)</span>
                                            <span className='flex items-center gap-1'><FiDollarSign />₹{booking.amount}</span>
                                        </div>
                                        {booking.notes && <p className='text-slate-500 text-sm mt-1'>Note: {booking.notes}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 items-end justify-center'>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor[booking.status]}`}>
                                        {booking.status}
                                    </span>
                                    {booking.status === 'confirmed' && booking.meetingLink && (
                                        <a href={booking.meetingLink} target='_blank' rel='noreferrer'
                                            className='flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm'>
                                            <FiVideo /> Join Meeting
                                        </a>
                                    )}
                                    {booking.status === 'pending' && (
                                        <button onClick={() => cancelBooking(booking._id)}
                                            className='flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm'>
                                            <FiX /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HomeLayout>
    )
}

export default MyBookings
