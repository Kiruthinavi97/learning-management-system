import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FiUser, FiCalendar, FiBook } from 'react-icons/fi'
import { BsCurrencyRupee } from 'react-icons/bs'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function AdminSubscribers() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchPayments() {
        try {
            const res = await axiosInstance.get('/api/v1/payments?count=100')
            const items = res.data?.allPayments?.items || []
            setPayments(items)
        } catch {
            toast.error('Failed to load subscriber data')
        }
        setLoading(false)
    }

    useEffect(() => { fetchPayments() }, [])

        const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-7xl mx-auto'>
                <h1 className='text-3xl font-bold text-yellow-400 mb-2'>Subscriber Management</h1>
                <p className='text-slate-400 mb-8'>All course enrollments and payment history</p>

                {/* Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4 border border-slate-700'>
                        <div className='bg-yellow-400/10 p-3 rounded-lg'><FiUser className='text-2xl text-yellow-400' /></div>
                        <div>
                            <p className='text-slate-400 text-sm'>Total Enrollments</p>
                            <p className='text-2xl font-bold'>{payments.length}</p>
                        </div>
                    </div>
                    <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4 border border-slate-700'>
                        <div className='bg-green-400/10 p-3 rounded-lg'><BsCurrencyRupee className='text-2xl text-green-400' /></div>
                        <div>
                            <p className='text-slate-400 text-sm'>Total Revenue</p>
                            <p className='text-2xl font-bold'>{totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className='bg-slate-800 rounded-xl p-5 flex items-center gap-4 border border-slate-700'>
                        <div className='bg-blue-400/10 p-3 rounded-lg'><FiBook className='text-2xl text-blue-400' /></div>
                        <div>
                            <p className='text-slate-400 text-sm'>Avg per Month</p>
                            <p className='text-2xl font-bold'>₹{Math.round(totalRevenue / 12).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='bg-slate-800 rounded-xl overflow-hidden border border-slate-700'>
                    <div className='px-6 py-4 border-b border-slate-700'>
                        <h2 className='font-semibold text-lg'>Enrollment History</h2>
                    </div>
                    {loading ? (
                        <p className='text-slate-400 text-center py-10'>Loading...</p>
                    ) : payments.length === 0 ? (
                        <p className='text-slate-400 text-center py-10'>No enrollments yet</p>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-slate-700/50'>
                                    <tr>
                                        {['#','Student','Course','Amount','Date & Time','Payment ID','Status'].map(h => (
                                            <th key={h} className='text-left px-6 py-4 text-slate-400 text-sm font-medium'>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((p, i) => (
                                        <tr key={p._id} className='border-t border-slate-700 hover:bg-slate-700/30 transition-all'>
                                            <td className='px-6 py-4 text-slate-400 text-sm'>{i + 1}</td>
                                           <td className='px-6 py-4'>
    <div className='flex items-center gap-3'>
        {/* Fix: Use a fallback for the avatar initial */}
        <div className='w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-xs'>
            {p.userId?.name ? p.userId.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
            {/* Fix: Check for userId existence */}
            <p className='text-white text-sm font-medium capitalize'>
                {p.userId?.name || 'Deleted User'}
            </p>
            <p className='text-slate-400 text-xs'>
                {p.userId?.email || 'N/A'}
            </p>
        </div>
    </div>
</td>
                                            <td className='px-6 py-4'>
                                                <span className='text-yellow-400 text-sm capitalize'>{p.courseTitle || 'N/A'}</span>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span className='text-green-400 font-semibold flex items-center gap-0.5'>
                                                    <BsCurrencyRupee />{p.amount || 499}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <p className='text-slate-300 text-sm flex items-center gap-1'>
                                                    <FiCalendar className='text-slate-500 flex-shrink-0' />
                                                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                                                </p>
                                                <p className='text-slate-500 text-xs pl-5'>
                                                    {new Date(p.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
                                                </p>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <p className='text-slate-400 text-xs font-mono truncate max-w-[120px]'>{p.payment_id}</p>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span className='px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/10 capitalize'>
                                                    {p.status || 'captured'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    )
}

export default AdminSubscribers
