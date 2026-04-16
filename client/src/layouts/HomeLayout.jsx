import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function HomeLayout({ children }) {
    return (
        <div className='relative'>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export default HomeLayout