import Cookies from 'js-cookie'
import { FiMenu } from 'react-icons/fi'
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
                <div className="p-5">
                    <label htmlFor="my-drawer-2" className="drawer-button cursor-pointer">
                        <FiMenu size={"30px"} />
                    </label>
                </div>
                <div className="drawer-side z-10">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 pt-12 gap-8 w-60 lg:w-80 min-h-full bg-base-200 text-base-content text-xl">

                        {/* Student profile */}
                        {isLoggedIn && (
                            <div className='rounded-full flex gap-4 items-center px-4 w-full'>
                                <img src={avatar} alt="profile photo" className='w-12 h-12 rounded-full' />
                                <p className='text-yellow-400 italic'>hello <br /> <span className='font-semibold capitalize text-white'>{firstName}</span></p>
                            </div>
                        )}

                        {/* Tutor profile */}
                        {isTutorLoggedIn && (
                            <div className='rounded-full flex gap-4 items-center px-4 w-full'>
                                <img src={tutorAvatar} alt="tutor photo" className='w-12 h-12 rounded-full' />
                                <p className='text-yellow-400 italic'>hello <br /> <span className='font-semibold capitalize text-white'>{tutorFirstName}</span></p>
                            </div>
                        )}

                        {/* Admin link */}
                        {isLoggedIn && role === 'ADMIN' && (
                            <li><Link to={'/admin/dashboard'}>Admin DashBoard</Link></li>
                        )}

                        {/* Tutor dashboard link */}
                        {isTutorLoggedIn && (
                            <li><Link to={'/tutor/dashboard'}>Tutor Dashboard</Link></li>
                        )}

                        {/* Common links */}
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to={'/courses'}>All Courses</Link></li>
                        <li><Link to={'/tutors'}>Find Tutors</Link></li>
                        <li><Link to={'/contact'}>Contact Us</Link></li>
                        <li><Link to={'/about'}>About Us</Link></li>

                        {/* Not logged in — show student + tutor options */}
                        {!isLoggedIn && !isTutorLoggedIn && (
                            <div className='w-full absolute bottom-4 px-4 left-0 flex flex-col gap-3 justify-center items-center'>
                                <p className='text-slate-400 text-sm'>Student</p>
                                <Link to={'/login'} className='w-full'>
                                    <button className='btn-primary py-2 w-full font-semibold rounded-md'>Login</button>
                                </Link>
                                <Link to={'/signup'} className='w-full'>
                                    <button className='btn-secondary py-2 w-full font-semibold rounded-md'>Sign Up</button>
                                </Link>
                                <p className='text-slate-400 text-sm mt-2'>Tutor</p>
                                <Link to={'/tutor/login'} className='w-full'>
                                    <button className='btn-primary py-2 w-full font-semibold rounded-md'>Tutor Login</button>
                                </Link>
                                <Link to={'/tutor/signup'} className='w-full'>
                                    <button className='btn-secondary py-2 w-full font-semibold rounded-md'>Become a Tutor</button>
                                </Link>
                            </div>
                        )}

                        {/* Student logged in */}
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link to={'/profile'} className='w-full'>Profile</Link>
                                </li>
                                <div onClick={onLogout} className='w-full absolute bottom-12 left-0 px-4'>
                                    <button className='btn-secondary py-2 w-full font-semibold rounded-md'>LogOut</button>
                                </div>
                            </>
                        )}

                        {/* Tutor logged in */}
                        {isTutorLoggedIn && (
                            <div onClick={onTutorLogout} className='w-full absolute bottom-12 left-0 px-4'>
                                <button className='btn-secondary py-2 w-full font-semibold rounded-md'>Tutor LogOut</button>
                            </div>
                        )}

                    </ul>
                </div>
            </div>
            {children}
            <Footer />
        </div>
    )
}

export default HomeLayout
