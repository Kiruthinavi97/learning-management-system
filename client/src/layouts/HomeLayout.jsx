import Cookies from 'js-cookie'
import { FiMenu, FiHome, FiBook, FiUsers, FiMail, FiInfo, FiUser, FiCalendar, FiLogOut, FiSettings, FiAward } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Footer from '../components/Footer'
import { logout } from '../Redux/slices/authslice';
import { tutorLogout } from '../Redux/slices/tutorSlice';

function HomeLayout({ children }) {

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const role = useSelector((state) => state?.auth?.role);
    const avatar = useSelector((state) => state?.auth?.data?.avatar?.secure_url)
    const name = useSelector((state) => state?.auth?.data?.name)
    const firstName = name ? name.split(' ')[0] : '';

    const isTutorLoggedIn = useSelector((state) => state?.tutor?.isLoggedIn);
    const tutorAvatar = useSelector((state) => state?.tutor?.data?.avatar?.secure_url)
    const tutorName = useSelector((state) => state?.tutor?.data?.name)
    const tutorFirstName = tutorName ? tutorName.split(' ')[0] : '';

    async function onLogout() {
        await dispatch(logout())
        Cookies.remove('authToken')
    }

    async function onTutorLogout() {
        await dispatch(tutorLogout())
    }

    return (
        <div className='relative'>
            <div className="drawer">
                <label htmlFor="my-drawer-2"></label>
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

                {/* Menu Button */}
                <div className="p-5">
                    <label htmlFor="my-drawer-2" className="drawer-button cursor-pointer">
                        <FiMenu size={"30px"} />
                    </label>
                </div>

                <div className="drawer-side z-10">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <div className="w-72 min-h-full bg-slate-900 flex flex-col">

                        {/* Profile / Brand Header */}
                        <div className="bg-slate-800 px-6 py-6 border-b border-slate-700">
                            {isLoggedIn || isTutorLoggedIn ? (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={isLoggedIn ? avatar : tutorAvatar}
                                        alt="profile"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400"
                                    />
                                    <div>
                                        <p className="text-yellow-400 text-sm">Welcome back,</p>
                                        <p className="text-white font-bold text-lg capitalize">
                                            {isLoggedIn ? firstName : tutorFirstName}
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">
                                            {isLoggedIn ? (role === 'ADMIN' ? 'Admin' : 'Student') : 'Tutor'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-yellow-400 font-bold text-xl mb-1">LMS Platform</p>
                                    <p className="text-slate-400 text-sm">Learn from expert tutors</p>
                                </div>
                            )}
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">

                            <p className="text-slate-500 text-xs uppercase tracking-widest px-3 mb-3">Menu</p>
                            <Link to='/' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                <FiHome /> Home
                            </Link>
                            <Link to='/courses' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                <FiBook /> All Courses
                            </Link>
                            <Link to='/tutors' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                <FiUsers /> Find Tutors
                            </Link>
                            <Link to='/contact' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                <FiMail /> Contact Us
                            </Link>
                            <Link to='/about' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                <FiInfo /> About Us
                            </Link>

                            {/* Admin Section */}
                            {isLoggedIn && role === 'ADMIN' && (
                                <>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest px-3 pt-4 mb-3">Admin</p>
                                    <Link to='/admin/dashboard' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                        <FiSettings /> Dashboard
                                    </Link>
                                    <Link to='/admin/users' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                        <FiUsers /> Manage Users
                                    </Link>
                                </>
                            )}

                            {/* Student Section */}
                            {isLoggedIn && (
                                <>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest px-3 pt-4 mb-3">My Account</p>
                                    <Link to='/profile' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                        <FiUser /> My Profile
                                    </Link>
                                    <Link to='/my-bookings' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                        <FiCalendar /> My Bookings
                                    </Link>
                                </>
                            )}

                            {/* Tutor Section */}
                            {isTutorLoggedIn && (
                                <>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest px-3 pt-4 mb-3">Tutor</p>
                                    <Link to='/tutor/dashboard' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                        <FiAward /> Dashboard
                                    </Link>
                                    <Link to='/tutor/bookings' className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-yellow-400 transition-all">
                                        <FiCalendar /> My Bookings
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Bottom Auth Section */}
                        <div className="px-4 py-5 border-t border-slate-700 space-y-2">
                            {!isLoggedIn && !isTutorLoggedIn ? (
                                <>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Student</p>
                                    <Link to='/login' className="flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2.5 rounded-lg transition-all">
                                        Login
                                    </Link>
                                    <Link to='/signup' className="flex items-center justify-center w-full border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold py-2.5 rounded-lg transition-all">
                                        Sign Up
                                    </Link>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-3 mb-2">Tutor</p>
                                    <Link to='/tutor/login' className="flex items-center justify-center w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all">
                                        Tutor Login
                                    </Link>
                                    <Link to='/tutor/signup' className="flex items-center justify-center w-full border border-slate-600 text-slate-300 hover:bg-slate-700 font-semibold py-2.5 rounded-lg transition-all">
                                        Become a Tutor
                                    </Link>
                                </>
                            ) : isLoggedIn ? (
                                <button onClick={onLogout}
                                    className="flex items-center justify-center gap-2 w-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-semibold py-2.5 rounded-lg transition-all">
                                    <FiLogOut /> Log Out
                                </button>
                            ) : (
                                <button onClick={onTutorLogout}
                                    className="flex items-center justify-center gap-2 w-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-semibold py-2.5 rounded-lg transition-all">
                                    <FiLogOut /> Tutor Log Out
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            {children}
            <Footer />
        </div>
    )
}

export default HomeLayout
