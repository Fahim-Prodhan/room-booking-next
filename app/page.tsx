import Navbar from "@/components/navbar/Navbar";
import HeaderBanner from "../components/HeaderBanner/HeaderBanner";
import RoomsCard from "../components/RoomsCard/RoomsCard";
export default async function Home() {
  return (
    <div>
      <Navbar />
      <HeaderBanner />
      <div className="mx-24 mt-12">
        <p className="text-center font-bold text-4xl">Top Rooms</p>
        <RoomsCard />
      </div>
    </div>
  );
}
