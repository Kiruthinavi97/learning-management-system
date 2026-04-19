import { useState } from 'react'
import Cookies from 'js-cookie'
import { FiSearch, FiChevronDown, FiMenu, FiX, FiUser, FiLogOut, FiBook, FiUsers, FiAward, FiCalendar, FiSettings, FiGrid } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { logout } from '../Redux/slices/authslice'
import { tutorLogout } from '../Redux/slices/tutorSlice'

function LMSLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="32" height="32" rx="8" fill="#EAB308"/>
            <rect x="8" y="12" width="8" height="12" rx="1" fill="white" opacity="0.9"/>
            <rect x="20" y="12" width="8" height="12" rx="1" fill="white" opacity="0.7"/>
            <rect x="16.5" y="12" width="3" height="12" fill="#EAB308"/>
            <polygon points="18,5 28,10 18,13 8,10" fill="#1e293b"/>
            <rect x="25.5" y="10" width="2" height="5" rx="1" fill="#1e293b"/>
            <circle cx="26.5" cy="16.5" r="1.5" fill="#EAB308"/>
        </svg>
    )
}

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
        <nav className='bg-slate-900 border-b border-slate-700/60 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>

                    {/* Logo */}
                    <Link to='/' className='flex items-center gap-2.5 flex-shrink-0'>
                        <LMSLogo />
                        <div className='leading-tight'>
                            <span className='text-white font-bold text-lg tracking-tight'>
                                Learn<span className='text-yellow-400'>Sphere</span>
                            </span>
                            <p className='text-slate-500 text-xs hidden lg:block leading-none'>Online Learning Platform</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className='hidden lg:flex items-center gap-1'>
                        <Link to='/' className='text-slate-300 hover:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800'>
                            Home
                        </Link>

                        {navItems.map((item) => (
                            <div key={item.label} className='relative'
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 ${activeDropdown === item.label ? 'text-yellow-400 bg-slate-800' : 'text-slate-300 hover:text-yellow-400'}`}>
                                    {item.label}
                                    <FiChevronDown className={`text-xs transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === item.label && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-52 mt-1'>
                                        {item.dropdown.map((d) => (
                                            <Link key={d.label} to={d.to}
                                                className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm transition-all rounded-lg mx-1'>
                                                <span className='text-yellow-400/70'>{d.icon}</span> {d.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoggedIn && role === 'ADMIN' && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('admin')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 ${activeDropdown === 'admin' ? 'text-yellow-400 bg-slate-800' : 'text-slate-300'}`}>
                                    Admin <FiChevronDown className={`text-xs transition-transform duration-200 ${activeDropdown === 'admin' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'admin' && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-52 mt-1'>
                                        <Link to='/admin/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiSettings className='text-yellow-400/70' /> Dashboard</Link>
                                        <Link to='/admin/users' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiUsers className='text-yellow-400/70' /> Manage Users</Link>
                                        <Link to='/course/create' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiBook className='text-yellow-400/70' /> Create Course</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {isTutorLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('tutor')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 ${activeDropdown === 'tutor' ? 'text-yellow-400 bg-slate-800' : 'text-slate-300'}`}>
                                    Tutor <FiChevronDown className={`text-xs transition-transform duration-200 ${activeDropdown === 'tutor' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'tutor' && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-52 mt-1'>
                                        <Link to='/tutor/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiGrid className='text-yellow-400/70' /> Dashboard</Link>
                                        <Link to='/tutor/bookings' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiCalendar className='text-yellow-400/70' /> My Bookings</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className='flex items-center gap-2'>

                        {/* Search */}
                        <div className='relative'>
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className='flex items-center gap-2'>
                                    <input autoFocus type='text' placeholder='Search courses...'
                                        className='bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-yellow-400 w-48 transition-all'
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <button type='button' onClick={() => setSearchOpen(false)} className='text-slate-400 hover:text-white p-1'><FiX /></button>
                                </form>
                            ) : (
                                <button onClick={() => setSearchOpen(true)} className='text-slate-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-slate-800 transition-all'>
                                    <FiSearch className='text-lg' />
                                </button>
                            )}
                        </div>

                        {/* Guest */}
                        {!isLoggedIn && !isTutorLoggedIn && (
                            <div className='hidden lg:flex items-center gap-2'>
                                <Link to='/login' className='text-slate-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-800 rounded-lg'>Login</Link>
                                <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all'>Sign Up</Link>
                                <Link to='/tutor/signup' className='border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all'>Become a Tutor</Link>
                            </div>
                        )}

                        {/* Student */}
                        {isLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('profile')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl transition-all border border-slate-700'>
                                    <img src={avatar} className='w-7 h-7 rounded-full object-cover ring-2 ring-yellow-400/50' />
                                    <span className='text-white text-sm font-medium capitalize hidden lg:block'>{name?.split(' ')[0]}</span>
                                    <FiChevronDown className={`text-slate-400 text-xs transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'profile' && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-56 mt-1'>
                                        <div className='px-4 py-2.5 border-b border-slate-700 mb-1'>
                                            <p className='text-white font-medium text-sm capitalize'>{name}</p>
                                            <p className='text-slate-400 text-xs'>{role === 'ADMIN' ? 'Administrator' : 'Student'}</p>
                                        </div>
                                        <Link to='/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiGrid className='text-yellow-400/70' /> My Dashboard</Link>
                                        <Link to='/profile' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiUser className='text-yellow-400/70' /> My Profile</Link>
                                        <Link to='/my-bookings' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiCalendar className='text-yellow-400/70' /> My Bookings</Link>
                                        <Link to='/certificate' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiAward className='text-yellow-400/70' /> My Certificate</Link>
                                        <div className='border-t border-slate-700 mt-1 pt-1'>
                                            <button onClick={onLogout} className='flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 w-full text-sm rounded-lg mx-1'><FiLogOut /> Log Out</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tutor */}
                        {isTutorLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('tutorProfile')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl transition-all border border-slate-700'>
                                    <img src={tutorAvatar} className='w-7 h-7 rounded-full object-cover ring-2 ring-yellow-400/50' />
                                    <span className='text-white text-sm font-medium capitalize hidden lg:block'>{tutorName?.split(' ')[0]}</span>
                                    <FiChevronDown className={`text-slate-400 text-xs transition-transform ${activeDropdown === 'tutorProfile' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'tutorProfile' && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-52 mt-1'>
                                        <div className='px-4 py-2.5 border-b border-slate-700 mb-1'>
                                            <p className='text-white font-medium text-sm capitalize'>{tutorName}</p>
                                            <p className='text-slate-400 text-xs'>Tutor</p>
                                        </div>
                                        <Link to='/tutor/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiGrid className='text-yellow-400/70' /> Dashboard</Link>
                                        <Link to='/tutor/bookings' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiCalendar className='text-yellow-400/70' /> My Bookings</Link>
                                        <div className='border-t border-slate-700 mt-1 pt-1'>
                                            <button onClick={onTutorLogout} className='flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 w-full text-sm rounded-lg mx-1'><FiLogOut /> Log Out</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile button */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className='lg:hidden text-slate-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-slate-800 transition-all'>
                            {mobileOpen ? <FiX className='text-xl' /> : <FiMenu className='text-xl' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className='lg:hidden border-t border-slate-700 py-3 space-y-0.5'>
                        {[
                            { to: '/', icon: <FiGrid />, label: 'Home' },
                            { to: '/courses', icon: <FiBook />, label: 'All Courses' },
                            { to: '/tutors', icon: <FiUsers />, label: 'Find Tutors' },
                            { to: '/about', icon: <FiAward />, label: 'About Us' },
                            { to: '/contact', icon: <FiUser />, label: 'Contact Us' },
                        ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                                className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg transition-all'>
                                <span className='text-yellow-400/70'>{item.icon}</span> {item.label}
                            </Link>
                        ))}

                        {isLoggedIn && (
                            <>
                                <div className='border-t border-slate-700 my-2' />
                                {[
                                    { to: '/dashboard', icon: <FiGrid />, label: 'My Dashboard' },
                                    { to: '/profile', icon: <FiUser />, label: 'My Profile' },
                                    { to: '/my-bookings', icon: <FiCalendar />, label: 'My Bookings' },
                                    { to: '/certificate', icon: <FiAward />, label: 'My Certificate' },
                                ].map(item => (
                                    <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                                        className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'>
                                        <span className='text-yellow-400/70'>{item.icon}</span> {item.label}
                                    </Link>
                                ))}
                                {role === 'ADMIN' && (
                                    <>
                                        <Link to='/admin/dashboard' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiSettings className='text-yellow-400/70' /> Admin Dashboard</Link>
                                        <Link to='/admin/users' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiUsers className='text-yellow-400/70' /> Manage Users</Link>
                                    </>
                                )}
                                <button onClick={onLogout} className='flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg w-full'><FiLogOut /> Log Out</button>
                            </>
                        )}

                        {isTutorLoggedIn && (
                            <>
                                <div className='border-t border-slate-700 my-2' />
                                <Link to='/tutor/dashboard' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiGrid className='text-yellow-400/70' /> Tutor Dashboard</Link>
                                <Link to='/tutor/bookings' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiCalendar className='text-yellow-400/70' /> My Bookings</Link>
                                <button onClick={onTutorLogout} className='flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg w-full'><FiLogOut /> Log Out</button>
                            </>
                        )}

                        {!isLoggedIn && !isTutorLoggedIn && (
                            <>
                                <div className='border-t border-slate-700 my-2' />
                                <div className='flex flex-col gap-2 px-4 pt-1 pb-2'>
                                    <Link to='/login' onClick={() => setMobileOpen(false)} className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-lg text-center text-sm'>Login</Link>
                                    <Link to='/signup' onClick={() => setMobileOpen(false)} className='border border-yellow-500/50 text-yellow-400 font-semibold py-2.5 rounded-lg text-center text-sm'>Sign Up</Link>
                                    <Link to='/tutor/login' onClick={() => setMobileOpen(false)} className='bg-slate-700 text-white font-semibold py-2.5 rounded-lg text-center text-sm'>Tutor Login</Link>
                                    <Link to='/tutor/signup' onClick={() => setMobileOpen(false)} className='border border-slate-600 text-slate-300 font-semibold py-2.5 rounded-lg text-center text-sm'>Become a Tutor</Link>
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
