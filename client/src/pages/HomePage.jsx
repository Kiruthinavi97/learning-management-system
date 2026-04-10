import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiSearch, FiAward, FiStar, FiUsers, FiBook, FiCheckCircle } from "react-icons/fi"

import HomeImage from "../assets/Images/homeImage.png"
import option1 from '../assets/json/option1.json'
import Particle from "../components/Particle"
import HomeLayout from "../layouts/HomeLayout"

const stats = [
    { icon: <FiUsers className="text-3xl text-yellow-400" />, count: "10,000+", label: "Students Enrolled" },
    { icon: <FiBook className="text-3xl text-yellow-400" />, count: "50+", label: "Expert Courses" },
    { icon: <FiAward className="text-3xl text-yellow-400" />, count: "100%", label: "Certified Courses" },
    { icon: <FiStar className="text-3xl text-yellow-400" />, count: "4.8/5", label: "Average Rating" },
]

const reviews = [
    { name: "Ananya R.", rating: 5, course: "Full Stack Web Development", comment: "Amazing course! The instructor explains everything clearly. I got a job within 3 months of completing this course." },
    { name: "Karthik M.", rating: 5, course: "UI/UX Design", comment: "Best platform for learning design. The projects are practical and the feedback is very helpful." },
    { name: "Priya S.", rating: 4, course: "Full Stack Web Development", comment: "Very well structured course. The MERN stack section was especially helpful for my career switch." },
    { name: "Rahul T.", rating: 5, course: "UI/UX Design", comment: "I loved the hands-on approach. Got certified and immediately applied the skills at my workplace." },
]

const certificateFeatures = [
    "Industry-recognized certificates",
    "Shareable on LinkedIn & Resume",
    "Verified by our expert instructors",
    "Lifetime access to certificate",
    "Download in PDF format",
]

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    function handleSearch(e) {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate('/courses')
        }
    }

    return (
        <HomeLayout>
            <Particle option={option1} />

            {/* Hero Section */}
            <div className="min-h-screen flex lg:px-8 px-4 pb-8 lg:pb-0 flex-col lg:flex-row justify-around items-center">
                <div className="lg:px-4 md:px-4 space-y-8 lg:w-1/2">
                    <h1 className="lg:text-5xl text-2xl text-yellow-500 font-bold">
                        Ready To Reimagine Your Career
                        <span className="text-white font-semibold"> - Online Courses</span>
                    </h1>
                    <p className="text-gray-200 lg:text-xl tracking-wider">
                        We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex w-full max-w-xl">
                        <div className="flex w-full border-2 border-yellow-400 rounded-lg overflow-hidden bg-slate-900">
                            <div className="flex items-center px-4 text-yellow-400">
                                <FiSearch className="text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for courses, topics, skills..."
                                className="flex-1 py-3 bg-transparent text-white outline-none text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 transition-all">
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex gap-4 lg:flex-row md:flex-row items-center">
                        <Link to={'/courses'} className="w-fit">
                            <button className="rounded-md lg:w-48 md:w-48 w-36 py-2 lg:text-lg md:text-lg font-semibold bg-yellow-500 hover:bg-white hover:text-yellow-400 transition-all ease-in-out duration-300 text-black border-2 border-white hover:border-2 hover:border-yellow-400 cursor-pointer">
                                Explore Courses
                            </button>
                        </Link>
                        <Link to={'/contact'} className="w-fit">
                            <button className="rounded-md lg:w-48 md:w-48 w-36 py-2 lg:text-lg md:text-lg font-semibold bg-transparent text-white border-2 border-yellow-400 hover:border-2 hover:border-white cursor-pointer hover:bg-yellow-400 transition-all ease-in-out duration-300 hover:text-black">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
                <div>
                    <img src={HomeImage} alt="image" className="bg-transparent w-full h-full" />
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-900 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white mb-4">
                        Why Choose <span className="text-yellow-400">Our Platform?</span>
                    </h2>
                    <p className="text-slate-400 text-center mb-12">
                        Join thousands of learners who have transformed their careers
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-slate-800 rounded-xl p-6 flex flex-col items-center gap-3 text-center hover:border border-yellow-400 transition-all">
                                {stat.icon}
                                <h3 className="text-3xl font-bold text-white">{stat.count}</h3>
                                <p className="text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Certificate Section */}
            <div className="py-16 px-6 bg-slate-800">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

                    {/* Certificate Visual */}
                    <div className="lg:w-1/2 flex justify-center">
                        <div className="bg-slate-900 border-4 border-yellow-400 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl shadow-yellow-400/20">
                            <div className="flex justify-center mb-4">
                                <FiAward className="text-7xl text-yellow-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Certificate of Completion</h3>
                            <p className="text-slate-400 mb-4">This certifies that</p>
                            <p className="text-xl font-semibold text-yellow-400 mb-4">Your Name Here</p>
                            <p className="text-slate-400 mb-2">has successfully completed</p>
                            <p className="text-lg font-semibold text-white mb-6">Full Stack Web Development</p>
                            <div className="border-t border-slate-700 pt-4 flex justify-between text-sm text-slate-500">
                                <span>LMS Platform</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="lg:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-white">
                            Earn Industry-Recognized <span className="text-yellow-400">Certificates</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Complete any course and earn a verified certificate to showcase your skills to employers worldwide. Our certificates are recognized by top companies.
                        </p>
                        <ul className="space-y-3">
                            {certificateFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <FiCheckCircle className="text-yellow-400 text-xl flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to='/courses'>
                            <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg transition-all">
                                Start Learning & Get Certified
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Reviews / Ratings Section */}
            <div className="py-16 px-6 bg-slate-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white mb-4">
                        What Our <span className="text-yellow-400">Students Say</span>
                    </h2>
                    <p className="text-slate-400 text-center mb-12">
                        Real reviews from real learners
                    </p>

                    {/* Overall Rating */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="text-7xl font-bold text-yellow-400 mb-2">4.8</div>
                        <div className="flex gap-1 text-yellow-400 text-2xl mb-2">
                            {'★★★★★'}
                        </div>
                        <p className="text-slate-400">Based on 10,000+ student reviews</p>
                    </div>

                    {/* Review Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review, i) => (
                            <div key={i} className="bg-slate-800 rounded-xl p-6 hover:border border-yellow-400/50 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-white capitalize">{review.name}</h4>
                                        <p className="text-yellow-400 text-sm">{review.course}</p>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to='/courses'>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-3 rounded-lg transition-all text-lg">
                                Join 10,000+ Learners Today
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

        </HomeLayout>
    )
}

export default HomePage
