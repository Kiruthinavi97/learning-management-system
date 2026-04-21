import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { FiSearch, FiChevronDown, FiMenu, FiX, FiUser, FiLogOut, FiBook, FiUsers, FiAward, FiCalendar, FiSettings, FiGrid, FiBell, FiStar, FiPlay, FiInfo, FiMail, FiHelpCircle, FiFileText, FiBarChart2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn)
    const role = useSelector((state) => state?.auth?.role)
    const avatar = useSelector((state) => state?.auth?.data?.avatar?.secure_url)
    const name = useSelector((state) => state?.auth?.data?.name)
    const subscription = useSelector((state) => state?.auth?.data?.subscription)
    const subscribedCourses = subscription?.courses?.filter(c => c.status === 'active') || []
    const hasAnyCourse = subscribedCourses.length > 0

    const isTutorLoggedIn = useSelector((state) => state?.tutor?.isLoggedIn)
    const tutorAvatar = useSelector((state) => state?.tutor?.data?.avatar?.secure_url)
    const tutorName = useSelector((state) => state?.tutor?.data?.name)

    useEffect(() => {
        setMobileOpen(false)
        setActiveDropdown(null)
        setShowNotifications(false)
    }, [location.pathname])

    function isActive(path) { return location.pathname === path }

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

    const notifications = [
        { icon: <FiBook className='text-yellow-400' />, text: 'New course available: React Advanced', time: '2h ago' },
        { icon: <FiStar className='text-green-400' />, text: 'Your review helped 5 students', time: '1d ago' },
        { icon: <FiCalendar className='text-blue-400' />, text: 'Lesson reminder for tomorrow', time: '1d ago' },
    ]

    // Mega dropdown configs
    const megaMenus = {
        Courses: {
            sections: [
                {
                    title: 'Learn',
                    items: [
                        { label: 'All Courses', to: '/courses', icon: <FiBook />, desc: 'Browse full library' },
                        { label: 'Find Tutors', to: '/tutors', icon: <FiUsers />, desc: 'Connect with experts' },
                    ]
                },
                {
                    title: 'Quick Links',
                    items: [
                        { label: 'My Dashboard', to: '/dashboard', icon: <FiGrid />, desc: 'Your learning progress' },
                        { label: 'My Bookings', to: '/my-bookings', icon: <FiCalendar />, desc: 'Scheduled lessons' },
                    ]
                }
            ]
        },
        Resources: {
            sections: [
                {
                    title: 'Learn More',
                    items: [
                        { label: 'Blog', to: '/about', icon: <FiFileText />, desc: 'Tips and insights' },
                        { label: 'Help Center', to: '/contact', icon: <FiHelpCircle />, desc: 'Get support' },
                        { label: 'ROI Calculator', to: '/about', icon: <FiBarChart2 />, desc: 'Measure your returns' },
                    ]
                },
                {
                    title: 'Platform',
                    items: [
                        { label: 'Request a Demo', to: '/demo', icon: <FiPlay />, desc: 'See it in action' },
                        { label: 'Contact Us', to: '/contact', icon: <FiMail />, desc: 'Reach our team' },
                    ]
                }
            ],
            featured: {
                title: 'Start Learning Today',
                desc: 'Join 10,000+ students already learning on LearnSphere',
                cta: 'Get Started Free',
                to: '/signup'
            }
        },
        About: {
            sections: [
                {
                    title: 'Company',
                    items: [
                        { label: 'About Us', to: '/about', icon: <FiInfo />, desc: 'Our story & mission' },
                        { label: 'Contact Us', to: '/contact', icon: <FiMail />, desc: 'Get in touch' },
                        { label: 'Awards & Recognition', to: '/about', icon: <FiAward />, desc: 'Our achievements' },
                    ]
                }
            ],
            featured: {
                title: 'Customer Success',
                desc: 'Meet the team responsible for a 96% satisfaction rate',
                cta: 'Read More',
                to: '/about'
            }
        }
    }

    function MegaMenu({ menuKey }) {
        const menu = megaMenus[menuKey]
        if (!menu) return null
        return (
            <div className='absolute top-full left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-6 px-6 mt-1 min-w-[600px] flex gap-8'>
                {menu.sections.map((section, si) => (
                    <div key={si} className='flex-1'>
                        <p className='text-slate-500 text-xs uppercase tracking-widest mb-3 font-semibold'>{section.title}</p>
                        <div className='flex flex-col gap-1'>
                            {section.items.map((item) => (
                                <Link key={item.label} to={item.to}
                                    className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-slate-700 ${isActive(item.to) ? 'bg-slate-700 text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                                    <div className='bg-slate-700 group-hover:bg-yellow-400/20 p-2 rounded-lg flex-shrink-0 text-yellow-400/70 mt-0.5'>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className='font-medium text-sm'>{item.label}</p>
                                        <p className='text-xs text-slate-500'>{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
                {menu.featured && (
                    <div className='w-48 bg-slate-700/50 rounded-xl p-4 flex flex-col justify-between border border-slate-600'>
                        <div>
                            <p className='text-white font-semibold text-sm mb-2'>{menu.featured.title}</p>
                            <p className='text-slate-400 text-xs leading-relaxed'>{menu.featured.desc}</p>
                        </div>
                        <Link to={menu.featured.to}
                            className='mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs py-2 px-3 rounded-lg text-center transition-all'>
                            {menu.featured.cta} →
                        </Link>
                    </div>
                )}
            </div>
        )
    }

    return (
        <nav className='bg-slate-900 border-b border-slate-700/60 sticky top-0 z-50'>
            {/* Promo bar */}
            {isLoggedIn && !hasAnyCourse && role !== 'ADMIN' && (
                <div className='bg-yellow-500 text-black text-center py-1.5 text-xs font-semibold flex items-center justify-center gap-3'>
                    <FiStar />
                    <span>Enroll in any course for just ₹499!</span>
                    <Link to='/courses' className='underline font-bold hover:text-slate-800'>Browse Courses →</Link>
                </div>
            )}

            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>

                    {/* Logo */}
                    <Link to='/' className='flex items-center gap-2.5 flex-shrink-0'>
                        <LMSLogo />
                        <div className='leading-tight'>
                            <span className='text-white font-bold text-lg tracking-tight'>Learn<span className='text-yellow-400'>Sphere</span></span>
                            <p className='text-slate-500 text-xs hidden lg:block leading-none'>Online Learning Platform</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className='hidden lg:flex items-center gap-1'>
                        <Link to='/' className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'text-yellow-400 bg-slate-800' : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-800'}`}>
                            Home
                        </Link>

                        {['Courses', 'Resources', 'About'].map((menuKey) => (
                            <div key={menuKey} className='relative'
                                onMouseEnter={() => setActiveDropdown(menuKey)}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 ${activeDropdown === menuKey ? 'text-yellow-400 bg-slate-800' : 'text-slate-300 hover:text-yellow-400'}`}>
                                    {menuKey}
                                    <FiChevronDown className={`text-xs transition-transform duration-200 ${activeDropdown === menuKey ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === menuKey && <MegaMenu menuKey={menuKey} />}
                            </div>
                        ))}

                        {isLoggedIn && role === 'ADMIN' && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('admin')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 ${activeDropdown === 'admin' ? 'text-yellow-400 bg-slate-800' : 'text-slate-300'}`}>
                                    Admin <FiChevronDown className={`text-xs transition-transform ${activeDropdown === 'admin' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'admin' && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-52 mt-1'>
                                        <Link to='/admin/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiSettings className='text-yellow-400/70' /> Dashboard</Link>
                                        <Link to='/admin/users' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiUsers className='text-yellow-400/70' /> Manage Users</Link>
                                        <Link to='/admin/subscribers' className='flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 text-sm rounded-lg mx-1'><FiBook className='text-yellow-400/70' /> Subscribers</Link>
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
                                    Tutor <FiChevronDown className={`text-xs transition-transform ${activeDropdown === 'tutor' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'tutor' && (
                                    <div className='absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-52 mt-1'>
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
                                        className='bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg text-sm outline-none focus:border-yellow-400 w-48'
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <button type='button' onClick={() => setSearchOpen(false)} className='text-slate-400 hover:text-white p-1'><FiX /></button>
                                </form>
                            ) : (
                                <button onClick={() => setSearchOpen(true)} className='text-slate-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-slate-800 transition-all'>
                                    <FiSearch className='text-lg' />
                                </button>
                            )}
                        </div>

                        {/* Bell */}
                        {(isLoggedIn || isTutorLoggedIn) && (
                            <div className='relative'>
                                <button onClick={() => setShowNotifications(!showNotifications)}
                                    className='relative text-slate-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-slate-800 transition-all'>
                                    <FiBell className='text-lg' />
                                    <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full'></span>
                                </button>
                                {showNotifications && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 w-80 mt-1'>
                                        <div className='px-4 py-2 border-b border-slate-700 flex justify-between mb-1'>
                                            <p className='text-white font-semibold text-sm'>Notifications</p>
                                            <span className='text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full'>{notifications.length} new</span>
                                        </div>
                                        {notifications.map((n, i) => (
                                            <div key={i} className='flex items-start gap-3 px-4 py-3 hover:bg-slate-700 rounded-lg mx-1 cursor-pointer'>
                                                <div className='mt-0.5 flex-shrink-0'>{n.icon}</div>
                                                <div><p className='text-slate-300 text-xs'>{n.text}</p><p className='text-slate-500 text-xs mt-0.5'>{n.time}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        
                       {/* Guest */}
            {!isLoggedIn && !isTutorLoggedIn && (
                <div className='hidden lg:flex items-center gap-2'>
                <Link to='/login'
                    className='text-slate-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium hover:bg-slate-800 rounded-lg'>
                     Login
                    </Link>
                    <Link to='/tutor/login'
                    className='text-slate-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium hover:bg-slate-800 rounded-lg'>
                    Tutor Login
                </Link>
                <Link to='/signup'
                    className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm'>
                    Get Started Free
                </Link>
                <Link to='/tutor/signup'
                    className='border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black font-semibold px-4 py-2 rounded-lg text-sm'>
                    Become a Tutor
                </Link>
                </div>
)}

                        {/* Student */}
                        {isLoggedIn && (
                            <div className='relative'
                                onMouseEnter={() => setActiveDropdown('profile')}
                                onMouseLeave={() => setActiveDropdown(null)}>
                                <button className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl transition-all border border-slate-700'>
                                    <img src={avatar} className='w-7 h-7 rounded-full object-cover ring-2 ring-yellow-400/50' />
                                    <div className='hidden lg:block text-left'>
                                        <p className='text-white text-xs font-medium capitalize leading-tight'>{name?.split(' ')[0]}</p>
                                        <p className={`text-xs leading-tight ${role === 'ADMIN' ? 'text-purple-400' : hasAnyCourse ? 'text-yellow-400' : 'text-slate-400'}`}>
                                            {role === 'ADMIN' ? '👑 Admin' : hasAnyCourse ? '⭐ Enrolled' : 'Free'}
                                        </p>
                                    </div>
                                    <FiChevronDown className={`text-slate-400 text-xs transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'profile' && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-60 mt-1'>
                                        <div className='px-4 py-3 border-b border-slate-700 mb-1'>
                                            <div className='flex items-center gap-3'>
                                                <img src={avatar} className='w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400/50' />
                                                <div>
                                                    <p className='text-white font-semibold text-sm capitalize'>{name}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : hasAnyCourse ? 'bg-yellow-400/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>
                                                        {role === 'ADMIN' ? '👑 Administrator' : hasAnyCourse ? `⭐ ${subscribedCourses.length} Course(s)` : '🔓 Free Member'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to='/dashboard' className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-1 ${isActive('/dashboard') ? 'text-yellow-400 bg-slate-700' : 'text-slate-300 hover:bg-slate-700 hover:text-yellow-400'}`}><FiGrid className='text-yellow-400/70' /> My Dashboard</Link>
                                        <Link to='/profile' className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-1 ${isActive('/profile') ? 'text-yellow-400 bg-slate-700' : 'text-slate-300 hover:bg-slate-700 hover:text-yellow-400'}`}><FiUser className='text-yellow-400/70' /> My Profile</Link>
                                        <Link to='/my-bookings' className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-1 ${isActive('/my-bookings') ? 'text-yellow-400 bg-slate-700' : 'text-slate-300 hover:bg-slate-700 hover:text-yellow-400'}`}><FiCalendar className='text-yellow-400/70' /> My Bookings</Link>
                                        <Link to='/certificate' className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-1 ${isActive('/certificate') ? 'text-yellow-400 bg-slate-700' : 'text-slate-300 hover:bg-slate-700 hover:text-yellow-400'}`}><FiAward className='text-yellow-400/70' /> My Certificate</Link>
                                        {!hasAnyCourse && role !== 'ADMIN' && (
                                            <div className='mx-1 my-1.5'>
                                                <Link to='/courses' className='flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg text-sm'>
                                                    <FiStar /> Browse Courses — ₹499
                                                </Link>
                                            </div>
                                        )}
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
                                    <div className='hidden lg:block text-left'>
                                        <p className='text-white text-xs font-medium capitalize leading-tight'>{tutorName?.split(' ')[0]}</p>
                                        <p className='text-blue-400 text-xs leading-tight'>🎓 Tutor</p>
                                    </div>
                                    <FiChevronDown className={`text-slate-400 text-xs transition-transform ${activeDropdown === 'tutorProfile' ? 'rotate-180' : ''}`} />
                                </button>
                                {activeDropdown === 'tutorProfile' && (
                                    <div className='absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 w-52 mt-1'>
                                        <div className='px-4 py-3 border-b border-slate-700 mb-1'>
                                            <p className='text-white font-semibold text-sm capitalize'>{tutorName}</p>
                                            <span className='text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400'>🎓 Tutor</span>
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

                        <button onClick={() => setMobileOpen(!mobileOpen)} className='lg:hidden text-slate-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-slate-800'>
                            {mobileOpen ? <FiX className='text-xl' /> : <FiMenu className='text-xl' />}
                        </button>
                    </div>
                </div>

                {/* Mobile */}
                {mobileOpen && (
                    <div className='lg:hidden border-t border-slate-700 py-3 space-y-0.5 max-h-[80vh] overflow-y-auto'>
                        {[
                            { to: '/', icon: <FiGrid />, label: 'Home' },
                            { to: '/courses', icon: <FiBook />, label: 'All Courses' },
                            { to: '/tutors', icon: <FiUsers />, label: 'Find Tutors' },
                            { to: '/demo', icon: <FiPlay />, label: 'Request Demo' },
                            { to: '/about', icon: <FiInfo />, label: 'About Us' },
                            { to: '/contact', icon: <FiMail />, label: 'Contact Us' },
                        ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.to) ? 'text-yellow-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800 hover:text-yellow-400'}`}>
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
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.to) ? 'text-yellow-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800 hover:text-yellow-400'}`}>
                                        <span className='text-yellow-400/70'>{item.icon}</span> {item.label}
                                    </Link>
                                ))}
                                {role === 'ADMIN' && (
                                    <>
                                        <Link to='/admin/dashboard' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiSettings className='text-yellow-400/70' /> Admin Dashboard</Link>
                                        <Link to='/admin/users' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiUsers className='text-yellow-400/70' /> Manage Users</Link>
                                        <Link to='/admin/subscribers' onClick={() => setMobileOpen(false)} className='flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 rounded-lg'><FiBook className='text-yellow-400/70' /> Subscribers</Link>
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
                                <div className='flex flex-col gap-2 px-4 pb-2'>
                                    <Link to='/signup' onClick={() => setMobileOpen(false)} className='bg-yellow-500 text-black font-semibold py-2.5 rounded-lg text-center text-sm'>Get Started Free</Link>
                                    <Link to='/login' onClick={() => setMobileOpen(false)} className='border border-yellow-500/50 text-yellow-400 font-semibold py-2.5 rounded-lg text-center text-sm'>Login</Link>
                                    <Link to='/demo' onClick={() => setMobileOpen(false)} className='bg-slate-700 text-white font-semibold py-2.5 rounded-lg text-center text-sm'>Request Demo</Link>
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
