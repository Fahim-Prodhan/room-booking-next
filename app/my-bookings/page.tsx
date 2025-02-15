import MyBookings from "@/components/MyBookings/MyBookings";
import Navbar from "@/components/navbar/Navbar";
import { NextPage } from "next";

const MyBookingsPage:NextPage = ()=>{
    return(
        <div>
            <Navbar/>
            <MyBookings/>
        </div>
    )
}

export default MyBookingsPage;