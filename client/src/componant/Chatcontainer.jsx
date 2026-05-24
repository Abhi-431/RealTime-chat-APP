import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

const Chatcontainer = ({selectedUser,setSelectedUser}) => {
  const scrollEnd=useRef()
  useEffect(()=>{
    if(scrollEnd.current){
     scrollEnd.current.scrollIntoView({behavior:"smooth"}) 
    }
  },[])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/*----------Header-------------------*/}
      <div className='flex item-center gap-3 py-3 mx-3 border-b border-stone-500'>
        <img src={assets.profile_martin} alt="" className=' rounded-full w-8'/>
        <p  className='flex-1 text-lg text-white flex item-center gap-2'>Martin jonshan
           <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon}alt="" className='max-md:hidden max-w-5' />
      </div>
      {/*-----------Chat-Area----------*/}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messagesDummyData.map((msg,index)=>(
          <div className={`flex item-end gap-2 justify-end ${msg.senderId !=='680f5116f10f3cd28382ed02' &&'flex-row-reverse'}`} key={index}>
            {msg.image ?(
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg
              overflow-hidden mb-8' />
            ):(
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg
                mb-8 breaak-all bg-violet-500/30 text-white ${msg.senderId==='680f5116f10f3cd28382ed02'? 
                  'rounded-br-none':'rounded-bl-none'}`}>{msg.text}</p>
            )}
            <div className='text-center text-xs'>
              <img src={msg.senderId==='680f5116f10f3cd28382ed02'?
                 assets.avatar_icon:assets.profile_martin} alt="" className='w-7 rounded-full'/>
                 <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>

          </div>
        ))}
        <div ref={scrollEnd}>

        </div>
      </div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white '> Chat anytime ,anywhere</p>
    </div>
  )
}

export default Chatcontainer
