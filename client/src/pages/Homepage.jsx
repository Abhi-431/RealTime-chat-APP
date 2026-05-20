import React, { useState } from 'react'
import Leftside from '../componant/Sidebox'
import Chatcontainer from '../componant/Chatcontainer'
import Rightside from '../componant/Rightbox'

const Homepage = () => {
    const [selectedUser,setSelectedUser]=useState(false)
  return (
    <div className="w-full border h-screen sm:px-[15%] sm:py-[5%]">
     <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl 
        overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ?
            'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]':'md:grid-cols-2'
         }`}>
        
      <Leftside selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      <Chatcontainer selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      <Rightside selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
     </div>
    </div>
  )
}

export default Homepage