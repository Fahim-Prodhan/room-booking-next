import FavoriteRoom from "@/components/favorite/FavoriteRoom";
import Navbar from "@/components/navbar/Navbar";
import { NextPage } from "next";

const FavoriteListPage:NextPage = ()=>{
    return(
        <div>
            <Navbar/>
            <FavoriteRoom/>
        </div>
    )
}

export default FavoriteListPage;