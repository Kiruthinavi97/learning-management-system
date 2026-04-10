import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FiStar, FiDollarSign, FiBook, FiClock, FiCalendar } from 'react-icons/fi'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function TutorProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn)
    const [tutor, setTutor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [review, setReview] = useState({ rating: 5, comment: '' })
    const [booking, setBooking] = useState({ date: '', time: '', duration: 1, notes: '' })
    const [showBooking, setShowBooking] = useState(false)

    useEffect(() => {
        async function fetchTutor() {
            try {
                const res = await axiosInstance.get(`/api/v1/tutor/${id}`)
                setTutor(res.data.tutor)
            } catch {
                toast.error('Tutor not found')
                navigate('/tutors')
            }
            setLoading(false)
        }
        fetchTutor()
    }, [id])

    async function handleBooking(e) {
        e.preventDefault()
        if (!isLoggedIn) {
            toast.error('Please login to book a lesson')
            navigate('/login')
            return
        }
        try {
            await axiosInstance.post(`/api/v1/booking`, {
                tutorId: id,
                date: booking.date,
                time: booking.time,
                duration: booking.duration,
                notes: booking.notes
            })
            toast.success('Lesson booked successfully!')
            setShowBooking(false)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Booking failed')
        }
    }

    async function handleReview(e) {
        e.preventDefault()
        if (!isLoggedIn) {
            toast.error('Please login to leave a review')
            navigate('/login')
            return
        }
        try {
            await axiosInstance.post(`/api/v1/tutor/${id}/review`, review)
            toast.success('Review submitted!')
            const res = await axiosInstance.get(`/api/v1/tutor/${id}`)
            setTutor(res.data.tutor)
            setReview({ rating: 5, comment: '' })
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to submit review')
        }
    }

    if (loading) return (
        <HomeLayout>
            <div className='min-h-screen flex items-center justify-center text-white'>Loading...</div>
        </HomeLayout>
    )

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-5xl mx-auto'>

                {/* Profile Header */}
                <div className='bg-slate-800 rounded-xl p-8 mb-6 flex flex-col md:flex-row gap-6 items-start'>
                    <img src={tutor?.avatar?.secure_url ||
                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                        alt={tutor?.name}
                        className='w-32 h-32 rounded-full object-cover border-4 border-yellow-400' />
                    <div className='flex-1'>
                        <h1 className='text-3xl font-bold capitalize mb-1'>{tutor?.name}</h1>
                        <p className='text-yellow-400 text-lg font-medium mb-2'>{tutor?.subject}</p>
                        <div className='flex items-center gap-2 mb-3'>
                            <div className='flex text-yellow-400'>
                                {[1,2,3,4,5].map(s => (
                                    <FiStar key={s} className={s <= Math.round(tutor?.ratings) ? 'fill-yellow-400' : ''} />
                                ))}
                            </div>
                            <span className='text-slate-400'>{tutor?.ratings?.toFixed(1)} ({tutor?.totalReviews} reviews)</span>
                        </div>
                        <p className='text-slate-300 mb-4'>{tutor?.bio}</p>
                        <div className='flex flex-wrap gap-4 text-sm'>
                            <span className='flex items-center gap-1 text-green-400'><FiDollarSign />₹{tutor?.hourlyRate}/hr</span>
                            <span className='flex items-center gap-1 text-blue-400'><FiBook />{tutor?.experience} yrs experience</span>
                            <span className='flex items-center gap-1 text-purple-400'><FiBook />{tutor?.qualifications}</span>
                        </div>
                    </div>
                    <button onClick={() => setShowBooking(!showBooking)}
                        className='bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl whitespace-nowrap'>
                        Book a Lesson
                    </button>
                </div>

                {/* Booking Form */}
                {showBooking && (
                    <div className='bg-slate-800 rounded-xl p-6 mb-6'>
                        <h2 className='text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2'><FiCalendar /> Book a Lesson</h2>
                        <form onSubmit={handleBooking} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-slate-400 text-sm'>Date</label>
                                <input type='date' required
                                    className='w-full bg-slate-700 px-4 py-3 rounded-lg mt-1 text-white outline-none'
                                    value={booking.date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setBooking({ ...booking, date: e.target.value })} />
                            </div>
                            <div>
                                <label className='text-slate-400 text-sm'>Time</label>
                                <input type='time' required
                                    className='w-full bg-slate-700 px-4 py-3 rounded-lg mt-1 text-white outline-none'
                                    value={booking.time}
                                    onChange={(e) => setBooking({ ...booking, time: e.target.value })} />
                            </div>
                            <div>
                                <label className='text-slate-400 text-sm'>Duration (hours)</label>
                                <select className='w-full bg-slate-700 px-4 py-3 rounded-lg mt-1 text-white outline-none'
                                    value={booking.duration}
                                    onChange={(e) => setBooking({ ...booking, duration: e.target.value })}>
                                    <option value={1}>1 hour</option>
                                    <option value={2}>2 hours</option>
                                    <option value={3}>3 hours</option>
                                </select>
                            </div>
                            <div>
                                <label className='text-slate-400 text-sm'>Total Amount</label>
                                <div className='w-full bg-slate-700 px-4 py-3 rounded-lg mt-1 text-green-400 font-bold'>
                                    ₹{tutor?.hourlyRate * booking.duration}
                                </div>
                            </div>
                            <div className='md:col-span-2'>
                                <label className='text-slate-400 text-sm'>Notes (optional)</label>
                                <textarea className='w-full bg-slate-700 px-4 py-3 rounded-lg mt-1 text-white outline-none resize-none'
                                    rows={3} placeholder='Topics to cover, special requests...'
                                    value={booking.notes}
                                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
                            </div>
                            <button type='submit'
                                className='md:col-span-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg'>
                                Confirm Booking (₹{tutor?.hourlyRate * booking.duration})
                            </button>
                        </form>
                    </div>
                )}

                {/* Expertise */}
                <div className='bg-slate-800 rounded-xl p-6 mb-6'>
                    <h2 className='text-xl font-bold mb-4 text-yellow-400'>Expertise</h2>
                    <div className='flex flex-wrap gap-2'>
                        {tutor?.expertise?.map((exp, i) => (
                            <span key={i} className='bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium'>{exp}</span>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div className='bg-slate-800 rounded-xl p-6 mb-6'>
                    <h2 className='text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2'><FiClock /> Availability</h2>
                    {tutor?.availability?.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {tutor.availability.map((slot, i) => (
                                <div key={i} className='flex justify-between bg-slate-700 px-4 py-3 rounded-lg'>
                                    <span className='text-yellow-400 font-medium'>{slot.day}</span>
                                    <span className='text-slate-300'>{slot.startTime} - {slot.endTime}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text-slate-400'>No availability set yet.</p>
                    )}
                </div>

                {/* Reviews */}
                <div className='bg-slate-800 rounded-xl p-6 mb-6'>
                    <h2 className='text-xl font-bold mb-4 text-yellow-400'>Student Reviews</h2>
                    {tutor?.reviews?.length > 0 ? (
                        <div className='flex flex-col gap-4 mb-6'>
                            {tutor.reviews.map((r, i) => (
                                <div key={i} className='bg-slate-700 p-4 rounded-lg'>
                                    <div className='flex justify-between mb-2'>
                                        <span className='font-semibold capitalize'>{r.studentName}</span>
                                        <span className='text-yellow-400'>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    </div>
                                    <p className='text-slate-300 text-sm'>{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text-slate-400 mb-4'>No reviews yet. Be the first to review!</p>
                    )}

                    {/* Add Review */}
                    {isLoggedIn && (
                        <form onSubmit={handleReview} className='border-t border-slate-700 pt-4'>
                            <h3 className='font-semibold mb-3'>Leave a Review</h3>
                            <div className='flex items-center gap-2 mb-3'>
                                <span className='text-slate-400'>Rating:</span>
                                {[1,2,3,4,5].map(s => (
                                    <button type='button' key={s}
                                        onClick={() => setReview({ ...review, rating: s })}
                                        className={`text-2xl ${s <= review.rating ? 'text-yellow-400' : 'text-slate-600'}`}>
                                        ★
                                    </button>
                                ))}
                            </div>
                            <textarea className='w-full bg-slate-700 px-4 py-3 rounded-lg text-white outline-none resize-none mb-3'
                                rows={3} placeholder='Share your experience...'
                                value={review.comment}
                                onChange={(e) => setReview({ ...review, comment: e.target.value })} />
                            <button type='submit' className='bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg'>
                                Submit Review
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </HomeLayout>
    )
}

export default TutorProfile
