import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FiCalendar, FiClock, FiCheck, FiX, FiVideo } from 'react-icons/fi'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function TutorBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [meetingLink, setMeetingLink] = useState({})

    async function fetchBookings() {
        try {
            const res = await axiosInstance.get('/api/v1/booking/tutor')
            setBookings(res.data.bookings || [])
        } catch {
            toast.error('Failed to load bookings')
        }
        setLoading(false)
    }

    async function updateStatus(id, status) {
        try {
            await axiosInstance.put(`/api/v1/booking/${id}/status`, {
                status,
                meetingLink: meetingLink[id] || ''
            })
            toast.success(`Booking ${status}!`)
            fetchBookings()
        } catch {
            toast.error('Failed to update booking')
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
                <h1 className='text-3xl font-bold text-yellow-400 mb-2'>Manage Bookings</h1>
                <p className='text-slate-400 mb-8'>Review and manage student lesson requests</p>

                {loading ? (
                    <p className='text-slate-400 text-center py-20'>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p className='text-slate-400 text-center py-20'>No bookings yet.</p>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {bookings.map((booking) => (
                            <div key={booking._id} className='bg-slate-800 rounded-xl p-6'>
                                <div className='flex flex-col md:flex-row justify-between gap-4'>
                                    <div>
                                        <h3 className='font-semibold capitalize text-lg'>{booking.studentName}</h3>
                                        <p className='text-slate-400 text-sm'>{booking.studentEmail}</p>
                                        <div className='flex flex-wrap gap-3 mt-2 text-sm text-slate-400'>
                                            <span className='flex items-center gap-1'><FiCalendar />{booking.date}</span>
                                            <span className='flex items-center gap-1'><FiClock />{booking.time} ({booking.duration}hr)</span>
                                            <span className='text-green-400 font-medium'>₹{booking.amount}</span>
                                        </div>
                                        {booking.notes && <p className='text-slate-500 text-sm mt-1'>Note: {booking.notes}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2 items-end'>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions for pending bookings */}
                                {booking.status === 'pending' && (
                                    <div className='mt-4 pt-4 border-t border-slate-700 flex flex-col md:flex-row gap-3'>
                                        <input
                                            type='text'
                                            placeholder='Add meeting link (Google Meet / Zoom)...'
                                            className='flex-1 bg-slate-700 px-4 py-2 rounded-lg text-white outline-none text-sm'
                                            value={meetingLink[booking._id] || ''}
                                            onChange={(e) => setMeetingLink({ ...meetingLink, [booking._id]: e.target.value })}
                                        />
                                        <button onClick={() => updateStatus(booking._id, 'confirmed')}
                                            className='flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm'>
                                            <FiCheck /> Confirm
                                        </button>
                                        <button onClick={() => updateStatus(booking._id, 'cancelled')}
                                            className='flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm'>
                                            <FiX /> Decline
                                        </button>
                                    </div>
                                )}

                                {/* Mark as completed */}
                                {booking.status === 'confirmed' && (
                                    <div className='mt-4 pt-4 border-t border-slate-700 flex gap-3'>
                                        {booking.meetingLink && (
                                            <a href={booking.meetingLink} target='_blank' rel='noreferrer'
                                                className='flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm'>
                                                <FiVideo /> Open Meeting
                                            </a>
                                        )}
                                        <button onClick={() => updateStatus(booking._id, 'completed')}
                                            className='flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm'>
                                            <FiCheck /> Mark Completed
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HomeLayout>
    )
}

export default TutorBookings
