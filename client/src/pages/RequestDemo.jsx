import { useState } from 'react'
import { toast } from 'react-toastify'
import { FiCheck, FiUsers, FiBook, FiAward, FiPlay } from 'react-icons/fi'
import axiosInstance from '../Helpers/axiosInstance'
import HomeLayout from '../layouts/HomeLayout'

const features = [
    { icon: <FiBook />, title: 'Course Management', desc: 'Create and manage courses with ease' },
    { icon: <FiUsers />, title: 'Tutor Profiles', desc: 'Connect students with expert tutors' },
    { icon: <FiAward />, title: 'Certificates', desc: 'Issue verified completion certificates' },
    { icon: <FiPlay />, title: 'Video Lectures', desc: 'Stream HD video content seamlessly' },
]

function RequestDemo() {
    const [form, setForm] = useState({
        name: '', email: '', company: '', phone: '', teamSize: '', message: ''
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.name || !form.email) {
            toast.error('Name and email are required')
            return
        }
        setLoading(true)
        try {
            await axiosInstance.post('/api/v1/contactus', {
                name: form.name,
                email: form.email,
                message: `Demo Request\nCompany: ${form.company}\nPhone: ${form.phone}\nTeam Size: ${form.teamSize}\nMessage: ${form.message}`
            })
            setSubmitted(true)
            toast.success('Demo request sent successfully!')
        } catch {
            toast.error('Failed to send request. Please try again.')
        }
        setLoading(false)
    }

    return (
        <HomeLayout>
            <div className='min-h-screen text-white'>

                {/* Hero */}
                <div className='bg-gradient-to-b from-slate-800 to-slate-900 py-16 px-6 text-center'>
                    <span className='bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block'>
                        Free Demo
                    </span>
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                        See <span className='text-yellow-400'>LearnSphere</span> in Action
                    </h1>
                    <p className='text-slate-400 text-lg max-w-2xl mx-auto'>
                        Get a personalized walkthrough of our platform. See how LearnSphere can transform your learning experience.
                    </p>
                </div>

                <div className='max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12'>

                    {/* Left - Features */}
                    <div>
                        <h2 className='text-2xl font-bold mb-2'>What you'll see in the demo</h2>
                        <p className='text-slate-400 mb-8'>A 30-minute personalized walkthrough covering everything you need.</p>

                        <div className='flex flex-col gap-4 mb-10'>
                            {features.map((f, i) => (
                                <div key={i} className='flex items-start gap-4 bg-slate-800 rounded-xl p-4 border border-slate-700'>
                                    <div className='bg-yellow-500/20 text-yellow-400 p-3 rounded-lg flex-shrink-0 text-xl'>
                                        {f.icon}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-white'>{f.title}</p>
                                        <p className='text-slate-400 text-sm'>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className='bg-slate-800 rounded-xl p-6 border border-yellow-400/20'>
                            <p className='text-slate-300 italic mb-4'>
                                "LearnSphere transformed how we onboard and train our team. The tutor booking system is exceptional!"
                            </p>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold'>A</div>
                                <div>
                                    <p className='text-white font-semibold text-sm'>Ananya R.</p>
                                    <p className='text-slate-400 text-xs'>HR Manager, TechCorp</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Form */}
                    <div>
                        {submitted ? (
                            <div className='bg-slate-800 rounded-2xl p-10 text-center border border-green-500/30'>
                                <div className='bg-green-500/20 p-5 rounded-full w-fit mx-auto mb-4'>
                                    <FiCheck className='text-5xl text-green-400' />
                                </div>
                                <h3 className='text-2xl font-bold text-white mb-2'>Request Received!</h3>
                                <p className='text-slate-400'>We'll reach out within 24 hours to schedule your personalized demo.</p>
                            </div>
                        ) : (
                            <div className='bg-slate-800 rounded-2xl p-8 border border-slate-700'>
                                <h3 className='text-xl font-bold mb-6'>Book Your Free Demo</h3>
                                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='text-slate-400 text-sm mb-1 block'>Full Name *</label>
                                            <input type='text' name='name' required
                                                className='w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-yellow-400 transition-all'
                                                placeholder='John Doe'
                                                value={form.name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className='text-slate-400 text-sm mb-1 block'>Work Email *</label>
                                            <input type='email' name='email' required
                                                className='w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-yellow-400 transition-all'
                                                placeholder='john@company.com'
                                                value={form.email} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='text-slate-400 text-sm mb-1 block'>Company</label>
                                            <input type='text' name='company'
                                                className='w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-yellow-400 transition-all'
                                                placeholder='Company Name'
                                                value={form.company} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className='text-slate-400 text-sm mb-1 block'>Phone</label>
                                            <input type='tel' name='phone'
                                                className='w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-yellow-400 transition-all'
                                                placeholder='+91 98765 43210'
                                                value={form.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-slate-400 text-sm mb-1 block'>Team Size</label>
                                        <select name='teamSize'
                                            className='w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-yellow-400 transition-all'
                                            value={form.teamSize} onChange={handleChange}>
                                            <option value=''>Select team size</option>
                                            <option value='1-10'>1-10 people</option>
                                            <option value='11-50'>11-50 people</option>
                                            <option value='51-200'>51-200 people</option>
                                            <option value='200+'>200+ people</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className='text-slate-400 text-sm mb-1 block'>What are you looking for?</label>
                                        <textarea name='message' rows={3}
                                            className='w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-yellow-400 transition-all resize-none'
                                            placeholder='Tell us about your learning goals...'
                                            value={form.message} onChange={handleChange} />
                                    </div>
                                    <button type='submit' disabled={loading}
                                        className='bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all'>
                                        {loading ? 'Sending...' : 'Request Free Demo →'}
                                    </button>
                                    <p className='text-slate-500 text-xs text-center'>
                                        No credit card required. We'll respond within 24 hours.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default RequestDemo
