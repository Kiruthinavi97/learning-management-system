import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiStar, FiBook } from 'react-icons/fi'
import { BsCurrencyRupee } from 'react-icons/bs'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function BrowseTutors() {
    const [tutors, setTutors] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ subject: '', minRate: '', maxRate: '', minRating: '' })

    async function fetchTutors() {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.subject) params.append('subject', filters.subject)
            if (filters.minRate) params.append('minRate', filters.minRate)
            if (filters.maxRate) params.append('maxRate', filters.maxRate)
            if (filters.minRating) params.append('minRating', filters.minRating)
            const res = await axiosInstance.get(`/api/v1/tutor/all?${params}`)
            setTutors(res.data.tutors || [])
        } catch {
            setTutors([])
        }
        setLoading(false)
    }

    useEffect(() => { fetchTutors() }, [])

    function handleFilter(e) {
        const { name, value } = e.target
        setFilters({ ...filters, [name]: value })
    }

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-6xl mx-auto'>
                <h1 className='text-4xl font-bold text-yellow-400 mb-2'>Find a Tutor</h1>
                <p className='text-slate-400 mb-8'>Browse expert tutors and book your lesson today</p>

                {/* Filters */}
                <div className='bg-slate-800 rounded-xl p-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <div className='flex items-center gap-2 bg-slate-700 px-4 rounded-lg'>
                        <FiSearch className='text-yellow-400' />
                        <input type='text' name='subject' placeholder='Search by subject...'
                            className='bg-transparent py-3 outline-none w-full text-white'
                            value={filters.subject} onChange={handleFilter} />
                    </div>
                    <input type='number' name='minRate' placeholder='Min Rate (₹)'
                        className='bg-slate-700 px-4 py-3 rounded-lg outline-none text-white'
                        value={filters.minRate} onChange={handleFilter} />
                    <input type='number' name='maxRate' placeholder='Max Rate (₹)'
                        className='bg-slate-700 px-4 py-3 rounded-lg outline-none text-white'
                        value={filters.maxRate} onChange={handleFilter} />
                    <select name='minRating' className='bg-slate-700 px-4 py-3 rounded-lg outline-none text-white'
                        value={filters.minRating} onChange={handleFilter}>
                        <option value=''>All Ratings</option>
                        <option value='4'>4+ Stars</option>
                        <option value='3'>3+ Stars</option>
                        <option value='2'>2+ Stars</option>
                    </select>
                    <button onClick={fetchTutors}
                        className='md:col-span-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg'>
                        Search Tutors
                    </button>
                </div>

                {/* Tutor Cards */}
                {loading ? (
                    <div className='text-center text-slate-400 py-20'>Loading tutors...</div>
                ) : tutors.length === 0 ? (
                    <div className='text-center text-slate-400 py-20'>No tutors found. Try different filters.</div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {tutors.map((tutor) => (
                            <div key={tutor._id} className='bg-slate-800 rounded-xl p-6 flex flex-col gap-4 hover:border border-yellow-400 transition-all'>
                                <div className='flex items-center gap-4'>
                                    <img src={tutor?.avatar?.secure_url ||
                                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                                        alt={tutor.name}
                                        className='w-16 h-16 rounded-full object-cover border-2 border-yellow-400' />
                                    <div>
                                        <h3 className='text-lg font-semibold capitalize'>{tutor.name}</h3>
                                        <p className='text-yellow-400 text-sm'>{tutor.subject}</p>
                                        <div className='flex items-center gap-1 text-sm text-yellow-300'>
                                            <FiStar />
                                            <span>{tutor.ratings?.toFixed(1) || '0.0'} ({tutor.totalReviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className='text-slate-400 text-sm line-clamp-2'>{tutor.bio || 'No bio available'}</p>
                                <div className='flex flex-wrap gap-2'>
                                    {tutor.expertise?.slice(0, 3).map((exp, i) => (
                                        <span key={i} className='bg-slate-700 text-yellow-400 text-xs px-2 py-1 rounded-full'>{exp}</span>
                                    ))}
                                </div>
                                <div className='flex justify-between items-center mt-auto'>
                                    {/* ✅ Rupee symbol only — no dollar sign */}
                                    <div className='flex items-center gap-0.5 text-green-400 font-semibold'>
                                        <BsCurrencyRupee />
                                        <span>₹{tutor.hourlyRate}/hr</span>
                                    </div>
                                    <div className='flex items-center gap-1 text-slate-400 text-sm'>
                                        <FiBook />
                                        <span>{tutor.experience} yrs exp</span>
                                    </div>
                                </div>
                                <Link to={`/tutor/${tutor._id}`}
                                    className='bg-yellow-500 hover:bg-yellow-600 text-black text-center font-semibold py-2 rounded-lg'>
                                    View Profile & Book
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HomeLayout>
    )
}

export default BrowseTutors
