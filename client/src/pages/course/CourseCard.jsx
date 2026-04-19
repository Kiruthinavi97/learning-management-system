import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiLock } from 'react-icons/fi'

function CourseCard({ data }) {
    const navigate = useNavigate()
    const { data: userData } = useSelector((state) => state.auth)

    // Check if user has active subscription
    const isSubscribed = userData?.subscription?.status === 'active'
    const isAdmin = userData?.role === 'ADMIN'
    const hasAccess = isSubscribed || isAdmin

    function handleClick() {
        navigate('/course/description', { state: { ...data } })
    }

    return (
        <div
            onClick={handleClick}
            className="card w-96 bg-base-100 shadow-xl cursor-pointer transform transition-transform hover:scale-105 relative"
        >
            {/* Lock overlay for non-subscribers */}
            {!hasAccess && (
                <div className='absolute inset-0 bg-black/60 z-10 rounded-2xl flex flex-col items-center justify-center gap-3'>
                    <div className='bg-yellow-500 p-4 rounded-full'>
                        <FiLock className='text-3xl text-black' />
                    </div>
                    <p className='text-white font-semibold text-center px-4'>
                        Subscribe to access this course
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate('/course/description', { state: { ...data } })
                        }}
                        className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg text-sm'
                    >
                        View Details
                    </button>
                </div>
            )}

            <figure>
                <img
                    src={data.thumbnail?.secure_url}
                    alt="course thumbnail"
                    className={`w-full h-60 object-cover ${!hasAccess ? 'opacity-40' : ''}`}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title capitalize text-xl text-white">
                    {data.title}
                    <span className="badge badge-primary text-xs">NEW</span>
                    {/* Show lock badge for non-subscribers */}
                    {!hasAccess && (
                        <span className='badge badge-warning text-xs gap-1'>
                            <FiLock className='text-xs' /> Premium
                        </span>
                    )}
                </h2>
                <p className="capitalize font-bold">
                    Instructor: <span className='text-blue-500'>{data.createdBy}</span>
                </p>
                <p className="capitalize font-bold">
                    Lectures: <span className='text-blue-500'>{data.numberOfLectures}</span>
                </p>
                <div className="card-actions justify-between items-center">
                    <div className="badge badge-outline capitalize py-4 px-3 border-yellow-400 border-2">
                        {data.category}
                    </div>
                    {hasAccess ? (
                        <span className='text-green-400 text-xs font-semibold flex items-center gap-1'>
                            ✅ Enrolled
                        </span>
                    ) : (
                        <span className='text-yellow-400 text-xs font-semibold flex items-center gap-1'>
                            🔒 Subscribe to Access
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseCard