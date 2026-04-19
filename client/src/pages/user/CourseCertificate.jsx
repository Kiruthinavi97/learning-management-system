import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, Link } from 'react-router-dom'
import { FiAward, FiDownload, FiShare2, FiCheck, FiArrowLeft } from 'react-icons/fi'
import HomeLayout from '../../layouts/HomeLayout'

function CourseCertificate() {
    const { data: user } = useSelector((state) => state.auth)
    const location = useLocation()
    const certRef = useRef()
    const [copied, setCopied] = useState(false)

    const courseTitle = location.state?.courseTitle || 'Full Stack Web Development'
    const completionDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
    const certId = `LMS-${Date.now().toString(36).toUpperCase()}`

    function handlePrint() {
        window.print()
    }

    async function handleCopyLink() {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleLinkedIn() {
        const text = `I just completed "${courseTitle}" on LMS Platform! 🎓 #LearningAndDevelopment #OnlineLearning`
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`,
            '_blank'
        )
    }

    return (
        <HomeLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap');
                @media print {
                    body * { visibility: hidden; }
                    #certificate-print, #certificate-print * { visibility: visible; }
                    #certificate-print { position: fixed; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className='min-h-screen bg-slate-950 px-4 py-10 text-white'>
                <div className='max-w-4xl mx-auto'>

                    {/* Top Bar */}
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-8 no-print'>
                        <Link to='/courses' className='flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-all'>
                            <FiArrowLeft /> Back to Courses
                        </Link>
                        <div className='flex flex-wrap gap-3 justify-center'>
                            <button onClick={handleCopyLink}
                                className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm transition-all'>
                                {copied ? <><FiCheck className='text-green-400' /> Copied!</> : <><FiShare2 /> Copy Link</>}
                            </button>
                            <button onClick={handleLinkedIn}
                                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-all'>
                                Share on LinkedIn
                            </button>
                            <button onClick={handlePrint}
                                className='flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all'>
                                <FiDownload /> Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Certificate */}
                    <div id='certificate-print' ref={certRef}
                        className='relative bg-white rounded-2xl overflow-hidden shadow-2xl shadow-yellow-400/10'
                        style={{ fontFamily: "'Lato', sans-serif" }}>

                        {/* Gold top border */}
                        <div className='h-3 w-full' style={{ background: 'linear-gradient(90deg, #92400e, #eab308, #92400e)' }} />

                        {/* Subtle background pattern */}
                        <div className='absolute inset-3 border-2 border-yellow-200 rounded-xl pointer-events-none' />

                        <div className='relative px-8 md:px-16 py-12 text-gray-800'>

                            {/* Header */}
                            <div className='text-center mb-8'>
                                <div className='flex justify-center items-center gap-3 mb-4'>
                                    <div className='flex-1 h-px' style={{ background: 'linear-gradient(to right, transparent, #eab308)' }} />
                                    <FiAward className='text-5xl text-yellow-500' />
                                    <div className='flex-1 h-px' style={{ background: 'linear-gradient(to left, transparent, #eab308)' }} />
                                </div>
                                <p className='text-xs uppercase tracking-widest text-yellow-600 font-semibold mb-2'>
                                    LMS Platform
                                </p>
                                <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-1'
                                    style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Certificate
                                </h1>
                                <p className='text-sm uppercase tracking-widest text-gray-400'>
                                    of Completion
                                </p>
                            </div>

                            {/* Decorative divider */}
                            <div className='flex items-center gap-3 mb-8'>
                                <div className='flex-1 h-px bg-yellow-200' />
                                <div className='w-2 h-2 bg-yellow-400 rotate-45' />
                                <div className='w-1.5 h-1.5 bg-yellow-300 rotate-45' />
                                <div className='w-2 h-2 bg-yellow-400 rotate-45' />
                                <div className='flex-1 h-px bg-yellow-200' />
                            </div>

                            {/* Body */}
                            <div className='text-center space-y-5 mb-10'>
                                <p className='text-base text-gray-500'>This is to proudly certify that</p>

                                <div>
                                    <h2 className='text-4xl md:text-5xl font-bold text-yellow-600 capitalize'
                                        style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {user?.name || 'Student Name'}
                                    </h2>
                                    <div className='h-0.5 w-56 bg-yellow-400 mx-auto mt-2' />
                                </div>

                                <p className='text-base text-gray-500'>has successfully completed the course</p>

                                <div className='inline-block bg-yellow-50 border-2 border-yellow-200 rounded-xl px-8 py-4'>
                                    <h3 className='text-xl md:text-2xl font-bold text-gray-800 capitalize'
                                        style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {courseTitle}
                                    </h3>
                                </div>

                                <p className='text-sm text-gray-400 italic'>
                                    with dedication, commitment, and excellence
                                </p>
                            </div>

                            {/* Decorative divider */}
                            <div className='flex items-center gap-3 mb-8'>
                                <div className='flex-1 h-px bg-yellow-200' />
                                <div className='w-2 h-2 bg-yellow-400 rotate-45' />
                                <div className='w-1.5 h-1.5 bg-yellow-300 rotate-45' />
                                <div className='w-2 h-2 bg-yellow-400 rotate-45' />
                                <div className='flex-1 h-px bg-yellow-200' />
                            </div>

                            {/* Footer */}
                            <div className='flex justify-between items-end'>
                                <div className='text-center'>
                                    <div className='w-36 border-t-2 border-gray-300 pt-2 mx-auto'>
                                        <p className='text-xs text-gray-400 uppercase tracking-wider'>Date Issued</p>
                                        <p className='text-sm font-semibold text-gray-700'>{completionDate}</p>
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <div className='w-14 h-14 rounded-full bg-yellow-50 border-2 border-yellow-400 flex items-center justify-center mx-auto mb-1'>
                                        <FiAward className='text-2xl text-yellow-500' />
                                    </div>
                                    <p className='text-xs text-gray-400'>Verified</p>
                                </div>
                                <div className='text-center'>
                                    <div className='w-36 border-t-2 border-gray-300 pt-2 mx-auto'>
                                        <p className='text-xs text-gray-400 uppercase tracking-wider'>Certificate ID</p>
                                        <p className='text-sm font-semibold text-gray-700'>{certId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gold bottom border */}
                        <div className='h-3 w-full' style={{ background: 'linear-gradient(90deg, #92400e, #eab308, #92400e)' }} />
                    </div>

                    {/* Feature cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 no-print'>
                        <div className='bg-slate-800 rounded-xl p-5 text-center border border-slate-700 hover:border-yellow-400/50 transition-all'>
                            <FiAward className='text-3xl text-yellow-400 mx-auto mb-2' />
                            <p className='font-semibold text-white mb-1'>Industry Recognized</p>
                            <p className='text-slate-400 text-sm'>Accepted by top companies worldwide</p>
                        </div>
                        <div className='bg-slate-800 rounded-xl p-5 text-center border border-slate-700 hover:border-blue-400/50 transition-all'>
                            <FiShare2 className='text-3xl text-blue-400 mx-auto mb-2' />
                            <p className='font-semibold text-white mb-1'>Share on LinkedIn</p>
                            <p className='text-slate-400 text-sm'>Add to your professional profile</p>
                        </div>
                        <div className='bg-slate-800 rounded-xl p-5 text-center border border-slate-700 hover:border-green-400/50 transition-all'>
                            <FiDownload className='text-3xl text-green-400 mx-auto mb-2' />
                            <p className='font-semibold text-white mb-1'>Download Anytime</p>
                            <p className='text-slate-400 text-sm'>Lifetime access to your certificate</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className='text-center mt-8 no-print'>
                        <p className='text-slate-400 mb-4'>Keep growing your skills!</p>
                        <Link to='/courses'
                            className='inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-3 rounded-lg transition-all'>
                            Continue Learning →
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CourseCertificate