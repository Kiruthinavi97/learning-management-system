import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiLock, FiPlay } from 'react-icons/fi'
import { BsCurrencyRupee } from 'react-icons/bs'

function CourseCard({ data }) {
    const navigate = useNavigate()
    const { data: userData } = useSelector((state) => state.auth)

    const isAdmin = userData?.role === 'ADMIN'

    // ✅ Check if subscribed to THIS specific course only
    const isSubscribedToCourse = userData?.subscription?.courses?.some(
        c => c.courseId?.toString() === data?._id?.toString() && c.status === 'active'
    )

    const hasAccess = isAdmin || isSubscribedToCourse

    return (
        <div onClick={() => navigate('/course/description', { state: { ...data } })}
            className="card w-96 bg-base-100 shadow-xl cursor-pointer transform transition-transform hover:scale-105 relative overflow-hidden">

            {/* Lock overlay */}
            {!hasAccess && (
                <div className='absolute inset-0 bg-black/60 z-10 rounded-2xl flex flex-col items-center justify-center gap-3'>
                    <div className='bg-yellow-500 p-4 rounded-full'>
                        <FiLock className='text-3xl text-black' />
                    </div>
                    <p className='text-white font-semibold text-center px-6 text-sm'>
                        Enroll for ₹499 to access
                    </p>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate('/course/description', { state: { ...data } }) }}
                        className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg text-sm'>
                        View & Enroll
                    </button>
                </div>
            )}

            <figure>
                <img src={data?.thumbnail?.secure_url} alt="course thumbnail"
                    className={`w-full h-60 object-cover ${!hasAccess ? 'opacity-40' : ''}`} />
            </figure>

            <div className="card-body">
                <h2 className="card-title capitalize text-xl text-white">
                    {data?.title}
                    <span className="badge badge-primary text-xs">NEW</span>
                    {!hasAccess && (
                        <span className='badge badge-warning text-xs gap-1'>
                            <FiLock className='text-xs' /> ₹499
                        </span>
                    )}
                </h2>
                <p className="capitalize font-bold">Instructor: <span className='text-blue-500'>{data?.createdBy}</span></p>
                <p className="capitalize font-bold">Lectures: <span className='text-blue-500'>{data?.numberOfLectures}</span></p>
                <div className="card-actions justify-between items-center">
                    <div className="badge badge-outline capitalize py-4 px-3 border-yellow-400 border-2">{data?.category}</div>
                    {hasAccess ? (
                        <span className='text-green-400 text-xs font-semibold flex items-center gap-1'><FiPlay className='text-xs' /> Enrolled</span>
                    ) : (
                        <span className='text-yellow-400 text-xs font-semibold flex items-center gap-1'><BsCurrencyRupee className='text-xs' />499 to Enroll</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseCard
