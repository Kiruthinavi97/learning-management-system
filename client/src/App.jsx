import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import About from './pages/About';
import LogIn from './pages/auth/LogIn';
import RequiredAuth from './pages/auth/RequiredAuth';
import SignUp from './pages/auth/SignUp';
import UnprotectedRoute from './pages/auth/UnprotectedRoute';
import Contact from './pages/Contact';
import CourseDescription from './pages/course/CourseDescription';
import CourseList from './pages/course/CourseList';
import CreateCourse from './pages/course/CreateCourse';
import EditCourse from './pages/course/EditCourse';
import AddCourseLecture from './pages/dashboard/AddCourseLecture';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminUsers from './pages/dashboard/AdminUsers';
import CourseLectures from './pages/dashboard/CourseLectures';
import EditCourseLecture from './pages/dashboard/EditCourseLecture';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ChangePassword from './pages/password/ChangePassword';
import ResetPassword from './pages/password/ResetPassword';
import Checkout from './pages/payments/Checkout';
import CheckoutFail from './pages/payments/CheckoutFail';
import CheckoutSuccess from './pages/payments/CheckoutSuccess';
import MyBookings from './pages/user/MyBookings';
import Profile from './pages/user/Profile';
import BrowseTutors from './pages/tutor/BrowseTutors';
import TutorBookings from './pages/tutor/TutorBookings';
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorLogin from './pages/tutor/TutorLogin';
import TutorProfile from './pages/tutor/TutorProfile';
import TutorSignUp from './pages/tutor/TutorSignUp';

function App() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const titles = {
      '/': 'Learning Management System',
      '/about': 'About - LMS',
      '/contact': 'Contact - LMS',
      '/signup': 'Sign Up - LMS',
      '/login': 'Log In - LMS',
      '/courses': 'All Courses - LMS',
      '/tutors': 'Find Tutors - LMS',
      '/course/description': 'Course Description - LMS',
      '/course/create': 'Create Course - LMS',
      '/admin/dashboard': 'Admin Dashboard - LMS',
      '/admin/users': 'User Management - LMS',
      '/profile': 'Profile - LMS',
      '/profile/changePassword': 'Change Password - LMS',
      '/my-bookings': 'My Bookings - LMS',
      '/tutor/signup': 'Tutor Sign Up - LMS',
      '/tutor/login': 'Tutor Login - LMS',
      '/tutor/dashboard': 'Tutor Dashboard - LMS',
      '/tutor/bookings': 'Tutor Bookings - LMS',
    };

    if (path.includes('/course/') && path.includes('/editCourse')) {
      document.title = 'Edit Course - LMS';
    } else if (path.includes('/lectures/addlecture')) {
      document.title = 'Add Lecture - LMS';
    } else if (path.includes('/lectures/editlecture')) {
      document.title = 'Edit Lecture - LMS';
    } else if (path.includes('/checkout/success')) {
      document.title = 'Checkout Success - LMS';
    } else if (path.includes('/checkout/fail')) {
      document.title = 'Checkout Fail - LMS';
    } else if (path.includes('/checkout')) {
      document.title = 'Checkout - LMS';
    } else if (titles[path]) {
      document.title = titles[path];
    } else {
      document.title = 'Learning Management System';
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route path='/' element={<HomePage />} />

      {/* Unprotected - redirect if already logged in */}
      <Route element={<UnprotectedRoute />}>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/tutor/signup' element={<TutorSignUp />} />
        <Route path='/tutor/login' element={<TutorLogin />} />
      </Route>

      {/* Public routes */}
      <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/courses' element={<CourseList />} />
      <Route path='/course/description' element={<CourseDescription />} />
      <Route path='/tutors' element={<BrowseTutors />} />
      <Route path='/tutor/:id' element={<TutorProfile />} />

      {/* Tutor routes */}
      <Route path='/tutor/dashboard' element={<TutorDashboard />} />
      <Route path='/tutor/bookings' element={<TutorBookings />} />

      {/* Admin only routes */}
      <Route element={<RequiredAuth allowedRole={['ADMIN']} />}>
        <Route path='/course/create' element={<CreateCourse />} />
        <Route path='/course/:name/:id/editCourse' element={<EditCourse />} />
        <Route path='/course/:name/:id/lectures/addlecture' element={<AddCourseLecture />} />
        <Route path='/course/:name/:id/lectures/editlecture' element={<EditCourseLecture />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/users' element={<AdminUsers />} />
      </Route>

      {/* Student protected routes */}
      <Route element={<RequiredAuth allowedRole={['ADMIN', 'USER']} />}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/changePassword' element={<ChangePassword />} />
        <Route path='/course/:name/checkout' element={<Checkout />} />
        <Route path='/course/:name/checkout/success' element={<CheckoutSuccess />} />
        <Route path='/course/:name/checkout/fail' element={<CheckoutFail />} />
        <Route path='/course/:name/:id/lectures' element={<CourseLectures />} />
        <Route path='/my-bookings' element={<MyBookings />} />
      </Route>

    </Routes>
  );
}

export default App;
