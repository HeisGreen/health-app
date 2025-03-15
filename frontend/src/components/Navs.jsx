import 'react'
import { NavLink } from 'react-router-dom'

const Navs = () => {
  return (
    <div className='flex justify-between space-x-10 text-xl font-bold italic  text-teal-800'>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact-us">Contact Us</NavLink>
    </div>
  )
}

export default Navs