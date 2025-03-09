import 'react'
import Sidebar from './Sidebar'

export const Profile = () => {
  return (
    <div className='flex'>
        <div><Sidebar/></div>
        <div>This is your profile</div>
    </div>
  )
}
