import React from 'react'
import {HiOutlineUserGroup, HiArrowNarrowUp} from 'react-icons/hi';

let count = 0;
const HorizontalCard = ({heading,total,lastMonth}) => {
   console.log("dddd", ++count)
  return (
    <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shodow-md'>
        <div className='flex justify-between'>
            <div className=''>
                <h3 className='text-gray-500 text-md uppercase'>{heading}</h3>
                <p className='text-2xl'>{total}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' /> 
        </div>
        <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp />
                {lastMonth}
            </span>
            <div className='text-gray-500'>Last month</div>
        </div>
    </div>
  )
}

export default HorizontalCard;