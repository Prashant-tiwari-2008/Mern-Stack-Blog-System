import React, { useEffect, useState } from 'react'
import { DashComments, DashPosts, DashProfile, DashSidebar, DashUser, DashboardComp } from '../components'
import { useLocation } from 'react-router-dom';

let count = 0;
const Dashboard = () => {
  const location = useLocation();
  const [tab,setTab] = useState('');
  console.log("dashboard count", ++count)

  useEffect(() => {
    const urlPrarms = new URLSearchParams(location.search);
    const tabFromUrl = urlPrarms.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search])

  return (
    <div className="h-[93vh] flex flex-col md:flex-row">
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      
      {(() => {
        switch (tab) {
          case "profile":
            return <DashProfile />
          case "dash":
            return <DashboardComp />
          case "posts":
            return <DashPosts />
          case "users":
            return <DashUser />
          case "comments":
            return <DashComments />
        }
      })()
      }
    </div>
  )
}

export default Dashboard
