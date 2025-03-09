import Navs from './Navs'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <div >
      <header className="bg-gradient-to-b sticky top-0 z-[20] mx-auto flex w-full h-[110px] items-center justify-between border-b border-gray-400 p-4">
      <Link to={"/dashboard"} className='flex space-x-1'>
      <img src="healthcare.svg" alt="spotify logo" className='w-16 h-16 '/>
      <img src="h-logoo.png" alt="logo" className='w-40 h-25'/>
      </Link>
      <Navs/>
      </header>
    </div>
  )
}

export default Navbar