import "chart.js/auto";
import { useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import { BsCurrencyRupee } from "react-icons/bs"; // Added for clean currency symbols
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { deleteCourse, getAllCourse } from "../../Redux/slices/courseslice";
import { getPaymentsRecord } from "../../Redux/slices/razorpayslice";
import { getStats } from "../../Redux/slices/statslice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUserCount, subscribedCount } = useSelector((state) => state.stat);
  const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);
  const Courses = useSelector((state) => state.course.courseData);

  useEffect(() => {
    (async () => {
      await dispatch(getAllCourse());
      await dispatch(getStats());
      await dispatch(getPaymentsRecord());
    })();
  }, [dispatch]);

  async function onDelete(id) {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const res = await dispatch(deleteCourse(id));
      if (res?.payload?.success) {
        await dispatch(getAllCourse());
      }
    }
  }

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    datasets: [
      {
        label: "User details",
        data: [allUserCount || 0, subscribedCount || 0],
        backgroundColor: ["#EAB308", "#22C55E"],
        borderWidth: 1,
      },
    ],
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: monthlySalesRecord || [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white", font: { size: 14 } } },
    },
  };

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 lg:pt-10 pt-5 mb-10 px-4 lg:px-16">
        <h1 className="font-bold text-3xl text-slate-500 text-center">Admin Dashboard</h1>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 h-80 flex justify-center">
            <Pie data={userData} options={chartOptions} />
          </div>
          <div className="md:col-span-8 h-80">
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Registered Users", icon: <FaUsers className="text-yellow-500" />, val: allUserCount },
            { label: "Subscribed Users", icon: <FaUsers className="text-green-500" />, val: subscribedCount },
            { label: "Total Bookings", icon: <FcSalesPerformance />, val: allPayments?.count || 0 },
            { label: "Total Revenue", icon: <GiMoneyStack className="text-green-500" />, val: (allPayments?.count || 0) * 499, isPrice: true }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-slate-400 font-semibold mb-2">{stat.label}</h2>
              <div className="flex items-center gap-3 text-3xl font-bold text-white">
                {stat.icon}
                <p className="flex items-center">
                  {stat.isPrice && <BsCurrencyRupee className="text-2xl" />}
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Course Overview Table */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-2xl text-slate-500">Course Overview</h2>
            <Link to="/course/create" className="btn btn-success btn-sm text-white">Create new course</Link>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="table w-full text-center bg-slate-900/50">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th>S No.</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Lectures</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Courses?.map((course, idx) => (
                  <tr key={course?._id} className="hover:bg-slate-800 transition-colors">
                    <td>{idx + 1}</td>
                    <td className="text-blue-400 font-medium cursor-pointer hover:underline" onClick={() => navigate(`/course/${course?.title}/${course?._id}/lectures`, { state: course })}>
                      {course?.title}
                    </td>
                    <td>{course?.category}</td>
                    <td>{course?.createdBy}</td>
                    <td>{course?.numberOfLectures}</td>
                    <td className="flex justify-center gap-4 text-xl">
                      <FiEdit className="text-blue-500 cursor-pointer hover:scale-110" onClick={() => navigate(`/course/${course?.title}/${course?._id}/editCourse`, { state: course })} />
                      <FiTrash2 className="text-red-500 cursor-pointer hover:scale-110" onClick={() => onDelete(course?._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New: Enrollment & Subscription History Table */}
        <div className="flex flex-col gap-6 mt-6">
          <h2 className="font-bold text-2xl text-slate-500 text-left">Enrollment History</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="table w-full text-center bg-slate-900/50">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th>S No.</th>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Tutor/Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allPayments?.records?.length > 0 ? (
                  allPayments.records.map((payment, idx) => (
                    <tr key={payment._id} className="hover:bg-slate-800 transition-colors">
                      <td>{idx + 1}</td>
                      <td className="font-semibold">{payment.studentName || payment.student?.name || "Unknown User"}</td>
                      <td className="text-slate-400 text-sm">{payment.studentEmail || payment.student?.email || "N/A"}</td>
                      <td>{payment.tutorName || "Standard Course"}</td>
                      <td className="text-green-500 font-bold flex items-center justify-center gap-1">
                        <BsCurrencyRupee /> {payment.amount || 499}
                      </td>
                      <td>
                        <div className={`badge badge-ghost font-bold ${payment.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {payment.paymentStatus || 'captured'}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="py-10 text-slate-500">No enrollment history found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default AdminDashboard;