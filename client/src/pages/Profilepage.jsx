import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import assets from '../assets/assets'

const Profilepage = () => {
  const [selectedImg,setSelectedImg]=useState(null)
  const navigate=useNavigate()
  const [name ,setName]=useState("Charles Martin")
  const [bio,setBio]=useState("Hi Everyone, this is my Bio")

  const handelSubmit=async(e)=>{
    e.preventDefault();
    navigate('/')
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat 
    flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl border-2 text-gray-300 border-gray-600 rounded-lg backdrop-blur-2xl
       flex items-center justify-between max-sm:flex-col-reverse'>
        <form onSubmit={handelSubmit} className='flex flex-col p-10 gap-5 flex-1'>
          <h3 className='text-lg  text-amber-50'>
            profile details
          </h3>
          <label htmlFor="avatar" className='flex items-center gap-3
           cursor-pointor'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" 
            id='avatar' accept='.png, .png, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg):assets.
              avatar_icon} alt=""className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
              upload profile Image 
           </label>
           <input  onChange={(e)=>setName(e.target.value)} value={name}type="text" required placeholder='Your Name ' className='p-2 border border-gray-500 
           rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
           <textarea onChange={(e)=>setBio(e.target.value)} name="" placeholder=' Write profile bio' required className='p-2 border border-gray-500 
           rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ' rows={4}  id=""></textarea>
           <button type='submit' className='bg-gradient-to-r from-purple-500 to-violet-600
           text-white p-2 rounded-full text-lg cursor-pointer '>Save</button>
        </form>
        <img src={assets.logo_icon} className='max-w-44 aspect-square rounded-full
        mx-10 max-sm:mt-10' alt="" />
      </div>
    </div>
  )
}

export default Profilepage
