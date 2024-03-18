import { Outlet } from 'react-router-dom'
import Footer from '../layouts/Layout/Footer'
import Navbar from '../layouts/Layout/Navbar'


export default function HomeTemplate() {
  return (
   <>
   <Navbar />
   <div className="bg-user-background  pt-5 " >
    <Outlet/>
   </div>
   
   {/* <Footer /> */}
   </>
  )
}
//phần dùng chung