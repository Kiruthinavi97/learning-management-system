import { useState } from 'react'
import { BsCloudUpload, BsEnvelope, BsLock, BsPerson, BsBook, BsCurrencyDollar } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Particle from '../../components/Particle'
import option3 from '../../assets/json/option3.json'
import HomeLayout from '../../layouts/HomeLayout'
import { tutorSignup } from '../../Redux/slices/tutorSlice'

function TutorSignUp() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [viewImage, setViewImage] = useState("")

    const [signUpData, setSignUpData] = useState({
        avatar: "",
        name: "",
        email: "",
        password: "",
        subject: "",
        qualifications: "",
        experience: "",
        hourlyRate: "",
        bio: "",
        expertise: ""
    })

    function handleUserInput(e) {
        const { name, value } = e.target
        setSignUpData({ ...signUpData, [name]: value })
    }

    function getImage(event) {
        event.preventDefault()
        const uploadedImage = event.target.files[0]
        if (uploadedImage) {
            setSignUpData({ ...signUpData, avatar: uploadedImage })
        }
        const fileReader = new FileReader()
        fileReader.readAsDataURL(uploadedImage)
        fileReader.addEventListener('load', function () {
            setViewImage(this.result)
        })
    }

    async function createAccount(event) {
        event.preventDefault()

        if (!signUpData.name || !signUpData.email || !signUpData.password ||
            !signUpData.subject || !signUpData.qualifications ||
            !signUpData.experience || !signUpData.hourlyRate) {
            toast.error("All required fields must be filled")
            return
        }

        const formData = new FormData()
        formData.append('avatar', signUpData.avatar)
        formData.append('name', signUpData.name)
        formData.append('email', signUpData.email)
        formData.append('password', signUpData.password)
        formData.append('subject', signUpData.subject)
        formData.append('qualifications', signUpData.qualifications)
        formData.append('experience', signUpData.experience)
        formData.append('hourlyRate', signUpData.hourlyRate)
        formData.append('bio', signUpData.bio)
        formData.append('expertise', signUpData.expertise)

        const response = await dispatch(tutorSignup(formData))
        if (response?.payload?.success) {
            navigate('/tutor/dashboard')
            setSignUpData({
                avatar: "", name: "", email: "", password: "",
                subject: "", qualifications: "", experience: "",
                hourlyRate: "", bio: "", expertise: ""
            })
            setViewImage("")
        }
    }

    return (
        <HomeLayout>
            <Particle option={option3} />
            <div className='flex flex-col gap-3 justify-center items-center min-h-screen py-10'>
                <form onSubmit={createAccount} className='lg:w-[500px] w-[90%] md:w-1/2 h-fit p-7 flex flex-col gap-4 justify-between rounded-md bg-white text-black shadow-md'>
                    <div>
                        <h1 className='text-3xl font-semibold mb-1'>Tutor Sign Up</h1>
                        <p className='text-slate-400 text-sm'>Create your tutor account to start teaching</p>
                    </div>
                    <hr className='border-t-2 border-slate-500' />

                    {/* Avatar Upload */}
                    <div className='flex items-center w-full gap-4'>
                        {viewImage ? (
                            <img src={viewImage} alt="photo" className='rounded-full w-14 h-14 hidden lg:block object-cover' />
                        ) : (
                            <label htmlFor="image" className='text-xl hidden lg:block md:block'><BsCloudUpload /></label>
                        )}
                        <input type="file" name='image' id='image' accept='.jpg, .jpeg, .png, .svg'
                            className="file-input file-input-bordered file-input-warning w-full text-white"
                            onChange={getImage} />
                    </div>

                    {/* Name */}
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label className='text-xl hidden lg:block text-yellow-500'><BsPerson /></label>
                        <input type="text" name='name' placeholder="Enter Your Name"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={signUpData.name} onChange={handleUserInput} />
                    </div>

                    {/* Email */}
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label className='text-xl hidden lg:block text-yellow-500'><BsEnvelope /></label>
                        <input type="email" name='email' placeholder="Enter Your Email"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={signUpData.email} onChange={handleUserInput} />
                    </div>

                    {/* Password */}
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label className='text-xl hidden lg:block text-yellow-500'><BsLock /></label>
                        <input type="password" name='password' placeholder="Enter Password"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={signUpData.password} onChange={handleUserInput} />
                    </div>

                    {/* Subject */}
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label className='text-xl hidden lg:block text-yellow-500'><BsBook /></label>
                        <input type="text" name='subject' placeholder="Main Subject (e.g. Mathematics)"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={signUpData.subject} onChange={handleUserInput} />
                    </div>

                    {/* Expertise */}
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <input type="text" name='expertise' placeholder="Expertise (comma separated: React, Node, MongoDB)"
                            className="py-2 border-0 outline-0 text-lg text-white bg-transparent w-full"
                            value={signUpData.expertise} onChange={handleUserInput} />
                    </div>

                    {/* Qualifications */}
                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <input type="text" name='qualifications' placeholder="Qualifications (e.g. B.Tech, M.Sc)"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={signUpData.qualifications} onChange={handleUserInput} />
                    </div>

                    {/* Experience & Rate */}
                    <div className='flex gap-4'>
                        <div className='flex items-center w-full gap-2 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                            <input type="number" name='experience' placeholder="Years of Experience"
                                className="py-2 border-0 outline-0 text-lg text-white bg-transparent w-full"
                                value={signUpData.experience} onChange={handleUserInput} />
                        </div>
                        <div className='flex items-center w-full gap-2 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                            <label className='text-xl hidden lg:block text-yellow-500'><BsCurrencyDollar /></label>
                            <input type="number" name='hourlyRate' placeholder="Hourly Rate"
                                className="py-2 border-0 outline-0 text-lg text-white bg-transparent w-full"
                                value={signUpData.hourlyRate} onChange={handleUserInput} />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className='border-2 border-yellow-500 px-4 rounded-lg bg-slate-900'>
                        <textarea name='bio' placeholder="Short bio about yourself..."
                            className="py-3 border-0 outline-0 text-lg text-white bg-transparent w-full resize-none"
                            rows={3} value={signUpData.bio} onChange={handleUserInput} />
                    </div>

                    <button type='submit' className='btn btn-primary w-full'>Create Tutor Account</button>
                </form>
                <p className='text-xl text-white'>
                    Already have an account? <Link to='/tutor/login' className='text-2xl text-blue-500 hover:underline'>Login</Link>
                </p>
                <p className='text-lg text-white'>
                    Are you a student? <Link to='/signup' className='text-xl text-yellow-400 hover:underline'>Student Signup</Link>
                </p>
            </div>
        </HomeLayout>
    )
}

export default TutorSignUp
