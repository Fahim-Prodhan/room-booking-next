
import FindRoom from "@/components/findRoom/FindRoom";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { NextPage } from "next";

const FindRomePage:NextPage = ()=>{
    return(
        <div>
            <Navbar/>
            <FindRoom/>
            <Footer/>
        </div>
    )
}

export default FindRomePage;