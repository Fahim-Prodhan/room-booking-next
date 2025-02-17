import Navbar from "@/components/navbar/Navbar";
import HeaderBanner from "../components/HeaderBanner/HeaderBanner";
import RoomsCard from "../components/RoomsCard/RoomsCard";
import Footer from "@/components/footer/Footer";
export default async function Home() {
  
  return (
    <div>
      <Navbar />
      <HeaderBanner />
      <div className="lg:mx-24 md:mx-1 mt-12">
        <RoomsCard />
      </div>
      <Footer/>
    </div>
  );
}
