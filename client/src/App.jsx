
import React from 'react'
import { Routes , Route} from 'react-router-dom'
import Homepage from './pages/Homepage.jsx'
import Loginpage from './pages/Loginpage.jsx'
import Profilepage from './pages/Profilepage.jsx'
const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>
        <Route path='/' element={<Homepage/>} />
         <Route path='/login' element={<Loginpage/>} />
         <Route path='/Profile' element={<Profilepage/>} />
      </Routes>
    </div>
  )
}

export default App
