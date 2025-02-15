import FavoriteRoom from "@/components/favorite/FavoriteRoom";
import Footer from "@/components/footer/Footer";
import LastViewRoom from "@/components/lastViewRoom/LastViewRoom";
import Navbar from "@/components/navbar/Navbar";
import { NextPage } from "next";

const FavoriteListPage:NextPage = ()=>{
    return(
        <div>
            <Navbar/>
            <LastViewRoom/>
            <FavoriteRoom/>
            <Footer/>
        </div>
    )
}

export default FavoriteListPage;