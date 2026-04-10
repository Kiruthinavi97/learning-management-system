import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiUser, FiBook, FiDollarSign, FiStar, FiLogOut, FiEdit } from 'react-icons/fi'

import HomeLayout from '../../layouts/HomeLayout'
import { getTutorProfile, tutorLogout } from '../../Redux/slices/tutorSlice'

function TutorDashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { data: tutor } = useSelector((state) => state.tutor)

    useEffect(() => {
        dispatch(getTutorProfile())
    }, [])

    async function handleLogout() {
        await dispatch(tutorLogout())
        navigate('/tutor/login')
    }

    return (
        <HomeLayout>
            <div className='min-h-screen p-6 text-white'>
                <div className='max-w-5xl mx-auto'>

                    {/* Header */}
                    <div className='flex justify-between items-center mb-8'>
                        <h1 className='text-3xl font-bold text-yellow-400'>Tutor Dashboard</h1>
                        <button onClick={handleLogout}
                            className='flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg'>
                            <FiLogOut /> Logout
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className='bg-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row gap-6 items-center'>
                        <img
                            src={tutor?.avatar?.secure_url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                            alt="avatar"
                            className='w-24 h-24 rounded-full object-cover border-4 border-yellow-400'
                        />
                        <div className='flex-1'>
                            <h2 className='text-2xl font-semibold capitalize'>{tutor?.name}</h2>
                            <p className='text-slate-400'>{tutor?.email}</p>
                            <p className='text-yellow-400 font-medium mt-1'>{tutor?.subject}</p>
                            <p className='text-slate-300 text-sm mt-2'>{tutor?.bio}</p>
                        </div>
                        <Link to='/tutor/profile/edit'
                            className='flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold'>
                            <FiEdit /> Edit Profile
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                        <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4'>
                            <div className='bg-yellow-500 p-3 rounded-lg'><FiBook className='text-2xl text-black' /></div>
                            <div>
                                <p className='text-slate-400 text-sm'>Experience</p>
                                <p className='text-xl font-bold'>{tutor?.experience} yrs</p>
                            </div>
                        </div>
                        <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4'>
                            <div className='bg-green-500 p-3 rounded-lg'><FiDollarSign className='text-2xl text-white' /></div>
                            <div>
                                <p className='text-slate-400 text-sm'>Hourly Rate</p>
                                <p className='text-xl font-bold'>₹{tutor?.hourlyRate}</p>
                            </div>
                        </div>
                        <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4'>
                            <div className='bg-blue-500 p-3 rounded-lg'><FiStar className='text-2xl text-white' /></div>
                            <div>
                                <p className='text-slate-400 text-sm'>Rating</p>
                                <p className='text-xl font-bold'>{tutor?.ratings?.toFixed(1) || '0.0'} / 5</p>
                            </div>
                        </div>
                        <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4'>
                            <div className='bg-purple-500 p-3 rounded-lg'><FiUser className='text-2xl text-white' /></div>
                            <div>
                                <p className='text-slate-400 text-sm'>Reviews</p>
                                <p className='text-xl font-bold'>{tutor?.totalReviews || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>

                        {/* Qualifications & Expertise */}
                        <div className='bg-slate-800 rounded-xl p-6'>
                            <h3 className='text-xl font-semibold mb-4 text-yellow-400'>Qualifications & Expertise</h3>
                            <p className='text-slate-300 mb-3'><span className='text-white font-medium'>Qualifications:</span> {tutor?.qualifications}</p>
                            <div>
                                <p className='text-white font-medium mb-2'>Expertise:</p>
                                <div className='flex flex-wrap gap-2'>
                                    {tutor?.expertise?.map((item, i) => (
                                        <span key={i} className='bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium'>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className='bg-slate-800 rounded-xl p-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='text-xl font-semibold text-yellow-400'>Availability</h3>
                                <Link to='/tutor/availability'
                                    className='text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg'>
                                    Manage
                                </Link>
                            </div>
                            {tutor?.availability?.length > 0 ? (
                                <div className='flex flex-col gap-2'>
                                    {tutor.availability.map((slot, i) => (
                                        <div key={i} className='flex justify-between bg-slate-700 px-4 py-2 rounded-lg'>
                                            <span className='text-yellow-400 font-medium'>{slot.day}</span>
                                            <span className='text-slate-300'>{slot.startTime} - {slot.endTime}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-slate-400'>No availability set yet.
                                    <Link to='/tutor/availability' className='text-yellow-400 ml-1 hover:underline'>Add now</Link>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className='bg-slate-800 rounded-xl p-6'>
                        <h3 className='text-xl font-semibold mb-4 text-yellow-400'>Student Reviews</h3>
                        {tutor?.reviews?.length > 0 ? (
                            <div className='flex flex-col gap-4'>
                                {tutor.reviews.map((review, i) => (
                                    <div key={i} className='bg-slate-700 p-4 rounded-lg'>
                                        <div className='flex justify-between mb-1'>
                                            <span className='font-semibold capitalize'>{review.studentName}</span>
                                            <span className='text-yellow-400'>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                        </div>
                                        <p className='text-slate-300 text-sm'>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-slate-400'>No reviews yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </HomeLayout>
    )
}

export default TutorDashboard
