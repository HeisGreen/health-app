import 'react'
import Sidebar from './Sidebar'

const Tracker = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50'>
      {/* Sidebar - Always fixed on left */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        <Sidebar/>
      </div>
      {/* Main Content - Offset for sidebar */}
      <div className="md:ml-64 min-w-0 p-6 md:p-8">
        <h1 className="text-3xl font-bold gradient-text mb-4">Calorie Tracker</h1>
        <p className="text-gray-600">Track your daily calorie intake</p>
      </div>
    </div>
  )
}

export default Tracker