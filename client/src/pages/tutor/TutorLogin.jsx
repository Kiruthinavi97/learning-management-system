import { useState } from 'react'
import { BsEnvelope, BsLock } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Particle from '../../components/Particle'
import option3 from '../../assets/json/option3.json'
import HomeLayout from '../../layouts/HomeLayout'
import { tutorLogin } from '../../Redux/slices/tutorSlice'

function TutorLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    function handleUserInput(e) {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    async function handleLogin(event) {
        event.preventDefault()
        const response = await dispatch(tutorLogin(loginData))
        if (response?.payload?.success) {
            navigate('/tutor/dashboard')
            setLoginData({ email: "", password: "" })
        }
    }

    return (
        <HomeLayout>
            <Particle option={option3} />
            <div className='flex flex-col gap-3 justify-center items-center h-screen'>
                <form onSubmit={handleLogin} className='lg:w-[450px] w-[90%] md:w-1/2 h-fit p-7 flex flex-col gap-5 justify-between rounded-md bg-white text-black shadow-md'>
                    <div>
                        <h1 className='text-3xl font-semibold mb-3'>Tutor Login</h1>
                        <p className='text-slate-400'>Welcome back! Please login to your tutor account</p>
                    </div>
                    <hr className='border-t-2 border-slate-500' />

                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label className='text-xl hidden lg:block text-yellow-500'><BsEnvelope /></label>
                        <input type="email" name='email' placeholder="Enter Your Email"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={loginData.email} onChange={handleUserInput} />
                    </div>

                    <div className='flex items-center w-full gap-4 border-2 border-yellow-500 px-4 rounded-lg h-14 bg-slate-900'>
                        <label className='text-xl hidden lg:block text-yellow-500'><BsLock /></label>
                        <input type="password" name='password' placeholder="Enter Password"
                            className="py-2 border-0 outline-0 text-xl text-white bg-transparent w-full"
                            value={loginData.password} onChange={handleUserInput} />
                    </div>

                    <button type='submit' className='btn btn-primary w-full'>Login</button>
                </form>
                <p className='text-xl text-white'>
                    Don't have an account? <Link to='/tutor/signup' className='text-2xl text-blue-500 hover:underline'>Sign Up</Link>
                </p>
                <p className='text-lg text-white'>
                    Are you a student? <Link to='/login' className='text-xl text-yellow-400 hover:underline'>Student Login</Link>
                </p>
            </div>
        </HomeLayout>
    )
}

export default TutorLogin
