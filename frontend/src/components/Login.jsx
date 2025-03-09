import 'react'
import { Link } from "react-router-dom";



const Login = () => {
    return (
        <div className="w-[310px] h-[410px] flex flex-col justify-between items-center bg-teal-800 rounded-lg border-2 border-white text-white shadow-lg shadow-lime-800/6-">
            <form className="h-52 w-full p-4 space-y-4 ">
                <input type="email" placeholder='Email' className="inputClasse" />
                <input type="password" placeholder='Password' className="inputClasse" />
            </form>
            <button className="h-[38px] w-44 bg-white text-teal-800 font-bold rounded hover:bg-orange-300 hover:text-white cursor-pointer">Login</button>
            <div className="flex space-x-15">
            <div className="mt-10">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm">Remember me</label>
            </div>
                <p className="text-sm text-blue-300 hover:text-orange-300 cursor-pointer"><Link>Forgot password?</Link></p>
            </div>
                <h3 className="w-full py-5 border-t-orange-400 border-t-[0.4px] text-sm text-center font-bold"> Don&apos;t have an account? <Link to="/" className="text-orange-300">
          Sign Up
        </Link></h3>
        </div>
    )
}
export default Login