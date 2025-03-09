import 'react'
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';


const Dashboard = () => {
  const location = useLocation();
  const { firstName, lastName } = location.state || { firstName: '', lastName: '' };

  return (
    <div className='h-full flex'>
      <div className=''><Sidebar/></div>
    <div className='flex-1 border border-b'>Welcome to your Dashboard {firstName} {lastName}</div>
</div>
  )
}

export default Dashboard