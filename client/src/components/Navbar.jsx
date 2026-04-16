import { useState } from 'react'
import Cookies from 'js-cookie'
import { FiSearch, FiChevronDown, FiMenu, FiX, FiUser, FiLogOut, FiBook, FiUsers, FiAward, FiCalendar, FiSettings, FiGrid } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { logout } from '../Redux/slices/authslice'
import { tutorLogout } from '../Redux/slices/tutorSlice'

function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeDropdown, setActiveDropdown] = useState(null)

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn)
    const role = useSelector((state) => state?.auth?.role)
    const avatar = useSelector((state) => state?.auth?.data?.avatar?.secure_url)
    const name = useSelector((state) => state?.auth?.data?.name)

    const isTutorLoggedIn = useSelector((state) => state?.tutor?.isLoggedIn)
    const tutorAvatar = useSelector((state) => state?.tutor?.data?.avatar?.secure_url)
    const tutorName = useSelector((state) => state?.tutor?.data?.name)

    async function onLogout() {
        await dispatch(logout())
        Cookies.remove('authToken')
        navigate('/')
    }

    async function onTutorLogout() {
        await dispatch(tutorLogout())
        navigate('/')
    }

    function handleSearch(e) {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    const navItems = [
        {
            label: 'Courses',
            dropdown: [
                { label: 'All Courses', to: '/courses', icon: <FiBook /> },
                { label: 'Find Tutors', to: '/tutors', icon: <FiUsers /> },
            ]
        },
        {
            label: 'Resources',
            dropdown: [
                { label: 'About Us', to: '/about', icon: <FiAward /> },
                { label: 'Contact Us', to: '/contact', icon: <FiUser /> },
            ]
        },
    ]

    return (
        <nav className='bg-slate-900 border-b border-slate-700 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>

                    {/* Logo */}
                    <Link to='/' className='flex items-center gap-2 flex-shrink-0'>
                        <FiAward className='text-yellow-400 text-2xl' />
                        <span className='text-white font-bold text-xl'>LMS<span className='text-yellow-400'>Platform</span></span>
                    </Link>

                    {/* Desktop Nav Items */}
                    <div className='hidden lg:flex items-center gap-1'>
                        <Link to='/' className='text-slate-300 hover:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all'>
                            Home
                        </Link>

                        {navItems.map((item) => (
                            <div key={item.label} className='relative'
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-1 text-slate-300 hover:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all'>
                                    {item.label} <FiChevronDown className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === item.label && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-48 mt-1'>
                                        {item.dropdown.map((d) => (
                                            <Link key={d.label} to={d.to}
                                                className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm transition-all'>
                                                {d.icon} {d.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Admin */}
                        {isLoggedIn && role === 'ADMIN' && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('admin')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-1 text-slate-300 hover:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all'>
                                    Admin <FiChevronDown className={`transition-transform ${activeDropdown === 'admin' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'admin' && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-48 mt-1'>
                                        <Link to='/admin/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiSettings /> Dashboard
                                        </Link>
                                        <Link to='/admin/users' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiUsers /> Manage Users
                                        </Link>
                                        <Link to='/course/create' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiBook /> Create Course
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tutor menu */}
                        {isTutorLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('tutor')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-1 text-slate-300 hover:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all'>
                                    Tutor <FiChevronDown className={`transition-transform ${activeDropdown === 'tutor' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'tutor' && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-48 mt-1'>
                                        <Link to='/tutor/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiGrid /> Dashboard
                                        </Link>
                                        <Link to='/tutor/bookings' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiCalendar /> My Bookings
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className='flex items-center gap-3'>

                        {/* Search */}
                        <div className='relative'>
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className='flex items-center gap-2'>
                                    <input
                                        autoFocus
                                        type='text'
                                        placeholder='Search courses...'
                                        className='bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-yellow-400 w-48'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type='button' onClick={() => setSearchOpen(false)}
                                        className='text-slate-400 hover:text-white'>
                                        <FiX />
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => setSearchOpen(true)}
                                    className='text-slate-300 hover:text-yellow-400 p-2 rounded-lg transition-all'>
                                    <FiSearch className='text-xl' />
                                </button>
                            )}
                        </div>

                        {/* Not logged in */}
                        {!isLoggedIn && !isTutorLoggedIn && (
                            <div className='hidden lg:flex items-center gap-2'>
                                <Link to='/login' className='text-slate-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-all'>
                                    Login
                                </Link>
                                <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all'>
                                    Sign Up
                                </Link>
                                <Link to='/tutor/signup' className='border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all'>
                                    Become a Tutor
                                </Link>
                            </div>
                        )}

                        {/* Student logged in */}
                        {isLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('profile')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all'>
                                    <img src={avatar} className='w-7 h-7 rounded-full object-cover border border-yellow-400' />
                                    <span className='text-white text-sm capitalize hidden lg:block'>{name?.split(' ')[0]}</span>
                                    <FiChevronDown className='text-slate-400 text-sm' />
                                </button>
                                {activeDropdown === 'profile' && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-52 mt-1'>
                                        <Link to='/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiGrid /> My Dashboard
                                        </Link>
                                        <Link to='/profile' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiUser /> My Profile
                                        </Link>
                                        <Link to='/my-bookings' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiCalendar /> My Bookings
                                        </Link>
                                        <Link to='/certificate' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiAward /> My Certificate
                                        </Link>
                                        <hr className='border-slate-700 my-1' />
                                        <button onClick={onLogout}
                                            className='flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-slate-700 w-full text-sm'>
                                            <FiLogOut /> Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tutor logged in */}
                        {isTutorLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('tutorProfile')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all'>
                                    <img src={tutorAvatar} className='w-7 h-7 rounded-full object-cover border border-yellow-400' />
                                    <span className='text-white text-sm capitalize hidden lg:block'>{tutorName?.split(' ')[0]}</span>
                                    <FiChevronDown className='text-slate-400 text-sm' />
                                </button>
                                {activeDropdown === 'tutorProfile' && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-52 mt-1'>
                                        <Link to='/tutor/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiGrid /> Dashboard
                                        </Link>
                                        <Link to='/tutor/bookings' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm'>
                                            <FiCalendar /> My Bookings
                                        </Link>
                                        <hr className='border-slate-700 my-1' />
                                        <button onClick={onTutorLogout}
                                            className='flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-slate-700 w-full text-sm'>
                                            <FiLogOut /> Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button onClick={() => setMobileOpen(!mobileOpen)}
                            className='lg:hidden text-slate-300 hover:text-yellow-400 p-2'>
                            {mobileOpen ? <FiX className='text-xl' /> : <FiMenu className='text-xl' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className='lg:hidden border-t border-slate-700 py-4 space-y-1'>
                        <Link to='/' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                            <FiGrid /> Home
                        </Link>
                        <Link to='/courses' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                            <FiBook /> All Courses
                        </Link>
                        <Link to='/tutors' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                            <FiUsers /> Find Tutors
                        </Link>
                        <Link to='/about' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                            <FiAward /> About Us
                        </Link>
                        <Link to='/contact' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                            <FiUser /> Contact Us
                        </Link>

                        {isLoggedIn && (
                            <>
                                <hr className='border-slate-700' />
                                <Link to='/dashboard' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                                    <FiGrid /> My Dashboard
                                </Link>
                                <Link to='/profile' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                                    <FiUser /> My Profile
                                </Link>
                                <Link to='/my-bookings' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                                    <FiCalendar /> My Bookings
                                </Link>
                                <button onClick={onLogout} className='flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg w-full'>
                                    <FiLogOut /> Log Out
                                </button>
                            </>
                        )}

                        {isTutorLoggedIn && (
                            <>
                                <hr className='border-slate-700' />
                                <Link to='/tutor/dashboard' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                                    <FiGrid /> Tutor Dashboard
                                </Link>
                                <button onClick={onTutorLogout} className='flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg w-full'>
                                    <FiLogOut /> Log Out
                                </button>
                            </>
                        )}

                        {!isLoggedIn && !isTutorLoggedIn && (
                            <>
                                <hr className='border-slate-700' />
                                <div className='flex flex-col gap-2 px-4 pt-2'>
                                    <Link to='/login' onClick={() => setMobileOpen(false)} className='bg-yellow-500 text-black font-semibold py-2.5 rounded-lg text-center'>Login</Link>
                                    <Link to='/signup' onClick={() => setMobileOpen(false)} className='border border-yellow-500 text-yellow-400 font-semibold py-2.5 rounded-lg text-center'>Sign Up</Link>
                                    <Link to='/tutor/login' onClick={() => setMobileOpen(false)} className='bg-slate-700 text-white font-semibold py-2.5 rounded-lg text-center'>Tutor Login</Link>
                                    <Link to='/tutor/signup' onClick={() => setMobileOpen(false)} className='border border-slate-600 text-slate-300 font-semibold py-2.5 rounded-lg text-center'>Become a Tutor</Link>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
