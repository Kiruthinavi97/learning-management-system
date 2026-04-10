import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FiUser, FiTrash2, FiShield } from 'react-icons/fi'
import axiosInstance from '../../Helpers/axiosInstance'
import HomeLayout from '../../layouts/HomeLayout'

function AdminUsers() {
    const [users, setUsers] = useState([])
    const [tutors, setTutors] = useState([])
    const [tab, setTab] = useState('students')
    const [loading, setLoading] = useState(true)

    async function fetchUsers() {
        try {
            const res = await axiosInstance.get('/api/v1/admin/users')
            setUsers(res.data.users || [])
        } catch {
            toast.error('Failed to load users')
        }
    }

    async function fetchTutors() {
        try {
            const res = await axiosInstance.get('/api/v1/tutor/all')
            setTutors(res.data.tutors || [])
        } catch {
            toast.error('Failed to load tutors')
        }
        setLoading(false)
    }

    async function deleteUser(id) {
        if (!window.confirm('Are you sure you want to delete this user?')) return
        try {
            await axiosInstance.delete(`/api/v1/admin/users/${id}`)
            toast.success('User deleted')
            fetchUsers()
        } catch {
            toast.error('Failed to delete user')
        }
    }

    async function toggleRole(id, currentRole) {
        try {
            const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
            await axiosInstance.put(`/api/v1/admin/users/${id}/role`, { role: newRole })
            toast.success(`Role updated to ${newRole}`)
            fetchUsers()
        } catch {
            toast.error('Failed to update role')
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchTutors()
    }, [])

    return (
        <HomeLayout>
            <div className='min-h-screen px-6 py-10 text-white max-w-6xl mx-auto'>
                <h1 className='text-3xl font-bold text-yellow-400 mb-2'>User Management</h1>
                <p className='text-slate-400 mb-6'>Manage all students and tutors</p>

                {/* Tabs */}
                <div className='flex gap-4 mb-6'>
                    <button onClick={() => setTab('students')}
                        className={`px-6 py-2 rounded-lg font-semibold ${tab === 'students' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}>
                        Students ({users.length})
                    </button>
                    <button onClick={() => setTab('tutors')}
                        className={`px-6 py-2 rounded-lg font-semibold ${tab === 'tutors' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}>
                        Tutors ({tutors.length})
                    </button>
                </div>

                {loading ? (
                    <p className='text-slate-400 text-center py-20'>Loading...</p>
                ) : (
                    <div className='bg-slate-800 rounded-xl overflow-hidden'>
                        <table className='w-full'>
                            <thead className='bg-slate-700'>
                                <tr>
                                    <th className='text-left px-6 py-4 text-slate-300'>User</th>
                                    <th className='text-left px-6 py-4 text-slate-300'>Email</th>
                                    <th className='text-left px-6 py-4 text-slate-300'>
                                        {tab === 'students' ? 'Role' : 'Subject'}
                                    </th>
                                    <th className='text-left px-6 py-4 text-slate-300'>Joined</th>
                                    <th className='text-left px-6 py-4 text-slate-300'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(tab === 'students' ? users : tutors).map((u) => (
                                    <tr key={u._id} className='border-t border-slate-700 hover:bg-slate-750'>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <img src={u?.avatar?.secure_url ||
                                                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                                                    className='w-9 h-9 rounded-full object-cover' />
                                                <span className='capitalize font-medium'>{u.name}</span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-slate-400 text-sm'>{u.email}</td>
                                        <td className='px-6 py-4'>
                                            {tab === 'students' ? (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                    ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {u.role}
                                                </span>
                                            ) : (
                                                <span className='text-yellow-400 text-sm'>{u.subject}</span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 text-slate-400 text-sm'>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                {tab === 'students' && (
                                                    <button onClick={() => toggleRole(u._id, u.role)}
                                                        title={u.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                                        className='p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 rounded-lg'>
                                                        <FiShield />
                                                    </button>
                                                )}
                                                <button onClick={() => deleteUser(u._id)}
                                                    className='p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg'>
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(tab === 'students' ? users : tutors).length === 0 && (
                            <p className='text-slate-400 text-center py-10'>No {tab} found.</p>
                        )}
                    </div>
                )}
            </div>
        </HomeLayout>
    )
}

export default AdminUsers
